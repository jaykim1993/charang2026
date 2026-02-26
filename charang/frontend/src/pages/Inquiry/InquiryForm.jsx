import { useContext } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../contexts/Authcontext"
import { useNavigate } from "react-router-dom"
import axios from "axios";

import './InquiryForm.css'

export default function InquiryForm(){
    const navigate = useNavigate();

    const { userid, username } = useContext(AuthContext);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [password, setPassword] = useState('');

    const inquiryForm = () => {
        if(title === ""){
            alert('제목을 입력하세요.');
            return;
        }
        if(content === ""){
            alert('내용을 입력하세요.');
            return;
        }

        axios.post('/api/customerservice/inquiry/writePro', {
            userId: userid, title: title, content: content, password: password
        })
        .then((res) => {
            if(res.data === "success"){
                console.log("문의 - res.data : ", res.data);
                alert('등록되었습니다.');
                navigate(-1);
            }else{
                alert("문의 등록 실패 - 데이터 오류");
            }
        })
        .catch((error) => console.log("error : ", error))
    }

    return(
        <div className="inquiry">
            <h4>문의하기</h4>
            <div className="inquiry_form">
                <p>안녕하세요 <span className="userName">{username}</span>님, 무엇을 도와드릴까요?</p>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <input type="text" placeholder="제목을 입력하세요. (필수)" 
                                name="title" onChange={(e) => setTitle(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <textarea type="text" placeholder="문의 내용을 입력하세요. (필수)" rows="15" 
                                name="content" onChange={(e) => setContent(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="password" placeholder="비밀번호를 입력하세요. (선택사항)" 
                                name="password" onChange={(e) => setPassword(e.target.value)} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="submitinqu">
                <button onClick={inquiryForm}>등록하기</button>
                <button onClick={() => navigate(-1)}>뒤로가기</button>
            </div>
        </div>
    )
}

