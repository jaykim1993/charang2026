import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { AuthContext } from "../../contexts/Authcontext"
import { DataContext } from "../../contexts/Datacontext";
import axios from "axios";

import './CustomerServiceNotice.css'

export default function CustomerServiceNotice(){
    const { pageNum, setPageNum, pagesHandler, paging, setPaging } = useContext(DataContext);

    // 로그인 정보/유저 현재 로그인 유저 아이디 알아야됨
    const { userid } = useContext(AuthContext);

    // 공지사항 목록 상태
    const [notice, setNotice] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/customerservice/notice?page=${pageNum}`)
        .then((res) => {
            console.log("공지사항전체 - 받아온데이터 : ", res.data);
            setNotice(res.data.list);  // 받아온 데이터
            setPaging(res.data.ph);  // 페이징
            console.log("공지사항 - res.data.list : ", res.data.list);
            console.log("공지사항 - res.data.ph : ", res.data.ph);
        })
        .catch(error => console.log("error : ", error));
    }, [pageNum]);
    
    return(
        <div className="notice" 
        style={{width: userid === 'admin' ? '1300px' : '100%', 
            margin: userid === 'admin' ?'150px auto' : '0'}}>
            <div className="notice_admin" style={{marginBottom: userid === 'admin' ?'11px' : '20px'}}>
                <h4>공지사항</h4>
                {/* 관리자(=admin)일 때만 글쓰기 버튼 생김 */}
                {userid === 'admin' && (
                    <div className="adminBtn">
                        <button className="adminBtn_1" onClick={() => navigate("/customerservice/notice/manager/write")}>
                            글쓰기
                        </button>
                    </div>
                )}
            </div>
            <div className="notice_table">
                <table>
                    <thead>
                        <tr>
                            <th>글번호</th>
                            <th>제목</th>
                            <th>등록일</th>
                            <th>조회수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notice.length > 0 ? (
                            notice.map((item, index) => (
                                <tr key={item.noticeId}>
                                    {/* 상세 페이지 이동 */}
                                        <td>{paging.totalCnt - ((pageNum - 1) * paging.pageSize) - index}</td>
                                        <td>
                                            <Link to={`/customerservice/notice/Info/${item.noticeId}`}>
                                                {item.title}
                                            </Link>
                                        </td>
                                        <td>{item.modDate.slice(0,10)}</td>
                                        <td>{item.readCount}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">등록된 공지사항이 없습니다.</td>
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
        </div>
    )
}