import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/Authcontext";

import './AllUserPage.css';

export default function AllUserPage(){

    const {search,user, setSearch, find, pagesHandler, paging, checkHandler, delHandler,pageNum, setPageNum} = useContext(AuthContext);

    useEffect(()=>{
        find();
    },[]);
    
    useEffect(()=>{
        find();
    },[pageNum]);

    return(
        <div className="ManagerAllUser">
            <h1>전체 회원 목록</h1>

            {/* 검색 */}
            <div className="mau_find">
                <input type="text" name="searchWord" onChange={(e)=> setSearch(e.target.value)}/>
                <button type="button" onClick={find}>검색</button>
            </div>

            <table className="managerAllUser_table" border={1}>
                <thead className="managerAllUser_table_th">
                    <tr className="managerAllUser_tr">
                        <th className="managerAllUser_num">번호</th>
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
                                <td>{index+1}</td>
                                <td>{user.userId}</td>
                                <td>{user.name}</td>
                                <td>{user.mail}</td>
                                <td>{user.resistNum}</td>
                                <td>{user.phone}</td>
                                <td>{user.regDate}</td>
                                <td className="mau_delCheck">
                                    {/* 체크한 회원의 userId만 값을 들고옴 */}
                                    {/* e : 해당 값의 체크 상태를 확인하기 위해 */}
                                    <input type="checkbox" name="delcheck" 
                                    className="AllUser_del" onChange={(e)=>{checkHandler(e, user.userId)}}></input>
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