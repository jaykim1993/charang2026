import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom"
import './CustomerService.css'
import { AuthContext } from "../contexts/Authcontext"
import { useNavigate } from "react-router-dom"
import { DataContext } from "../contexts/Datacontext";



export default function CustomerServiceNotice(){
const {notices} = useContext(DataContext);

    return(
     <div className="guideRight">
        <div className="customerService_notice">
            <thead>
                <tr>
                <th className="customerService_notice_th">글번호</th>
                <th className="customerService_notice_th">제목</th>
                <th className="customerService_notice_th">내용</th>
                <th className="customerService_notice_th">등록일</th>
                </tr>
            </thead>
            <tbody>
            {notices && notices.length > 0 ? (
            notices.map((notice, index) => (
            <tr key={notice.id || index}>
                <Link to={`/customerservice/notice/${notices.id}`} onClick={() => window.scrollTo(0,0)}>
                <td>{notice.id || index + 1}</td>
                <td>{notice.title}</td>
                <td>{notice.content}</td>
                <td>{notice.regDate}</td>
                </Link>
            </tr>
          ))
        ) : (
        <tr>
            <td colSpan="4" style={{ textAlign: "center" }}>
              등록된 공지사항이 없습니다.
            </td>
        </tr>
        )}
            </tbody>
        </div>
        
    </div>
    )
}