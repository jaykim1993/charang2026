import './MypageDetail.css'
import { useContext, useState, useEffect } from "react";
import { BookingContext } from "../contexts/Bookingcontext";
import { AuthContext } from "../contexts/Authcontext";
import { CalendarContext } from '../contexts/Calendarcontext';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { DataContext } from "../contexts/Datacontext";

export default function MypageDetail(){
    const { bookingId } = useParams(); // 예약번호
    const { myBooking, fetchOneBookCar, deleteBooking } = useContext(BookingContext); // 예약내역 보기 함수 호출
    const { username } = useContext(AuthContext); // 유저 정보 호출
    const { DeleteYear, timeAMPM, startdayText, enddayText } = useContext(CalendarContext);
    const { branch } = useContext(DataContext); // 지점 정보 호출
    const [showMap,setShowMap]=useState(false);
    const navigate = useNavigate();

    // 개인 예약 내역(+ 차량 정보 조인) 최신값 받기
    useEffect(() => {
        fetchOneBookCar();
    }, []);

    // useParams 예약번호 받기
    const selectedCarId = bookingId;

    // 값 문자열로 비교하기
    const bookedThis = myBooking.find(
    book => String(book.bookingId) === selectedCarId
    );

    if (!bookedThis) {
    return <div>예약 정보 불러오는 중...</div>;
    }
    // console.log(bookingId);
    //리스트삭제핸들러  ->   DB에서 직접 삭제하는 쪽으로 대체해야함
    const handleDeleteBooking = () => {
    deleteBooking(bookingId, navigate);
    };

    // 지점명 따기
            const branchName =
              branch.find(
                b => b.branchId === bookedThis.branchId
            )?.location || '';

    //며칠 남앗는지
    // 3단계로 나눠서 계산 26.02.23 성중
        const today = new Date();
            today.setHours(0, 0, 0, 0);
            const [sy, sm, sd] = bookedThis.startDate.split('-');
            const [ey, em, ed] = bookedThis.endDate.split('-');
            const startDate = new Date(sy, sm - 1, sd);
            const endDate = new Date(ey, em - 1, ed);
            const diffDays = Math.ceil(
            (startDate - today) / (1000 * 60 * 60 * 24)
        );
            const diffDayse = Math.ceil(
            (endDate - today) / (1000 * 60 * 60 * 24)
        );
        console.log(diffDays);
        console.log(diffDayse);
        let dText;
            if (diffDays > 0) dText = `D-${diffDays}`;
            else if (diffDays <= 0 && diffDayse > 0) dText = '진행중';
            else if (diffDayse < 0 ) dText = `완료된 예약`;
  
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
                                    <span className='myPageDetailspan1'>{bookedThis.bookingId}</span>
                                    <i onClick={() => copyText(bookedThis.bookingId)} className="bi bi-copy"></i>
                                </div>
                                <div className='myPageDetailTopflex'>
                                    <span className='myPageDetailwhengo'>출발일시</span>
                                    <span className='myPageDetailspan'>{DeleteYear(bookedThis.startDate)} ({startdayText}) {timeAMPM(bookedThis.startTime)}</span>
                                </div>
                            </div>
                            <div className='myPageCancleBtnBox'>
                                <button 
                                className='myPageCancleBtn' 
                                onClick={handleDeleteBooking}
                                >예약 취소하기</button>
                            </div>
                        </div>
                        <div className='mypageDetail2'>
                            <div className='myPageDetail12_1'>
                                <strong>{bookedThis.brand}</strong>
                                <p>{bookedThis.model}</p>
                            </div>
                            <div>
                                <img src={`/images/cars/${bookedThis.carImg}`}/>
                            </div>
                        </div>
                    </div>
                    <div className='mypageDetail3'>
                            {/* <div> */}
                                <p className='mypageDetailP'>지역</p>
                                <h4>{branchName}점</h4>
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
                                <h4>{bookedThis.model} - {bookedThis.plateNumber} </h4>
                                <h4></h4>
                                <span>{bookedThis.modelYear}년식 {bookedThis.fuelType}</span>
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