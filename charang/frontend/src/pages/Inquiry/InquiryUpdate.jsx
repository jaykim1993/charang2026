import { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom"
import { AuthContext } from "../../contexts/Authcontext"
import { useNavigate } from "react-router-dom"
import axios from "axios";

import './InquiryUpdate.css'

export default function InquiryUpdate() {
    const navigate = useNavigate();

    const { userid, username } = useContext(AuthContext);

    const { inquiryId } = useParams();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        password: ''
    });

    console.log(inquiryId);

    // const [inquiry, setInquiry] = useState({});
    // const [content, setContent] = useState('');

    useEffect(() => {
        axios.get(`/api/customerservice/inquiry/list/info/${inquiryId}`)
            .then((res) => {
                setFormData({
                    title: res.data.title,
                    content: res.data.content,
                    password: res.data.password || '' // null일 경우 빈 문자열
                });
                console.log("문의 수정 - res.data : ", res.data);
            })
            .catch(error => console.log("error : ", error));
    }, [inquiryId]);
    

    // input, textarea 변경핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const inquiryUpdateForm = () => {
        if (!formData.title) return alert('제목을 입력하세요.');
        if (!formData.content) return alert('내용을 입력하세요.');

        axios.put(`/api/customerservice/inquiry/list/info/updatePro`, {
            inquiryId: inquiryId,
            userId: userid,
            title: formData.title,
            content: formData.content,
            password: formData.password
        })
            .then((res) => {
                if (res.data === "success") {
                    alert('수정되었습니다.');
                    navigate(-1);
                } else {
                    alert("수정 실패 - 데이터 오류");
                }
            })
            .catch((error) => console.log("error : ", error));
    }

    return (
        <div className="inquiryUpdate">
            <h4>문의수정하기</h4>
            <div className="inquiryUpdateform">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <input name="title" placeholder="제목을 입력하세요. (필수)"
                                    value={formData.title} onChange={handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <textarea type="text" placeholder="문의 내용을 입력하세요. (필수)" rows="15"
                                    name="content" onChange={handleChange} value={formData.content} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="password" placeholder="비밀번호 확인 (선택사항)"
                                    name="password" onChange={handleChange} value={formData.password} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="submitinqu">
                <button onClick={inquiryUpdateForm}>수정하기</button>
            </div>
        </div>
    )
}