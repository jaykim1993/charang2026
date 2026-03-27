import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { AuthContext } from "../../contexts/Authcontext"
import { DataContext } from "../../contexts/Datacontext";
import axios from "axios";

import './CustomerServiceNotice.css'

export default function CustomerServiceNotice() {
    const { pageNum, setPageNum, pagesHandler, paging, setPaging, visitChild } = useContext(DataContext);
    // --- 추가된 초기화 로직 ---
    if(visitChild == false){
        useEffect(() => {
                // 다른 페이지에서 진입 시 무조건 1페이지로 시작
                setPageNum(1);
            }, []); // 빈 배열([])을 넣어 마운트 시점에 딱 한 번만 실행되게 합니다.
    }
    
    // -----------------------
    // 로그인 정보/유저 현재 로그인 유저 아이디 알아야됨
    const { userid } = useContext(AuthContext);

    // 공지사항 목록 상태
    const [notice, setNotice] = useState([]);

    const navigate = useNavigate();
    //  검색 차량 출력(검색값 보내기) axios
    const [searchType, setSearchType] = useState('title');
    const [searchWord, setSearchWord] = useState('');


     useEffect(() => {
        if (pageNum !== 1) {
            setPageNum(1);
        }  
    }, [searchWord, searchType]);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            axios.get("/api/customerservice/notice", {
                params: {
                    page: pageNum,
                    searchType: searchType,
                    searchWord: searchWord
                }
            }).then(res => {
                setNotice(res.data.list);
                setPaging(res.data.ph);
            });
        }, 150);

        return () => clearTimeout(timer);

    }, [pageNum, searchWord, searchType]);

    // placeholder 삼항연산자
    const placeholderWord = () => {
        if (searchType === "title") {
            return "제목을 검색하세요";
        } else {
            return "내용을 검색하세요";
        }
    }

    const delKeyword = () => {
        setSearchWord("");
    }

    return (
        <div className="notice"
            style={{
                width: userid === 'admin' ? '1300px' : '100%',
                margin: userid === 'admin' ? '150px auto' : '0'
            }}>

            <div className="notice_admin" style={{ marginBottom: userid === 'admin' ? '11px' : '20px' }}>
                <h4>공지사항</h4>
                <div className="mac_find">
                    <div className="MAC_search">
                        {/* 검색 타입 */}
                        <select className="mac_type" name="searchType" onChange={(e) => setSearchType(e.target.value)}>
                            <option value="title">제목</option>
                            <option value="content">내용</option>
                        </select>
                        {/* 검색 */}
                        <input className="mac_word" type="text" name="searchWord" placeholder={placeholderWord()}
                            onChange={(e) => setSearchWord(e.target.value)} value={searchWord} />
                        {searchWord != "" ? <i className="bi bi-x-circle-fill" onClick={delKeyword}></i> : <></>}
                    </div>
                </div>
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
                                    <td className="notice_table_td">
                                        <Link to={`/customerservice/notice/Info/${item.noticeId}`}>
                                            {item.title}
                                        </Link>
                                    </td>
                                    <td>{item.modDate.slice(0, 10)}</td>
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
                {/* 관리자(=admin)일 때만 글쓰기 버튼 생김 */}
                {userid === 'admin' && (
                    <div className="adminBtn admin_notice_write">
                        <button className="adminBtn_1" onClick={() => navigate("/customerservice/notice/manager/write")}>
                            글쓰기
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}