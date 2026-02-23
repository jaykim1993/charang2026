import './MypageInquiry.css'
import { useContext } from "react"
import { AuthContext } from '../contexts/Authcontext';
import { Link } from 'react-router-dom';

export default function MypageInquiry(){
    const {userid}=useContext(AuthContext);

    // 1:1 문의내역
    //로컬스토리지 문의내역 받아오기
    const allInquiries = JSON.parse(localStorage.getItem("inquiries")) || [];
    // console.log(allInquiries)

    // 변수에 필터한 배열 담기
    const myInquiries = allInquiries.filter(item => item.userid === userid);
    // console.log(myInquiries)

    const seeinquiry = ()=>{
        alert('응답이 완료된 후 열람할 수 있습니다.')
    }

    return(
        <div className="mypage-inquries">
        {/* <h1 className="guideMainText">마이페이지</h1> */}
        <h2 className="guideMainText">1:1문의내역</h2>
        <div className='MyInquiryWrap'>
            {myInquiries.length === 0 ? (
            <div>
                <div className="mypageBookCard">
                    <div className="myBooked_noBook">
                        <p>아직 예약내역이 없습니다.</p>
                        <div>
                            <span>!</span>
                        </div>
                    </div>
                </div>
                <Link to={'/customerservice/inquiry'}><button className='noBookedGoToBook'>1:1 문의하기</button></Link>
            </div> 
                ) : (
            <table className="mypage-inquiries-table">
                <thead>
                    <tr>
                    <th className='mytable1'>번호</th>
                    <th className='mytable2'>제목</th>
                    <th className='mytable3'>내용</th>
                    <th className='mytable4'>작성일</th>
                    <th className='mytable5'>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {myInquiries.length === 0 ? (
                    <tr>
                        <td colSpan="4" style={{ textAlign: "center" }}>
                        문의 내역이 없습니다.
                        </td>
                    </tr>
                    ) : (
                    myInquiries.map((data, index) => (
                        <tr onClick={seeinquiry} className='myinquTr' key={data.id}>
                            <td className='mytable1TD'>{myInquiries.length - index}</td>
                            <td className='mytable2TD'>{data.title}</td>
                            <td className='mytable3TD'>{data.content}</td>
                            <td className='mytable4TD'>{data.whenCreate.slice(0, 10)}</td>
                            {/* <td className='mytable5TD'><span>대기중</span></td> */}
                            <td className='mytable5TD'>답변 대기</td>
                        </tr>
                    ))
                    )}
                </tbody>
            </table>
            )
            }
        </div>
    </div>
    )
}