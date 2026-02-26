import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/Authcontext";
import { BookingContext } from "../../contexts/Bookingcontext";
import { useNavigate } from "react-router-dom";

import './AllUserPage.css';
import axios from "axios";

export default function AllUserPage(){

    const {pagesHandler, paging, pageNum, setPageNum, setPaging} = useContext(AuthContext);
    const {myBooking}=useContext(BookingContext);

    // 검색 회원 출력
    // const [searchValue, setSearchValue] = useState('');
    const [search, setSearch] = useState(''); // 검색어 담는 상태변수
    const [ user, setUser] = useState([]);

    const find = () => {
        axios.get("/api/searchUser",{params:{search:search,page:pageNum}})
        .then((res)=>{
            console.log("검색 회원: ",res.data);
            setPaging(res.data.ph); // 페이징
            setUser(res.data.list); // 검색 회원 가져온 데이터
            setSearch('');
        })
        .catch((error)=>{
            console.log("검색 회원 출력 에러: ",error);
        })
    }

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

    // [해당 회원들의 예약 유무 불러오기]
    const [allRes, setAllRes] = useState([]); // 현재,미래에 예약이 없는 회원id(탈퇴가능한 회원)를 담는 변수

    useEffect(()=>{
        axios.get('/api/isReservation')
        .then((res)=>{
            console.log("예약없는 회원id: ",res.data);
            setAllRes(res.data);
            console.log(allRes);
        })
        .catch((error)=>{
            console.log("예약없는 회원id 데이터 오류: ", error);
        })
    },[delUser]);

    const delHandler = () => {
        // 예약내역이 존재하는 회원인지 확인
        if(myBooking.length > 0){
            alert("예약 내역이 존재해 탈퇴가 불가능합니다.");
            return;
        }
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


    // 예약이 앞으로 존재하는 회원인지 구분
    const noRes = (userId) => {
        // 예약 존재 X
        return allRes.includes(userId);
    }

    useEffect(()=>{
        find();
    },[]);
    
    useEffect(()=>{
        find();
    },[pageNum]);

    // 해당 정보 상세보기 핸들러
    const navigate = useNavigate();

    const oneInfoClick = (userId) => {
        navigate(`/manager/userDetail/${userId}`); // 주소창에 ID를 실어서 페이지 자체를 이동
    }

    return(
        <div className="ManagerAllUser">
            <h1>전체 회원 목록</h1>

            {/* 검색 */}
            <div className="mau_find">
                <input type="text" name="searchWord" className="mau_input" placeholder="이름을 검색하세요"
                onChange={(e)=> setSearch(e.target.value)} value={search}/>
                <button className="mau_btn" type="button" onClick={find}>검색</button>
            </div>

            <table className="managerAllUser_table" border={1}>
                <thead className="managerAllUser_table_th">
                    <tr className="managerAllUser_tr">
                        {/* <th className="managerAllUser_num">번호</th> */}
                        <th className="managerAllUser_userId">회원아이디</th>
                        <th className="managerAllUser_userName">회원이름</th>
                        <th className="managerAllUser_userEmail">이메일</th>
                        <th className="managerAllUser_userResiNum">주민등록번호</th>
                        <th className="managerAllUser_userPhone">휴대폰번호</th>
                        <th className="managerAllUser_userRegDate">가입일자</th>
                        <th className="managerAllUser_userDel">삭제</th>
                    </tr>
                </thead>
                {user ? 
                    <tbody className="managerAllUser_table_tb">
                        {user.map((user,index) => (
                            <tr className="managerAllUser_tr" key={index}>
                                {/* <td>{index+1}</td> */}
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
                                        <p>예약 존재</p>
                                        :
                                        <input type="checkbox" name="delcheck" 
                                        className="AllUser_del" onChange={(e)=>{checkHandler(e, user.userId)}}></input>
                                    }
                                    
                                </td>
                            </tr>
                        ))}
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