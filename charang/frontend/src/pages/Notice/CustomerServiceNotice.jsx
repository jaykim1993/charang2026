import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { AuthContext } from "../../contexts/Authcontext"
import { DataContext } from "../../contexts/Datacontext";
import './CustomerServiceNotice.css'
import axios from "axios";

export default function CustomerServiceNotice(){
    // const { pagesHandler, paging, setPaging, pageNum, setPageNum } = useContext(DataContext);

    // 서버에서 받은 ph
    const [paging, setPaging] = useState({}); 
    // 현재 페이지 번호 (기본값 1)
    const [pageNum, setPageNum] = useState(1); 

    // 페이지 이동 핸들러
    const pagesHandler = () => {
      const pageNumbers = [];
      // paging 가 있고, startPage와 endPage가 계산되었을 때만 작동
      if(paging.startPage && paging.endPage){
          for(let i = paging.startPage; i <= paging.endPage; i++){
              pageNumbers.push(i);
          }
      }
      // console.log("페이징 확인: ", pageNumbers);
      return pageNumbers;
    }

    // 로그인 정보/유저 현재 로그인 유저 아이디 알아야됨
    const { userid } = useContext(AuthContext);

    // const { noticeId, userId } = useParams(); 

    // 공지사항 목록 상태
    const [notice, setNotice] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/customerservice/notice?page=${pageNum}`)
        .then((res) => {
            console.log("공지사항전체 - 받아온데이터 : ", res.data);
            setNotice(res.data.list);  // 받아온 데이터
            setPaging(res.data.ph);  // 페이징
            console.log("res.data.list : ", res.data.list);
            console.log("res.data.ph : ", res.data.ph);
        })
        .catch(error => console.log("error : ", error));
    }, [pageNum]);

    console.log("렌더링 시점 paging 상태:", paging);
    
    return(
        <div className="notice">
            <div className="notice_admin">
                <h4>공지사항</h4>
                {/* 관리자(=admin)일 때만 글쓰기 버튼 생김 */}
                {userid === 'admin' && (
                    <div className="notice_adminBtn">
                        <button onClick={() => navigate("/customerservice/notice/manager/write")}>
                            글쓰기
                        </button>
                    </div>
                )}
            </div>
            <div className="notice_table">
                <table>
                    {/* <thead>
                        <tr>
                            <th>글번호</th>
                            <th>제목</th>
                            <th>등록일</th>
                            <th>조회수</th>
                        </tr>
                    </thead> */}
                    <tbody>
                        {notice.length > 0 ? (
                            notice.map((item) => (
                                <tr key={item.noticeId}>
                                    {/* 상세 페이지 이동 */}
                                        <td>{item.noticeId}</td>
                                        <td>
                                            <Link to={`/customerservice/notice/Info/${item.noticeId}`}>
                                                {item.title}
                                            </Link>
                                        </td>
                                        <td>{item.regDate}</td>
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
                <div className="notice_paging">
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