import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../contexts/Datacontext";
import { useNavigate } from "react-router-dom";
import './AllUserPage.css';
import axios from "axios";

export default function AllUserPage() {

    const {
        pagesHandler,
        paging,
        pageNum,
        setPageNum,
        user,
        setSortType,
        setSort,
        sortType,
        sort,
        userSearchWord,
        userFind,
        userSearchType,
        setUserSearchType,
        setUserSearchWord,
        bookStatusFind,
        allBookStatus,
        isUserLoading
    } = useContext(DataContext);

    // 실제 검색에 사용할 키워드
    const [searchKeyword, setSearchKeyword] = useState("");

    // ================= 초기 진입 =================
    useEffect(() => {
        setPageNum(1);
        setUserSearchWord("");
        setSearchKeyword("");
        bookStatusFind();
        userCount();
    }, []);

    // ================= 데이터 조회 =================
    useEffect(() => {
        userFind(searchKeyword);
        userCount();
    }, [pageNum, sortType, sort, searchKeyword]);

    // ================= 검색 =================
    const searchHandler = () => {
        setPageNum(1); 
        setSearchKeyword(userSearchWord);
    };

    const inputDelHandler = () => {
        setUserSearchWord("");
        setSearchKeyword("");
        setPageNum(1);
    };

    // ================= 정렬 =================
    const sortHandler = (type) => {

        if (sortType === type) {
            sort === "asc"
                ? setSort("desc")
                : setSort("asc");
        } else {
            setSortType(type);
            setSort("desc");
        }

        setPageNum(1);
    };

    // ================= 삭제 =================
    const [delUser, setDelUser] = useState([]);

    const checkHandler = (e, userId) => {

        let delUserCopy = [...delUser];

        if (e.target.checked) {
            delUserCopy.push(userId);
        } else {
            delUserCopy = delUser.filter(id => id !== userId);
        }

        setDelUser(delUserCopy);
    };

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

                    userFind(searchKeyword);
                    setDelUser([]);
                    userCount();

                } else {
                    alert("다시 시도해주세요.");
                }

            })
            .catch((error) => {
                console.log("삭제 에러:", error);
            });
    };

    // ================= 예약 여부 =================
    const noRes = (userId) => {

        const ingUser = allBookStatus
            .filter(status =>
                status.bookingStatus === "UPCOMING" ||
                status.bookingStatus === "ONGOING"
            )
            .map(res => res.userId);

        return ingUser.includes(userId);
    };

    // ================= 상세 페이지 =================
    const navigate = useNavigate();

    const oneInfoClick = (userId) => {
        navigate(`/manager/userDetail/${userId}`);
    };

    // ================= placeholder =================
    const placeholderWord = () => {

        if (userSearchType === "userId") {
            return "아이디를 검색하세요";
        }

        return "이름을 검색하세요";
    };

    // ================= 회원 수 =================
    const [userCnt, setUserCnt] = useState(0);

    const userCount = () => {

        axios.get("/api/allUserCount")
            .then((res) => {
                setUserCnt(res.data);
            })
            .catch((error) => {
                console.log("회원 수 에러:", error);
            });
    };

    // ================= 주민번호 마스킹 =================
    const maskNum = (num) => {

        if (!num) return "";

        return num.slice(0, 8) + "******";
    };

    return (
        <div className="ManagerAllUser">

            <h1>전체 회원목록</h1>

            {/* 검색 */}
            <div className="mau_find">

                <select
                    name="userSearchType"
                    className="mau_select"
                    value={userSearchType}
                    onChange={(e) => setUserSearchType(e.target.value)}
                >
                    <option value="userId">회원ID</option>
                    <option value="name">회원이름</option>
                </select>

                <input
                    type="text"
                    name="searchWord"
                    className="mau_input"
                    placeholder={placeholderWord()}
                    value={userSearchWord}
                    onChange={(e) => setUserSearchWord(e.target.value)}
                />

                {userSearchWord !== "" &&
                    <i
                        className="bi bi-x-circle-fill"
                        onClick={inputDelHandler}
                    ></i>
                }

                <button
                    className="mau_btn"
                    type="button"
                    onClick={searchHandler}
                >
                    검색
                </button>

                <p className="mau_info">
                    <i className="bi bi-exclamation-circle-fill"
                        style={{ paddingRight: "5px" }}></i>
                    이용 중이거나 예약된 내역이 있으면 삭제가 불가능합니다.
                </p>

                <button className="del_btn" onClick={delHandler}>
                    삭제하기
                </button>

            </div>

            {/* 테이블 */}
            <table className="managerAllUser_table" border={1}>

                <thead className="managerAllUser_table_th">
                    <tr className="managerAllUser_tr">

                        <th>번호</th>

                        <th onClick={() => sortHandler("userId")} className="managerAllUser_userId">회원ID<i class="bi bi-chevron-down"></i></th>

                        <th onClick={() => sortHandler("name")} className="managerAllUser_userName">회원이름<i class="bi bi-chevron-down"></i></th>

                        <th onClick={() => sortHandler("mail")} className="managerAllUser_userEmail">이메일<i class="bi bi-chevron-down"></i></th>

                        <th onClick={() => sortHandler("resistNum")} className="managerAllUser_userResiNum">주민등록번호<i class="bi bi-chevron-down"></i></th>

                        <th onClick={() => sortHandler("phone")} className="managerAllUser_userPhone">휴대폰번호<i class="bi bi-chevron-down"></i></th>

                        <th onClick={() => sortHandler("regDate")} className="managerAllUser_userRegDate">가입일자<i class="bi bi-chevron-down"></i></th>

                        <th>
                            삭제
                            <p>({delUser.length}/{userCnt})</p>
                        </th>

                    </tr>
                </thead>
                {isUserLoading ? (
                    <tbody className="m_AllCar_tb">
                        <tr className="m_AllCar_tr_none">
                            <td colSpan={8} className="m_AllCar_td_none">
                                회원정보를 불러오는 중입니다...
                            </td>
                        </tr>
                    </tbody>
                ) : user && user.length > 0 ? (

                    <tbody className="managerAllUser_table_tb">

                        {user.map((user, index) => {

                            const pageSize = paging?.pageSize || 10;
                            const rowNumber = (pageNum - 1) * pageSize + index + 1;

                            return (
                                <tr key={index}>
                                    <td>{rowNumber}</td>

                                    <td onClick={() => oneInfoClick(user.userId)} className="mau_td">
                                        {user.userId}
                                    </td>

                                    <td onClick={() => oneInfoClick(user.userId)} className="mau_td">
                                        {user.name}
                                    </td>

                                    <td onClick={() => oneInfoClick(user.userId)} className="mau_td">
                                        {user.mail}
                                    </td>

                                    <td onClick={() => oneInfoClick(user.userId)} className="mau_td">
                                        {maskNum(user.resistNum)}
                                    </td>

                                    <td onClick={() => oneInfoClick(user.userId)} className="mau_td">
                                        {user.phone}
                                    </td>

                                    <td>{user.regDate}</td>

                                    <td>
                                        {noRes(user.userId) || user.userId === "admin"
                                            ? <p>불가</p>
                                            :
                                            <input
                                                type="checkbox"
                                                checked={delUser.includes(user.userId)}
                                                onChange={(e) => checkHandler(e, user.userId)}
                                            />
                                        }
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>

                ) : (

                    <tbody>
                        <tr className="m_AllCar_tr_none">
                            <td className="m_AllCar_td_none" colSpan={7}>
                                회원이 존재하지 않습니다.
                            </td>
                        </tr>
                    </tbody>

                )}


            </table>

            {/* 페이징 */}
            <div className="paging">

                {paging.prev &&
                    <button
                        onClick={() =>
                            setPageNum(paging.startPage - 1)
                        }
                    >
                        <i className="bi bi-caret-left-fill"></i>
                    </button>
                }

                {pagesHandler().map(num => (

                    <button
                        key={num}
                        className={pageNum === num ? "active" : ""}
                        onClick={() => setPageNum(num)}
                    >
                        {num}
                    </button>

                ))}

                {paging.next &&
                    <button
                        onClick={() =>
                            setPageNum(paging.endPage + 1)
                        }
                    >
                        <i className="bi bi-caret-right-fill"></i>
                    </button>
                }

            </div>

        </div>
    )
}