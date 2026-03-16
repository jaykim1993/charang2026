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

    // 1. 초기 마운트 시 데이터 로드
    useEffect(() => {
        userCount();
        bookStatusFind();
        // 초기 진입 시에는 기존 검색어 등을 리셋하고 싶다면 아래 주석 해제
        // searchResetHandler();
    }, []);

    // 2. 핵심 통합 이펙트 (페이지, 정렬, 검색어가 바뀔 때마다 실행)
    // "검색" 버튼을 눌러서 pageNum이 1이 되거나, userSearchWord가 ""이 되면 여기서 반응합니다.
    useEffect(() => {
        userFind();
    }, [pageNum, sortType, sort]);

    // 3. 검색 핸들러: 단순히 페이지를 1로 세팅하여 위 useEffect를 트리거함
    const searchHandler = () => {
        if (pageNum === 1) {
            userFind(); // 이미 1페이지면 수동으로 한 번 더 호출
        } else {
            setPageNum(1); // 페이지가 바뀌면서 useEffect가 작동함
        }
    }

    // 4. 검색어 실시간 감시 (X 버튼 클릭 등으로 빈 값이 되었을 때 즉시 초기화 검색)
    useEffect(() => {
        if (userSearchWord === "") {
            setPageNum(1);
            userFind();
        }
    }, [userSearchWord]);

    // 5. X 버튼 (초기화) 핸들러
    const inputDelHandler = () => {
        setUserSearchWord("");
        setPageNum(1);
        setSortType("userId");
        setSort("desc");
        // 상태가 변하면 위 useEffect들이 순차적으로 반응합니다.
    }

    // 6. 정렬 핸들러
    const sortHandler = (type) => {
        if (sortType === type) {
            setSort(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortType(type);
            setSort("desc");
        }
        setPageNum(1);
    }

    // --- 이하 로직 (삭제 등) 동일 ---
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
                <select className="mau_select" value={userSearchType} onChange={(e) => setUserSearchType(e.target.value)}>
                    <option value="userId">회원ID</option>
                    <option value="name">회원이름</option>
                </select>
                <input type="text" className="mau_input" placeholder={placeholderWord()}
                    onChange={(e) => setUserSearchWord(e.target.value)} value={userSearchWord} />
                {userSearchWord !== "" && <i className="bi bi-x-circle-fill" onClick={inputDelHandler} style={{cursor:'pointer', marginLeft: '-25px', marginRight: '10px'}}></i>}
                <button className="mau_btn" onClick={searchHandler}>검색</button>
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
                    <tbody><tr><td colSpan={8} style={{textAlign:'center', padding:'40px'}}>로딩 중...</td></tr></tbody>
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
                            <tr><td colSpan={8} style={{textAlign:'center', padding:'40px'}}>데이터가 없습니다.</td></tr>
                        )}
                    </tbody>
                )}
            </table>

            <div className="paging">
                {paging.prev && <button onClick={() => setPageNum(paging.startPage - 1)}><i className="bi bi-caret-left-fill"></i></button>}
                {pagesHandler(paging).map(num => (
                    <button key={num} className={pageNum === num ? "active" : ""} onClick={() => setPageNum(num)}>{num}</button>
                ))}
                {paging.next && <button onClick={() => setPageNum(paging.endPage + 1)}><i className="bi bi-caret-right-fill"></i></button>}
            </div>
        </div>
    );
}