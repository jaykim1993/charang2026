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
        bookStatusFind, allBookStatus, isLoading 
    } = useContext(DataContext);

    const navigate = useNavigate();
    const [userCnt, setUserCnt] = useState(0);

    // 1. 컴포넌트 마운트 시 초기화
    useEffect(() => {
        setPageNum(1);
        setUserSearchWord('');
        setSortType('userId');
        setSort('desc');
        searchResetHandler();
        userCount();
    }, []);

    // 2. 검색, 페이지, 정렬이 바뀔 때 데이터를 불러오는 통합 이펙트
    useEffect(() => {
        userFind();
        bookStatusFind();
        userCount();
    }, [pageNum, sortType, sort]);

    // 3. 검색어 실시간 감시 (검색어를 다 지웠을 때만 자동 실행)
    useEffect(() => {
        if (userSearchWord === "") {
            setPageNum(1);
            userFind();
        }
    }, [userSearchWord]);

    // 검색 핸들러
    const searchHandler = () => {
        setPageNum(1);
        userFind();
    }

    // X 버튼: 검색어 및 모든 정렬/페이지 상태 초기화
    const inputDelHandler = () => {
        setUserSearchWord("");
        setPageNum(1);
        setSortType("userId");
        setSort("desc");
        // userFind는 위 useEffect[userSearchWord]가 감지해서 자동으로 호출합니다.
    }

    // 정렬 핸들러
    const sortHandler = (type) => {
        if (sortType === type) {
            setSort(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortType(type);
            setSort("desc");
        }
        setPageNum(1);
    }

    // 회원 삭제 로직
    const [delUser, setDelUser] = useState([]);
    const checkHandler = (e, userId) => {
        if (e.target.checked) {
            setDelUser(prev => [...prev, userId]);
        } else {
            setDelUser(prev => prev.filter(id => id !== userId));
        }
    }

    const delHandler = () => {
        if (delUser.length === 0) {
            alert("삭제할 회원을 선택해주세요.");
            return;
        }
        const confirmCancel = window.confirm(`${delUser.length}명의 회원데이터를 삭제하시겠습니까?`);
        if (!confirmCancel) return;
        
        axios.delete("/api/delete", { data: delUser })
            .then((res) => {
                if (res.data === 1) {
                    alert(`${delUser.length}명의 회원데이터가 삭제되었습니다`);
                    setDelUser([]);
                    userFind();
                    userCount();
                } else {
                    alert("다시 시도해주세요.");
                }
            })
            .catch((error) => console.log("삭제 에러: ", error));
    }

    const noRes = (userId) => {
        const ingUser = allBookStatus
            .filter(book => book.bookingStatus === "UPCOMING" || book.bookingStatus === "ONGOING")
            .map(res => res.userId);
        return ingUser.includes(userId);
    }

    const userCount = () => {
        axios.get("/api/allUserCount")
            .then((res) => setUserCnt(res.data))
            .catch((error) => console.log("카운트 에러: ", error));
    }

    const oneInfoClick = (userId) => navigate(`/manager/userDetail/${userId}`);
    const placeholderWord = () => userSearchType === 'userId' ? "아이디를 검색하세요" : "이름을 검색하세요";
    const maskNum = (num) => num ? num.slice(0, 8) + "******" : "";

    return (
        <div className="ManagerAllUser">
            <h1>전체 회원목록</h1>

            <div className="mau_find">
                <select name="userSearchType" className="mau_select" value={userSearchType} onChange={(e) => setUserSearchType(e.target.value)}>
                    <option value="userId">회원ID</option>
                    <option value="name">회원이름</option>
                </select>
                <input type="text" className="mau_input" placeholder={placeholderWord()}
                    onChange={(e) => setUserSearchWord(e.target.value)} value={userSearchWord} />
                {userSearchWord !== "" && <i className="bi bi-x-circle-fill" onClick={inputDelHandler} style={{cursor:'pointer'}}></i>}
                <button className="mau_btn" onClick={searchHandler}>검색</button>
                <p className="mau_info">
                    <i className="bi bi-exclamation-circle-fill" style={{ paddingRight: "5px" }}></i>
                    이용 중이거나 예약된 내역이 있으면 삭제가 불가능합니다.
                </p>
                <button className="del_btn" onClick={delHandler}>삭제하기</button>
            </div>

            <table className="managerAllUser_table">
                <thead className="managerAllUser_table_th">
                    <tr className="managerAllUser_tr">
                        <th>번호</th>
                        <th onClick={() => sortHandler("userId")} style={{cursor:'pointer'}}>회원ID</th>
                        <th onClick={() => sortHandler("name")} style={{cursor:'pointer'}}>회원이름</th>
                        <th onClick={() => sortHandler("mail")} style={{cursor:'pointer'}}>이메일</th>
                        <th onClick={() => sortHandler("resistNum")} style={{cursor:'pointer'}}>주민번호</th>
                        <th onClick={() => sortHandler("phone")} style={{cursor:'pointer'}}>휴대폰번호</th>
                        <th onClick={() => sortHandler("regDate")} style={{cursor:'pointer'}}>가입일자</th>
                        <th>삭제<p>({delUser.length}/{userCnt})</p></th>
                    </tr>
                </thead>

                {isLoading ? (
                    <tbody>
                        <tr><td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>데이터를 불러오는 중입니다...</td></tr>
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
                            <tr><td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>회원 정보가 없습니다.</td></tr>
                        )}
                    </tbody>
                )}
            </table>
{/* d */}
            <div className="paging">
                {paging.prev && (
                    <button onClick={() => setPageNum(paging.startPage - 1)}>
                        <i className="bi bi-caret-left-fill"></i>
                    </button>
                )}
                {pagesHandler(paging).map(num => (
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