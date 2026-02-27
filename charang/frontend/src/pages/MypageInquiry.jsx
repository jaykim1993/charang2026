import { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom"
import { AuthContext } from "../contexts/Authcontext";
import { DataContext } from "../contexts/Datacontext";
import { useNavigate } from "react-router-dom"
import axios from "axios";

import './MypageInquiry.css'

export default function MypageInquiry() {
    const { pageNum, setPageNum, pagesHandler, paging, setPaging } = useContext(DataContext);

    const navigate = useNavigate();

    const { userid } = useContext(AuthContext);

    // 문의 목록
    const [inquiry, setInquiry] = useState([]);
    // 선택한 문의 비밀번호 확인
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    // 모달
    const [isModalOpen_pwChk, setIsModalOpen_pwChk] = useState(false);
    // 비밀번호
    const [inputPw, setInputPw] = useState("");

    useEffect(() => {
        if (!userid) return;

        axios.get(`/api/customerservice/inquiry/list?page=${pageNum}&userId=${userid}`)
            .then((res) => {
                console.log("문의목록 - 받아온데이터 : ", res.data);
                setInquiry(res.data.list);  // 받아온 데이터
                setPaging(res.data.ph);  // 페이징
                console.log("문의목록 - res.data.list : ", res.data.list);
                console.log("문의목록 - res.data.ph : ", res.data.ph);
            })
            .catch(error => console.log("error : ", error));
    }, [pageNum, userid]);

    // 비밀번호가 있는지 체크
    const myInquiryHandler = (item) => {
        if (item.password) {
            // 작성자 본인인지 확인
            if (userid === item.userId) {
                // 본인이면 비밀번호 입력 모달 띄우기
                setSelectedInquiry(item);
                setIsModalOpen_pwChk(true);
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

    return (
        <div className="mypage_inquiry">
            <h4>개인문의내역</h4>

            <div className='MyInquiryWrap'>
                {inquiry.length === 0 ? (
                    <div className='mypage_none'>
                        <i className="bi bi-chat-square-dots"></i>
                        <p>문의내역이 없습니다.</p>
                        <Link to={'/customerservice/inquiry/write'} className='mypage_btn'>
                            문의하기
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="myInquiry_head">
                            <p className='inquiryCnt'>총 <strong>{inquiry.length}</strong>건</p>
                            <button onClick={() => navigate("/customerservice/inquiry/write")}>
                                문의하기
                            </button>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: '10%' }}>문의번호</th>
                                    <th>문의제목</th>
                                    <th style={{ width: '20%' }}>문의시간</th>
                                    <th style={{ width: '15%' }}>답변상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inquiry.map((data, index) => (
                                    <tr key={index} onClick={() => myInquiryHandler(data)}>
                                        <td>{paging.totalCnt - ((pageNum - 1) * paging.pageSize) - index}</td>
                                        <td>
                                            {data.password && <i className="bi bi-lock-fill"></i>}
                                            &nbsp;{data.title}
                                        </td>
                                        <td>{data.modDate}</td>
                                        {data.answer === null ? <td>답변 대기중</td> : <td>답변완료</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                    </>
                )}
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
            </div>
        </div>
    )
}