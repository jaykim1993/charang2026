import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/Authcontext"
import { DataContext } from "../../contexts/Datacontext";
import { useNavigate } from "react-router-dom"
import axios from "axios";

import './AllInquiry.css'

export default function AllInquiry() {
    const { pageNum, setPageNum, pagesHandler, paging, setPaging } = useContext(DataContext);
    const navigate = useNavigate();

    const { userid, username } = useContext(AuthContext);

    // 문의 목록
    const [inquiry, setInquiry] = useState([]);
    // 선택한 문의 비밀번호 확인
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    // 모달
    const [isModalOpen_pwChk, setIsModalOpen_pwChk] = useState(false);
    // 비밀번호
    const [inputPw, setInputPw] = useState("");

    useEffect(() => {
        axios.get(`/api/customerservice/inquiry/list?page=${pageNum}`)
            .then((res) => {
                console.log("문의목록 - 받아온데이터 : ", res.data);
                setInquiry(res.data.list);  // 받아온 데이터
                setPaging(res.data.ph);  // 페이징
                console.log("문의목록 - res.data.list : ", res.data.list);
                console.log("문의목록 - res.data.ph : ", res.data.ph);
            })
            .catch(error => console.log("error : ", error));
    }, [pageNum]);

    // 비밀번호가 있는지 체크
    const pwChkHandler = (item) => {
        // 관리자는 비밀번호 무시
        if (userid === 'admin') {
            navigate(`/customerservice/inquiry/list/info/${item.inquiryId}`);
            return;
        }

        if (item.password) {
            // 작성자 본인인지 확인
            if (userid === item.userId) {
                // 본인이면 비밀번호 입력 모달 띄우기
                setSelectedInquiry(item);
                setIsModalOpen_pwChk(true);
            } else {
                // 본인이 아니면 경고창 띄우고 차단
                alert("본인이 작성한 비밀글만 열람할 수 있습니다.");
            }
        } else {
            navigate(`/customerservice/inquiry/list/info/${item.inquiryId}`);
        }
    }

    // 비밀번호 확인 함수
    const passwordChk = () => {
        if (inputPw === selectedInquiry.password) {
            setIsModalOpen_pwChk(false);
            setInputPw(""); // 비밀번호 초기화
            navigate(`/customerservice/inquiry/list/info/${selectedInquiry.inquiryId}`);
        } else {
            alert("비밀번호가 틀렸습니다.");
            setInputPw("");
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
        <div className="AllInquiry" style={{
            width: userid === 'admin' ? '1300px' : '900px',
            margin: userid === 'admin' ? '150px auto' : '0'
        }}>
            <div className="Inquiry_head">
                <h4>문의하기</h4>
                {userid === 'admin' || !userid ?
                    <></>
                    : <button onClick={() => navigate("/customerservice/inquiry/write")}>
                        문의하기
                    </button>
                }
            </div>
            <table>
                <thead>
                    <tr>
                        <td style={{ width: '15%' }}>문의번호</td>
                        <td style={{ width: '15%' }}>작성자</td>
                        <td style={{ width: '30%' }}>문의제목</td>
                        <td style={{ width: '20%' }}>문의시간</td>
                        <td style={{ width: '15%' }}>답변상태</td>
                    </tr>
                </thead>
                <tbody>
                    {inquiry.length > 0 ? (
                        inquiry.map((item, index) => (
                            <tr key={item.inquiryId} onClick={() => pwChkHandler(item)}>
                                {/* 상세 페이지 이동 */}
                                {userid === 'admin' ? <td>{item.inquiryId}</td>
                                    : <td>{paging.totalCnt - ((pageNum - 1) * paging.pageSize) - index}</td>}
                                {item.name === null ? <td>(알수없음)</td>
                                    : <td>{maskName(item.name)}</td>}
                                <td>
                                    {item.password && <i className="bi bi-lock-fill"></i>}
                                    &nbsp;{item.title}
                                </td>
                                <td>{item.modDate}</td>
                                {item.answer === null ? <td>답변 대기중</td> : <td>답변완료</td>}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">등록된 문의가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {isModalOpen_pwChk && (
                <>
                    <div className="isModalOpen_pwChk">
                        <h4>비밀번호 입력</h4>
                        <p>비밀글입니다. 비밀번호를 입력해주세요.</p>
                        <input type="password" value={inputPw}
                            onChange={(e) => setInputPw(e.target.value)}
                            placeholder="비밀번호" autoFocus /> {/* autoFocus : 모달 열리면 바로 입력 가능 */}
                        <div className="modal_btn">
                            <button onClick={passwordChk} className="pwBtnYes">확인</button>
                            <button onClick={() => setIsModalOpen_pwChk(false)} className="pwBtnNo">취소</button>
                        </div>
                    </div>
                    <div className="pwOverlay"></div>
                </>
            )}
            {/* 페이징 */}
            <div className="paging">
                {/* 이전 버튼 */}
                {/* 5페이지 넘어가야 화살표 나옴 */}
                {paging.prev && (
                    <button onClick={() => setPageNum(paging.startPage - 1)}>
                        <i className="bi bi-caret-left-fill"></i>
                    </button>
                )}

                {/* 페이지 번호들 */}
                {pagesHandler(paging).map(num => (
                    <button key={num} className={pageNum === num ? "active" : ""} onClick={() => setPageNum(num)}>
                        {num}
                    </button>
                ))}

                {/* 다음 버튼 */}
                {paging.next && (
                    <button onClick={() => setPageNum(paging.endPage + 1)}>
                        <i className="bi bi-caret-right-fill"></i>
                    </button>
                )}
            </div>
        </div>
    )
}
