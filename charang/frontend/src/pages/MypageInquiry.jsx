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

    return (
        <div className="mypage_inquiry">
            <h4>1:1문의내역</h4>
            <div className='MyInquiryWrap'>
                <p className='inquiryCnt'>총 {inquiry.length}건</p>
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
                        {/* <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>내용</th>
                                <th>작성일</th>
                                <th>상태</th>
                            </tr>
                        </thead> */}
                        <tbody>
                            {inquiry.map((data, index) => (
                            <tr key={data.id}>
                                {/* <td>{index + 1}</td> */}
                                <td>{data.title}</td>
                                <td>{data.content}</td>
                                <td>{data.modDate.slice(0, 10)}</td>
                                {data.answer === null ? <td>답변 대기중</td> : <td>답변완료</td>}
                            </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}