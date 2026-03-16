import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../contexts/Datacontext";
import { useNavigate } from "react-router-dom";
import './AllUserPage.css';
import axios from "axios";

export default function AllUserPage() {
    const { 
        pagesHandler, paging, pageNum, setPageNum, user, searchResetHandler, 
        setSortType, setSort, sortType, sort, userSearchWord,
        userFind, userSearchType, setUserSearchType, setUserSearchWord, 
        bookStatusFind, allBookStatus, isLoading // DataContext에서 isLoading 가져오기
    } = useContext(DataContext);

    useEffect(() => {
        setPageNum(1);
        setUserSearchWord('');
        searchResetHandler();
        userCount();
    }, []);

    const searchHandler = () => {
        setPageNum(1);
        userFind();
    }

    useEffect(() => {
        if (userSearchWord === "") {
            setPageNum(1);
            userFind();
        }
    }, [userSearchWord]);

    const inputDelHandler = () => {
        setUserSearchWord("");
        setPageNum(1);
        searchResetHandler();
        userFind("");
    }

    const sortHandler = (type) => {
        if (sortType === type) {
            setSort(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortType(type);
            setSort("desc");
        }
        setPageNum(1);
        // 여기서 userFind()를 직접 호출하지 마세요. 아래 useEffect가 감지합니다.
    }

    useEffect(() => {
        userFind();
        bookStatusFind();
        userCount();
    }, [pageNum, sortType, sort]);

    // 회원 삭제 관련 로직
    const [delUser, setDelUser] = useState([]);
    const checkHandler = (e, userId) => {
        let delUserCopy = [...delUser];
        if (e.target.checked) {
            delUserCopy.push(userId);
        } else {
            delUserCopy = delUser.filter(id => id !== userId);
        }
        setDelUser(delUserCopy);
    }

    const delHandler = () => {
        if (delUser.length === 0) {
            alert("삭제할 예약을 선택해주세요.");
            return;
        }
        const confirmCancel = window.confirm(`${delUser.length}명의 회원데이터를 삭제하시겠습니까?`);
        if (!confirmCancel) return;
        axios.delete("/api/delete", { data: delUser })
            .then((res) => {
                if (res.data === 1) {
                    alert(`${delUser.length}명의 회원데이터가 삭제되었습니다`);
                    userFind();
                    setDelUser([]);
                    userCount();
                } else {
                    alert("다시 시도해주세요.");
                }
            })
            .catch((error) => console.log("삭제 에러: ", error));
    }

    const noRes = (userId) => {
        const ingUser = allBookStatus
            .filter(pastStatus => pastStatus.bookingStatus === "UPCOMING" || pastStatus.bookingStatus === "ONGOING")
            .map(res => res.userId);
        return ingUser.includes(userId);
    }

    const navigate = useNavigate();
    const oneInfoClick = (userId) => navigate(`/manager/userDetail/${userId}`);

    const placeholderWord = () => userSearchType === 'userId' ? "아이디를 검색하세요" : "이름을 검색하세요";

    const [userCnt, setUserCnt] = useState(0);
    const userCount = () => {
        axios.get("/api/allUserCount")
            .then((res) => setUserCnt(res.data))
            .catch((error) => console.log("카운트 에러: ", error));
    }

    const maskNum = (num) => num ? num.slice(0, 8) + "******" : "";

    return (
        <div className="ManagerAllUser">
            <h1>전체 회원목록</h1>

            <div className="mau_find">
                <select name="userSearchType" className="mau_select" onChange={(e) => setUserSearchType(e.target.value)}>
                    <option value="userId">회원ID</option>
                    <option value="name">회원이름</option>
                </select>
                <input type="text" className="mau_input" placeholder={placeholderWord()}
                    onChange={(e) => setUserSearchWord(e.target.value)} value={userSearchWord} />
                {userSearchWord !== "" && <i className="bi bi-x-circle-fill" onClick={inputDelHandler}></i>}
                <button className="mau_btn" onClick={searchHandler}>검색</button>
                <p className="mau_info">
                    <i className="bi bi-exclamation-circle-fill" style={{ paddingRight: "5px" }}></i>
                    이용 중이거나 예약된 내역이 있으면 삭제가 불가능합니다.
                </p>
                <button className="del_btn" onClick={delHandler}>삭제하기</button>
            </div>

            <table className="managerAllUser_table" border={1}>
                <thead className="managerAllUser_table_th">
                    <tr className="managerAllUser_tr">
                        <th>번호</th>
                        <th onClick={() => sortHandler("userId")} style={{cursor:'pointer'}}>회원ID</th>
                        <th onClick={() => sortHandler("name")} style={{cursor:'pointer'}}>회원이름</th>
                        <th onClick={() => sortHandler("mail")} style={{cursor:'pointer'}}>이메일</th>
                        <th onClick={() => sortHandler("resistNum")} style={{cursor:'pointer'}}>주민등록번호</th>
                        <th onClick={() => sortHandler("phone")} style={{cursor:'pointer'}}>휴대폰번호</th>
                        <th onClick={() => sortHandler("regDate")} style={{cursor:'pointer'}}>가입일자</th>
                        <th>삭제<p>({delUser.length}/{userCnt})</p></th>
                    </tr>
                </thead>

                {/* --- Step.2 로딩 상태 적용 부분 --- */}
                {isLoading ? (
                    <tbody>
                        <tr>
                            <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                                데이터를 불러오는 중입니다...
                            </td>
                        </tr>
                    </tbody>
                ) : (
                    <tbody className="managerAllUser_table_tb">
                        {user && user.length > 0 ? (
                            user.map((u, index) => {
                                const pageSize = paging?.pageSize || 10;
                                const rowNumber = (pageNum - 1) * pageSize + index + 1;
                                return (
                                    <tr className="managerAllUser_tr" key={u.userId || index}>
                                        <td>{rowNumber}</td>
                                        <td className="mau_td" onClick={() => oneInfoClick(u.userId)}>{u.userId}</td>
                                        <td className="mau_td" onClick={() => oneInfoClick(u.userId)}>{u.name}</td>
                                        <td className="mau_td" onClick={() => oneInfoClick(u.userId)}>{u.mail}</td>
                                        <td className="mau_td" onClick={() => oneInfoClick(u.userId)}>{maskNum(u.resistNum)}</td>
                                        <td className="mau_td" onClick={() => oneInfoClick(u.userId)}>{u.phone}</td>
                                        <td>{u.regDate}</td>
                                        <td className="mau_delCheck">
                                            {noRes(u.userId) ? <p>불가</p> : 
                                                <input type="checkbox" checked={delUser.includes(u.userId)}
                                                    onChange={(e) => checkHandler(e, u.userId)} />}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center' }}>회원 정보가 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                )}
            </table>

            <div className="paging">
                {paging.prev && (
                    <button onClick={() => setPageNum(paging.startPage - 1)}>
                        <i className="bi bi-caret-left-fill"></i>
                    </button>
                )}
                {pagesHandler().map(num => (
                    <button key={num} className={pageNum === num ? "active" : ""} onClick={() => setPageNum(num)}>
                        {num}
                    </button>
                ))}
                {paging.next && (
                    <button onClick={() => setPageNum(paging.endPage + 1)}>
                        <i className="bi bi-caret-right-fill"></i>
                    </button>
                )}
            </div>
        </div>
    );
}