import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // useParams 추가
import { AuthContext } from "../../contexts/Authcontext";
import './CustomerServiceNoticeInfo.css';
import axios from "axios";

export default function CustomerServiceNoticeInfo() {
    const navigate = useNavigate();
    
    // 주소창에서 :noticeId 자리에 있는 값을 바로 뽑아옴
    const { noticeId, userId } = useParams(); 
    const { userid } = useContext(AuthContext);
    const [notice, setNotice] = useState({});

    useEffect(() => {
        axios.get(`/api/customerservice/notice/Info/${noticeId}`)
        .then((res) => {
            setNotice(res.data);
            console.log("res.data : ", res.data);
        })
        .catch(error => console.log("error : ", error));
    }, [noticeId]);

    const handleDelete = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            axios.get(`/api/customerservice/notice/delete/${noticeId}`)
            .then((res) => {
                alert("삭제되었습니다.");
                navigate("/customerservice/notice");
            })
            .catch(error => console.log("error : ", error));
        }
    };

    if (!notice) return <div>로딩 중...</div>;

    return (
        <div className="noticeInfo">
            <h4>공지사항 │ {notice.regDate}</h4>
            <table>
                <tbody>
                    <tr>
                        <td colSpan="2">
                            <h3>{notice.title}</h3>
                        </td>
                    </tr>
                    <tr>
                        <th>조회수</th>
                        <td>{notice.readCount}</td>
                    </tr>
                    <tr>
                        <td colSpan="2" style={{fontSize: "17px", padding: "50px 5px"}}>{notice.content}</td>
                    </tr>
                </tbody>
            </table>

            <div className="noticeInfo_btn">
                <button onClick={() => navigate("/customerservice/notice")}>목록으로 돌아가기</button>
                
                {userid === 'admin' && (
                    <div className="notice_adminBtn">
                        <button onClick={() => navigate(`/customerservice/notice/modify/${noticeId}`)}>
                            수정하기
                        </button>
                        <button onClick={handleDelete}>
                            삭제하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}