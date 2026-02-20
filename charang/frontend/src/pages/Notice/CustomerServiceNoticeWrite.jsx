import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { AuthContext } from "../../contexts/Authcontext"
import { DataContext } from "../../contexts/Datacontext";
import '../CustomerService.css'
import './CustomerServiceNoticeWrite.css'
import axios from "axios";

export default function CustomerServiceNoticeWrite(){
    const navigate = useNavigate();

    const { userid } = useContext(AuthContext);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // 공지사항 작성 유효성 검사
    const noticeChk = () => {
        if(title === ""){
            alert('제목을 입력하세요.');
            return;
        }
        if(content === ""){
            alert('내용을 입력하세요.');
            return;
        }

        axios.post('/api/customerservice/notice/writePro', {title: title, content: content})
        .then((res) => {
            if(res.data === 1){
                console.log("res.data : ", res.data);
                alert('공지사항 등록 완료')
                navigate('/customerservice/notice');
            }else{
                alert("공지사항 등록 실패");
            }
        })
        .catch((error) => console.log("error : ", error))
    }


    return(
        <div className="notice_write">
            <h4>공지사항</h4>
            <table border="1">
                <tbody>
                    <tr>
                        <th>제목</th>
                        <td>
                            <input type="text" name="title" onChange={(e) => setTitle(e.target.value)} 
                            placeholder="제목을 입력하세요." />
                        </td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>
                            <textarea type="text" name="content" rows="15" cols="80" 
                            onChange={(e) => setContent(e.target.value)} placeholder="제목을 입력하세요." />
                        </td>
                    </tr>
                    <tr>
                        
                    </tr>
                </tbody>
            </table>
            <button onClick={noticeChk}>작성완료</button>
            {/* <button type="reset">초기화!!</button> */}
        </div>
    )
}