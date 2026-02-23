import { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom"
import { AuthContext } from "../../contexts/Authcontext"
import { useNavigate } from "react-router-dom"
import axios from "axios";

import './AllInquiryDetail.css'

export default function AllInquiryDetail() {
    const navigate = useNavigate();

    // const { userid } = useContext(AuthContext);

    const { inquiryId } = useParams();

    const [inquiry, setInquiry] = useState({});

    useEffect(() => {
        axios.get(`/api/manager/inquiry/list/info/${inquiryId}`)
            .then((res) => {
                setInquiry(res.data);
                console.log("문의 상세 - res.data : ", res.data);
            })
            .catch(error => console.log("error : ", error));
    }, [inquiryId]);

    return (
        <div className="AllInquiryDetail">
            <h1>문의상세</h1>
            <table>
                <tbody>
                    <tr>
                        <th>문의번호</th>
                        <td>{inquiry.inquiryId}</td>

                        <th>고객아이디</th>
                        <td>{inquiry.userId}</td>
                    </tr>
                    <tr>
                        <th>문의시간</th>
                        <td>{inquiry.modDate}</td>

                        <th>답변상태</th>
                        <td>
                            {inquiry.answer === null ?
                                <button onClick={() => navigate(`/manager/inquiry/answer/${inquiryId}`)}>답변하기</button>
                                : "답변완료"}
                        </td>
                    </tr>
                    <tr>
                        <th>문의제목</th>
                        <td colSpan={3}>{inquiry.title}</td>
                    </tr>
                    <tr>
                        <th>문의내용</th>
                        <td colSpan={3}>{inquiry.content}</td>
                    </tr>
                    <tr>
                        <th>답변</th>
                        <td colSpan={3} className="td">
                            {inquiry.answer || "아직 답변이 등록되지 않았습니다."}
                        </td>
                    </tr>
                </tbody>
            </table>
            <button onClick={() => navigate("/manager/inquiry/list")}>목록으로 돌아가기</button>
        </div>
    )
}