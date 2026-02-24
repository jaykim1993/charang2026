import { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom"
import { AuthContext } from "../../contexts/Authcontext"
import { useNavigate } from "react-router-dom"
import axios from "axios";

import './InquiryAnswer.css'

export default function InquiryAnswer() {
    const navigate = useNavigate();

    const { inquiryId } = useParams();

    const [inquiry, setInquiry] = useState({});
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        axios.get(`/api/customerservice/inquiry/list/info/${inquiryId}`)
            .then((res) => {
                setInquiry(res.data);
                console.log("문의 답변 - res.data : ", res.data);
            })
            .catch(error => console.log("error : ", error));
    }, [inquiryId]);

    const inquiryAnswer = () => {
        if (answer === "") {
            alert('답변을 입력하세요.');
            return;
        }

        axios.put('/api/manager/inquiry/answerPro', {
            inquiryId: inquiryId, answer: answer
        })
            .then((res) => {
                if (res.data === "success") {
                    console.log("답변등록 - res.data : ", res.data);
                    alert('답변 등록 완료!')
                    navigate(-1);
                } else {
                    alert("답변 등록 실패 - 데이터 오류");
                }
            })
            .catch((error) => console.log("error : ", error))
    }

    return (
        <div className="InquiryAnswer">
            <h1>문의 답변등록</h1>
            <table>
                <tbody>
                    <tr>
                        <th>문의번호</th>
                        <td colSpan={3}>{inquiry.inquiryId}</td>
                    </tr>
                    <tr>
                        <th>고객아이디</th>
                        <td>{inquiry.userId}</td>

                        <th>문의시간</th>
                        <td>{inquiry.modDate}</td>
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
                        <td colSpan={3} >
                            <textarea type="text" name="content" rows="20"
                            onChange={(e) => setAnswer(e.target.value)} placeholder="내용을 입력하세요." />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="adminBtn">
                <button onClick={inquiryAnswer}>답변하기</button>
            </div>
        </div>
    )
}