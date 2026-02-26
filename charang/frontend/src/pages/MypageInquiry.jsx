import { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom"
import { AuthContext } from "../contexts/Authcontext";
import { useNavigate } from "react-router-dom"
import axios from "axios";

import './MypageInquiry.css'

export default function MypageInquiry() {
    const navigate = useNavigate();

    const { userid } = useContext(AuthContext);

    // 문의 목록
    const [inquiry, setInquiry] = useState([]);
    // 서버에서 받은 ph
    const [paging, setPaging] = useState({});
    // 현재 페이지 번호 (기본값 1)
    const [pageNum, setPageNum] = useState(1);
    // 선택한 문의 비밀번호 확인
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    // 모달
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 비밀번호
    const [inputPw, setInputPw] = useState("");

    useEffect(() => {
        axios.get(`/api/customerservice/inquiry/list?page=${pageNum}&userId=${userid}`)
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
    const myInquiryHandler = (item) => {
        if (item.password) {
            // 작성자 본인인지 확인
            if (userid === item.userId) {
                // 본인이면 비밀번호 입력 모달 띄우기
                setSelectedInquiry(item);
                setIsModalOpen(true);
            } else {
                // 본인이 아니면 경고창 띄우고 차단
                alert("본인이 작성한 비밀글만 열람할 수 있습니다.");
            }
        } else {
            navigate(`/customerservice/inquiry/list/info/${item.inquiryId}`);
        }
    }

    return (
        <div className="mypage_inquiry">
            <h4>문의내역</h4>
            <div className='MyInquiryWrap'>
                <p className='inquiryCnt'>총 <strong>{inquiry.length}</strong>건</p>
                {inquiry.length === 0 ? (
                    <div className='inquiry_none'>
                        <i className="bi bi-x-lg"></i>
                        <p>문의내역이 없습니다.</p>
                        <Link to={'/customerservice/inquiry/write'} className='mypage_btn'>
                            1:1 문의하기
                        </Link>
                    </div>
                ) : (
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
                                <tr key={index} onClick={() => myInquiryHandler(index)}>
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
                )}
                {isModalOpen && (
                    <>
                        <div className="isModalOpen">
                            <h4>비밀번호 입력</h4>
                            <p>비밀글입니다. 비밀번호를 입력해주세요.</p>
                            <input type="password" value={inputPw}
                                onChange={(e) => setInputPw(e.target.value)}
                                placeholder="비밀번호" autoFocus /> {/* autoFocus : 모달 열리면 바로 입력 가능 */}
                            <div className="modal_btn">
                                <button onClick={passwordChk} className="pwBtnYes">확인</button>
                                <button onClick={() => setIsModalOpen(false)} className="pwBtnNo">취소</button>
                            </div>
                        </div>
                        <div className="pwOverlay"></div>
                    </>
                )}
            </div>
        </div>
    )
}