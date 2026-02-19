import './MypageDetail.css'
import { useContext, useState } from "react";
import { BookingContext } from "../contexts/Bookingcontext";
import { AuthContext } from "../contexts/Authcontext";
import { CalendarContext } from '../contexts/Calendarcontext';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function MypageDetail(){
    const { id } = useParams(); // 예약번호
    const { myBookings, setBookedlistAll,bookedlistAll } = useContext(BookingContext); // 예약내역 보기 함수 호출
    const { userid, username } = useContext(AuthContext); // 유저 정보 호출
    const { DeleteYear, timeAMPM, startdayText, enddayText } = useContext(CalendarContext);

    const bookedThis = myBookings.find(book => book.id === id);

    const [showMap,setShowMap]=useState(false);

    const navigate = useNavigate()

    //리스트삭제핸들러
        const bookdeleteHandle = () => {
        setBookedlistAll(prev =>
            prev.filter(book => book.id !== id)
        );
        alert("예약이 취소되었습니다.");
        navigate("/mypage/booked");
        };

    //며칠 남앗는지
        const today = new Date();
            today.setHours(0, 0, 0, 0);
            const [y, m, d] = bookedThis.startDate.split('-');
            const startDate = new Date(y, m - 1, d);
            const diffDays = Math.ceil(
            (startDate - today) / (1000 * 60 * 60 * 24)
        );
        let dText;
            if (diffDays > 0) dText = `D-${diffDays}`;
            else if (diffDays === 0) dText = 'D-Day';
            else dText = `D+${Math.abs(diffDays)}`;
  
    //몇시간 이용하는지
        let date = (new Date(`${bookedThis.endDate}T${bookedThis.endTime}`)-new Date(`${bookedThis.startDate}T${bookedThis.startTime}`))/ (1000 * 60 * 30);
        const hours = Math.floor(date / 2);
        const minutes = (date % 2) * 30;

        const copyText = async (text) => {
            try {
                await navigator.clipboard.writeText(text);
                alert('예약번호가 복사되었습니다.')
            } catch (err) {
            }
        };

    return(
        <>
            <h1 className="guideMainText">마이페이지</h1>
            <h2 className="guideMainText">예약상세</h2>
                <div className='myPageDetailWrap'>
                    <div className='myPageDetail01'>
                        <div className='myPageDetailTop'>
                            <div >
                                <div className='myPageDetailTopflex'>
                                    <span className='myPageDetailname'>{username}</span>
                                    <span className='myPageDateLeft'>{dText}</span>
                                </div>
                                <div className='myPageDetailTopflex'>
                                    <span className='myPageDetailbooknum'>예약번호</span>
                                    <span className='myPageDetailspan1'>{bookedThis.id}</span>
                                    <i onClick={() => copyText(bookedThis.id)} className="bi bi-copy"></i>
                                </div>
                                <div className='myPageDetailTopflex'>
                                    <span className='myPageDetailwhengo'>출발일시</span>
                                    <span className='myPageDetailspan'>{DeleteYear(bookedThis.startDate)} ({startdayText}) {timeAMPM(bookedThis.startTime)}</span>
                                </div>
                            </div>
                            <div className='myPageCancleBtnBox'>
                                <button className='myPageCancleBtn' onClick={bookdeleteHandle}>예약 취소하기</button>
                            </div>
                        </div>
                        <div className='mypageDetail2'>
                            <div className='myPageDetail12_1'>
                                <strong>{bookedThis.car.brand}</strong>
                                <p>{bookedThis.car.model}</p>
                            </div>
                            <div>
                                <img src={`/images/cars/${bookedThis.car?.car_img}`}/>
                            </div>
                        </div>
                    </div>
                    <div className='mypageDetail3'>
                            {/* <div> */}
                                <p className='mypageDetailP'>지역</p>
                                <h4>{bookedThis.car.location}점</h4>
                            {/* </div> */}
                            <hr/>
                        {/* <div> */}
                            {/* <div> */}
                                <p className='mypageDetailP'>일정</p>
                                <h4>{DeleteYear(bookedThis.startDate)} ({startdayText}) {timeAMPM(bookedThis.startTime)} ~ 
                                    {DeleteYear(bookedThis.endDate)} ({enddayText}) {timeAMPM(bookedThis.endTime)} 
                                </h4>
                                <span>이용 시간: {hours}시간{minutes ? ` ${minutes}분` : ""}</span>
                            {/* </div> */}
                            <hr/>
                        {/* </div> */}
                        {/* <div> */}
                            {/* <div> */}
                                <p className='mypageDetailP'>차량</p>
                                <h4>{bookedThis.car.model} - {bookedThis.car.plate_number} </h4>
                                <h4></h4>
                                <span>{bookedThis.car.model_year}년식 {bookedThis.car.fuel_type}</span>
                            {/* </div> */}
                            <hr/>
                        {/* </div> */}
                        {/* <div> */}
                                <p className='mypageDetailP'>결제</p>
                        <div style={{marginTop:'20px'}}>
                                <div className='mybookDetailPriceBox'>
                                    <span className='DetailSpans'>차량 금액</span>
                                    <h5 style={{color:'gray'}}>{Number(bookedThis?.carPrice ?? 0).toLocaleString()}원</h5>
                                </div>
                                <div className='mybookDetailPriceBox'>
                                    <span className='DetailSpans'>보험 금액</span>
                                    <h5 style={{color:'gray'}}>{Math.round(Number(bookedThis?.insurancePrice ?? 0)).toLocaleString()}원</h5>
                                </div>
                                <div className='mybookDetailPriceBox'>
                                    <span className='DetailSpans'>총 결제 금액</span>
                                    <h4 >{Number(bookedThis?.totalPrice ?? 0).toLocaleString()}원</h4>
                                </div>
                        </div>
                        {/* </div> */}
                    </div>
                    <div className='mypageDetailBackBox' >
                        <button className='mypageDetailBack' onClick={()=>{navigate(-1);window.scrollTo(0,0);}} >뒤로가기</button> 
                    </div>
                </div>
        </>
    )
}