import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../contexts/Datacontext";
import { useNavigate } from "react-router-dom";

import './AllUserPage.css';
import axios from "axios";

export default function AllUserPage(){

    const {pagesHandler, paging, pageNum, setPageNum, allBookCar, user, 
        userFind, setSearchType, setSearchWord, searchWord, bookFind} = useContext(DataContext);



    console.log(allBookCar);

    // 전체 예약, 전체 회원 출력 함수 호출
     useEffect(()=>{
        userFind();
        bookFind();
    },[pageNum]);

    // 회원 삭제
    const [delUser, setDelUser] = useState([]);
    // 체크된 회원의 id만 가져오는 핸들러
    const checkHandler = (e, userId) => {

        let delUserCopy = [...delUser];

        // 체크되어있으면 delUser배열에 넣기(true)
        if(e.target.checked){
            delUserCopy.push(userId);
            setDelUser(delUserCopy);
        }
        // 체크를 했다가 취소할 경우(false)
        else{
            delUserCopy = delUser.filter(id => id !== userId);
            setDelUser(delUserCopy);
        }
    }

    const delHandler = () => {
        if(delUser.length == 0){
            alert("삭제할 예약을 선택해주세요.");
            return;
        }else{
            axios.delete("/api/delete",{data:delUser})
            .then((res)=>{
                console.log("삭제 결과: ", res.data);
                if(res.data == 1){
                    alert("삭제되었습니다");
                    find();
                }else{
                    alert("다시 시도해주세요.");
                }
            })
            .catch((error)=>{
                console.log("받아온 삭제 결과 에러: ", error);
            })
        }
    }


    // 예약이 앞으로 존재하는 회원인지 구분
    const noRes = (userId) => {
        // 과거예약(map으로 pastUser에 배열로 출력시켜 담음)
        const pastUser = allBookCar.filter(pastStatus => pastStatus.bookingStatus === "PAST").map(res=>res.userId);
        return pastUser.includes(userId);
    }

    // 해당 정보 상세보기 핸들러
    const navigate = useNavigate();

    const oneInfoClick = (userId) => {
        navigate(`/manager/userDetail/${userId}`); // 주소창에 ID를 실어서 페이지 자체를 이동
    }

    // placeholder
    const placeholderWord = (searchType) => {
        console.log("검색", searchType);
         if(searchType === "userId"){
            return "아이디를 검색하세요";
        }else{
            return "이름을 검색하세요";
        }
    }


    return(
        <div className="ManagerAllUser">
            <h1>전체 회원 목록</h1>

            {/* 검색 */}
            <div className="mau_find">
                {/* 검색 타입 */}
                <select name="searchType" className="mau_select"
                onChange={(e)=> setSearchType(e.target.value)}>
                    <option value="userId">회원ID</option>
                    <option value="model">회원이름</option>
                </select>
                {/* 검색 단어*/}
                <input type="text" name="searchWord" className="mau_input" placeholder={placeholderWord(searchType)}
                onChange={(e)=> setSearchWord(e.target.value)} value={searchWord}/>
                <button className="mau_btn" type="button" onClick={userFind}>검색</button>
                <p className="mau_info">
                    <i className="bi bi-exclamation-circle-fill" style={{paddingRight:"5px"}}></i>
                    이용 중이거나 예약된 내역이 있으면 삭제가 불가능합니다.
                </p>
            </div>

            <table className="managerAllUser_table" border={1}>
                <thead className="managerAllUser_table_th">
                    <tr className="managerAllUser_tr">
                        <th className="managerAllUser_num">번호</th>
                        <th className="managerAllUser_userId">회원ID</th>
                        <th className="managerAllUser_userName">회원이름</th>
                        <th className="managerAllUser_userEmail">이메일</th>
                        <th className="managerAllUser_userResiNum">주민등록번호</th>
                        <th className="managerAllUser_userPhone">휴대폰번호</th>
                        <th className="managerAllUser_userRegDate">가입일자</th>
                        <th className="managerAllUser_userDel">회원삭제</th>
                    </tr>
                </thead>
                {user ? 
                    <tbody className="managerAllUser_table_tb">
                        {user.map((user,index) => {
                            const pageSize = paging?.pageSize || 10; // 페이지당 개수
                            const rowNumber = (pageNum - 1) * pageSize + index + 1;
                            

                            return  (<tr className="managerAllUser_tr" key={index}>
                                <td>{rowNumber}</td>
                                <td>
                                    <p>{user.userId}</p>
                                </td>
                                <td>
                                    <div className="mau_name" onClick={()=>oneInfoClick(user.userId)}>
                                        {user.name}
                                    </div>
                                </td>
                                <td>{user.mail}</td>
                                <td>{user.resistNum}</td>
                                <td>{user.phone}</td>
                                <td>{user.regDate}</td>
                                <td className="mau_delCheck">
                                    {/* 체크한 회원의 userId만 값을 들고옴 */}
                                    {/* e : 해당 값의 체크 상태를 확인하기 위해 */}
                                    {noRes(user.userId)?
                                        <p>불가</p>
                                        :
                                        <input type="checkbox" name="delcheck" 
                                        className="AllUser_del" onChange={(e)=>{checkHandler(e, user.userId)}}></input>
                                    }
                                    
                                </td>
                            </tr>)
                        })}
                    </tbody>
                :
                    <tbody className="managerAllUser_table_tb_none">
                        <tr className="managerAllUser_tr">
                            <td className="managerAllUser_table_td_none" colSpan={7}>
                                회원 정보가 없습니다.
                            </td>
                        </tr>
                    </tbody>
                }
            </table>

            {/* 페이징 */}
            <div className="notice_paging">
                {/* 이전 버튼 */}
                {/* 5페이지 넘어가야 화살표 나옴 */}
                {paging.prev && (
                    <button onClick={() => setPageNum(paging.startPage - 1)}>
                        <i className="bi bi-caret-left-fill"></i>
                    </button>
                )}

                {/* 페이지 번호들 */}
                {pagesHandler().map(num => (
                    <button key={num} className={pageNum === num ? "active" : ""} onClick={() => setPageNum(num)}>
                        {num}
                    </button>
                ))}

                {/* 다음 버튼 */}
                {paging.next && (
                    <button onClick={() => setPageNum(paging.endPage + 1)}>
                        <i className="bi bi-caret-right-fill"></i>
                    </button>
                )}
            </div>
            <div className="btn_part">
                <button className="del_btn" onClick={delHandler}>삭제하기</button>
            </div>
        </div>
    )
}