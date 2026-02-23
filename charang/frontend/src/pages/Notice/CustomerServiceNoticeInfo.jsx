import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // useParams 추가
import { AuthContext } from "../../contexts/Authcontext";
import './CustomerServiceNoticeInfo.css';
import axios from "axios";

export default function CustomerServiceNoticeInfo() {
    const navigate = useNavigate();
    
    // 주소창에서 :noticeId 자리에 있는 값을 바로 뽑아옴
    const { noticeId } = useParams();
    const { userid } = useContext(AuthContext);
    const [notice, setNotice] = useState({});

    useEffect(() => {
        axios.get(`/api/customerservice/notice/Info/${noticeId}`)
        .then((res) => {
            setNotice(res.data);
            console.log("공지 상세 - res.data : ", res.data);
        })
        .catch(error => console.log("error : ", error));
    }, [noticeId]);

    const handleDelete = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            // axios.delete(`/api/customerservice/notice/manager/delete/${noticeId}`)
            axios.delete("/api/customerservice/notice/manager/delete", { params: { noticeId: noticeId } })
            .then((res) => {
                if(res.data === 1){
                    alert("삭제되었습니다.");
                    navigate("/customerservice/notice");
                }else{
                    alert("삭제실패");
                }
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
                        <td>
                            <h4>{notice.title}</h4>
                        </td>
                        <td style={{width: '200px'}}>조회수&nbsp;&nbsp;&nbsp;&nbsp;{notice.readCount}</td>
                    </tr>
                    <tr>
                        <td colSpan="2" style={{fontSize: "17px", padding: "40px 5px", whiteSpace: "pre-wrap"}}>{notice.content}</td>
                    </tr>
                </tbody>
            </table>

            <div className="noticeInfo_btn">
                <button onClick={() => navigate("/customerservice/notice")}>목록으로 돌아가기</button>
                
                {userid === 'admin' && (
                    <div className="adminBtn">
                        <button onClick={() => navigate(`/customerservice/notice/manager/modify/${noticeId}`)}>
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