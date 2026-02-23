import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom"
import { AuthContext } from "../../contexts/Authcontext"
import { useNavigate } from "react-router-dom"
import axios from "axios";

import './AllInquiry.css'

export default function AllInquiry() {
    const navigate = useNavigate();

    const { userid } = useContext(AuthContext);

    // 문의 목록
    const [inquiry, setInquiry] = useState([]);
    // 서버에서 받은 ph
    const [paging, setPaging] = useState({});
    // 현재 페이지 번호 (기본값 1)
    const [pageNum, setPageNum] = useState(1);

    // 페이지 이동 핸들러
    const pagesHandler = () => {
        const pageNumbers = [];
        // paging 가 있고, startPage와 endPage가 계산되었을 때만 작동
        if (paging.startPage && paging.endPage) {
            for (let i = paging.startPage; i <= paging.endPage; i++) {
                pageNumbers.push(i);
            }
        }
        // console.log("페이징 확인: ", pageNumbers);
        return pageNumbers;
    }

    useEffect(() => {
        axios.get(`/api/manager/inquiry/list?page=${pageNum}`)
            .then((res) => {
                console.log("문의목록 - 받아온데이터 : ", res.data);
                setInquiry(res.data.list);  // 받아온 데이터
                setPaging(res.data.ph);  // 페이징
                console.log("문의목록 - res.data.list : ", res.data.list);
                console.log("문의목록 - res.data.ph : ", res.data.ph);
            })
            .catch(error => console.log("error : ", error));
    }, [pageNum]);

    return (
        <div className="AllInquiry">
            <h1>문의 전체</h1>
            <table>
                <thead>
                    <tr>
                        <td>문의번호</td>
                        <td>문의제목</td>
                        <td>고객아이디</td>
                        <td>문의시간</td>
                        <td>답변상태</td>
                    </tr>
                </thead>
                <tbody>
                    {inquiry.length > 0 ? (
                        inquiry.map((item) => (
                            <tr key={item.inquiryId}>
                                {/* 상세 페이지 이동 */}
                                <td>
                                    <Link to={`/manager/inquiry/list/info/${item.inquiryId}`}>
                                        {item.inquiryId}
                                    </Link>
                                </td>
                                <td>{item.userId}</td>
                                <td>{item.title}</td>
                                <td>{item.modDate}</td>
                                {item.answer === null ? <td>미응답</td> : <td>답변완료</td>}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">등록된 문의가 없습니다.</td>
                        </tr>
                    )}
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
        </div>
    )
}
