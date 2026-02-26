import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { AuthContext } from "../../contexts/Authcontext"
import { DataContext } from "../../contexts/Datacontext";
import './CustomerServiceNoticeModfiy.css'
import axios from "axios";

export default function CustomerServiceNoticeModfiy(){
    const navigate = useNavigate();

    const { noticeId } = useParams();

    const { userid } = useContext(AuthContext);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // 작성했던 내용 불러오기
    useEffect(() => {
        axios.get(`/api/customerservice/notice/Info/${noticeId}`)
            .then(res => {
                setTitle(res.data.title);
                setContent(res.data.content);
            });
    }, [noticeId]);

    // 공지사항 수정 유효성 검사
    const noticeMod = () => {
        if(!title){
            alert('제목을 입력하세요.');
            return;
        }
        if(!content){
            alert('내용을 입력하세요.');
            return;
        }

        axios.put(`/api/customerservice/notice/manager/modify/${noticeId}`, {
            title: title,
            content: content
        })
        .then((res) => {
            if(res.data === 1){
                console.log("res.data : ", res.data);
                alert('공지사항이 수정되었습니다.')
                navigate(`/customerservice/notice/Info/${noticeId}`);
            }else{
                alert("공지사항 수정 실패 - 권한이 없거나 데이터 오류");
            }
        })
        .catch((error) => console.log("error : ", error))
    }

    const backHandler = () => {
        if(confirm('저장되지 않습니다. 돌아가시겠습니까?')){
            navigate(-1);
        }else{
            return;
        }
    }

    return(
        <div className="notice_modfiy">
            <h4>공지사항 수정</h4>
            <table>
                <tbody>
                    <tr>
                        <th>제목</th>
                        <td>
                            <input type="text" name="title" onChange={(e) => setTitle(e.target.value)} 
                            placeholder="제목을 입력하세요." value={title} />
                        </td>
                    </tr>
                    <tr>
                        <th>공지내용</th>
                        <td>
                            <textarea type="text" name="content" rows="20" value={content}
                            onChange={(e) => setContent(e.target.value)} placeholder="내용을 입력하세요." />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="adminBtn">
                <button onClick={noticeMod} className="adminBtn_1">수정완료</button>
                <button onClick={backHandler} className="adminBtn_2">뒤로가기</button>
            </div>
        </div>
    )
}