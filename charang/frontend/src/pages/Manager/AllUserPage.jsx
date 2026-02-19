import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/Authcontext";

// import './AllUserPage.css';

export default function AllUserPage(){

    const {AllUser} = useContext(AuthContext);

    return(
        <div className="ManagerAllUser">
            <h1>전체 회원 목록</h1>
            <input type="text" name="search" onChange={(e)=>setSearch(e.target.value)}/>
            <button type="button">검색</button>
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
                    </tr>
                </thead>
                {AllUser ? 
                    <tbody className="managerAllUser_table_tb">
                        {AllUser.map((user,index) => (
                            <tr className="managerAllUser_tr" key={index}>
                                <td>{index+1}</td>
                                <td>{user.userId}</td>
                                <td>{user.name}</td>
                                <td>{user.mail}</td>
                                <td>{user.resistNum}</td>
                                <td>{user.phone}</td>
                                <td>{user.regDate}</td>
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
        </div>
    )
}