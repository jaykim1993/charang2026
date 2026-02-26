import { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom"
import { AuthContext } from "../../contexts/Authcontext"
import { useNavigate } from "react-router-dom"
import axios from "axios";

import './InquiryDetail.css'

export default function AllInquiryDetail() {
    const navigate = useNavigate();

    const { userid } = useContext(AuthContext);

    const { inquiryId } = useParams();

    const [inquiry, setInquiry] = useState({});

    useEffect(() => {
        axios.get(`/api/customerservice/inquiry/list/info/${inquiryId}`)
            .then((res) => {
                setInquiry(res.data);
                console.log("문의 상세 - res.data : ", res.data);
            })
            .catch(error => console.log("error : ", error));
    }, [inquiryId]);

    const deleteHandler = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            axios.delete(`/api/customerservice/inquiry/list/info/delete/${inquiryId}`)
                .then((res) => {
                    if (res.data === "success") {
                        alert("삭제되었습니다.");
                        navigate(-1); // 삭제 후 목록으로 이동
                    } else {
                        alert("삭제 실패");
                    }
                })
                .catch(error => console.log("삭제 에러 : ", error));
        }
    }

    // 마스킹 함수
    const maskName = (name) => {
        if (!name) return "";
        if (name.length <= 2) {
            return name.replace(name.substring(1), "*"); // 두 글자일 때 (예: 김철 -> 김*)
        }
        // 세 글자 이상일 때 (예: 홍길동 -> 홍*동)
        return name[0] + "*".repeat(name.length - 2) + name.slice(-1);
    };

    return (
        <div className="AllInquiryDetail">
            <h1>문의상세</h1>
            {inquiry.userId === userid && inquiry.answer === null ?
                <div className="inquiryDetail_updateBtn">
                    <button onClick={() => navigate(`/customerservice/inquiry/list/info/update/${inquiryId}`)}>
                        수정하기
                    </button>
                    <button onClick={deleteHandler}>삭제하기</button>
                </div>
                :
                <div className="inquiryDetail_updateBtn">
                    <button onClick={() => navigate(`/manager/inquiry/answer/${inquiryId}`)}>
                        답변하기
                    </button>
                </div>
            }
            <table>
                <tbody>
                    <tr>
                        <th>문의번호</th>
                        <td>{inquiry.inquiryId}</td>

                        <th>작성자</th>
                        {userid === inquiry.userId ? <td>{inquiry.name}({inquiry.userId})</td>
                            : <td>{maskName(inquiry.name)}({inquiry.userId})</td>}
                    </tr>
                    <tr>
                        <th>문의시간</th>
                        <td>{inquiry.modDate}</td>

                        <th>답변상태</th>
                        <td>
                            {inquiry.answer === null ?
                                (userid === "admin" ?
                                    <button onClick={() => navigate(`/manager/inquiry/answer/${inquiryId}`)}>
                                        답변하기
                                    </button>
                                    : "답변 대기중")
                                : "답변완료"}
                        </td>
                    </tr>
                    <tr>
                        <th>문의제목</th>
                        <td colSpan={3}>{inquiry.title}</td>
                    </tr>
                    <tr>
                        <th>문의내용</th>
                        <td colSpan={3} style={{ whiteSpace: "pre-wrap", height: "300px" }}>
                            {inquiry.content}
                        </td>
                    </tr>
                    <tr>
                        <th>답변</th>
                        <td colSpan={3} className="td"
                            style={{ whiteSpace: "pre-wrap", height: "300px" }}>
                            {inquiry.answer || "아직 답변이 등록되지 않았습니다."}
                        </td>
                    </tr>
                </tbody>
            </table>
            <button onClick={() => navigate("/customerservice/inquiry/list")}>목록으로 돌아가기</button>
        </div>
    )
}