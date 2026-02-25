import './ReservationDetailPage.css'
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../contexts/Datacontext";
import { CalendarContext } from "../../contexts/Calendarcontext";

import axios from "axios";

export default function ReservationDetailPage(){

    const { branch } = useContext(DataContext); // 지점 정보 호출
    const { startdayText, enddayText } = useContext(CalendarContext);
    const navigate = useNavigate();
    
    // useParams 예약번호 받기
    const selectedBookingId = useParams().bookingId;
    console.log("현재 useParams로 가져온 bookingId: ", selectedBookingId);

    const [ selectedBooking, setSelectedBooking ] = useState({});
    // 해당 예약 정보 불러오기
    useEffect(()=>{
        axios.get("/api/onebookcar/"+selectedBookingId)
        .then((res)=>{
            console.log("해당 id 데이터: ",res.data);
            setSelectedBooking(res.data);
        })
        .catch((error)=>{
            console.log("해당 id 데이터 오류: ", error);
        })
    },[selectedBookingId]);
    console.log("가져온 예약 정보", selectedBooking);
    if (!selectedBooking.startDate) {
    return <div>예약 정보 불러오는 중...</div>;
    }
    // 지점명 따기
            const branchName =
              branch.find(
                b => b.branchId === selectedBooking.branchId
            )?.location || '';
            console.log("지점명", branchName);

    //며칠 남앗는지
        const today = new Date();
            today.setHours(0, 0, 0, 0);
            const [sy, sm, sd] = selectedBooking.startDate.split('-');
            const [ey, em, ed] = selectedBooking.endDate.split('-');
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
        let date = (new Date(`${selectedBooking.endDate}T${selectedBooking.endTime}`)-new Date(`${selectedBooking.startDate}T${selectedBooking.startTime}`))/ (1000 * 60 * 30);
        const hours = Math.floor(date / 2);
        const minutes = (date % 2) * 30;



    if (!selectedBooking) {
    return <div>예약 정보 불러오는 중...</div>;
    }
    return(
        <div className="reservationDetailPage">
            <div className="reservationDetail_container">
                <div className="reservationDetail_header">
                    <h2 className="reservationDetail_title">예약 상세 정보</h2>
                    <div className="reservationDetail_btnBox">
                        <button type="button" className="reservationDetail_listBtn" onClick={() => navigate(-1)}>전체목록</button>
                    </div>
                </div>


                <table className="reservationDetail_table">
                    <tbody className="reservationDetail_table_body">
                        <tr className="reservationDetail_tr">
                            <td className="reservationDetail_td">예약아이디</td>
                            <th className="reservationDetail_data">{selectedBooking.bookingId}</th>
                        </tr>
                        <tr className="reservationDetail_tr">
                            <td className="reservationDetail_td">예약자</td>
                            <th className="reservationDetail_data">{selectedBooking.userId}</th>
                        </tr>
                        <tr className="reservationDetail_tr">
                            <td className="reservationDetail_td">차량아이디</td>
                            <th className="reservationDetail_data">{selectedBooking.carId}</th>
                        </tr>
                        <tr className="reservationDetail_tr">
                            <td className="reservationDetail_td">차량번호</td>
                            <th className="reservationDetail_data">{selectedBooking.plateNumber}</th>
                        </tr>
                        <tr className="reservationDetail_tr">
                            <td className="reservationDetail_td">차량 모델명</td>
                            <th className="reservationDetail_data">{selectedBooking.brand}- {selectedBooking.model}</th>
                        </tr>
                        <tr className="reservationDetail_tr">
                            <td className="reservationDetail_td">지점</td>
                            <th className="reservationDetail_data">{branchName}점</th>
                        </tr>
                        <tr className="reservationDetail_tr">
                            <td className="reservationDetail_td">예약 일자</td>
                            <th className="reservationDetail_data">{selectedBooking.bookedDate}</th>
                        </tr>
                        <tr className="reservationDetail_tr">
                            <td className="reservationDetail_td">대여 일자</td>
                            <th className="reservationDetail_data">{selectedBooking.startDate} ({startdayText}) {selectedBooking.startTime.slice(0,8)}</th>
                        </tr>
                        <tr className="reservationDetail_tr">
                            <td className="reservationDetail_td">반납 일자</td>
                            <th className="reservationDetail_data">{selectedBooking.endDate} ({enddayText}) {selectedBooking.endTime.slice(0,8)}</th>
                        </tr>
                        <tr className="reservationDetail_tr">
                            <td className="reservationDetail_td">결제수단</td>
                            <th className="reservationDetail_data">{selectedBooking.paymentMethod}</th>
                        </tr>
                        <tr className="reservationDetail_tr">
                            <td className="reservationDetail_td">차량대여금액</td>
                            <th className="reservationDetail_data">{selectedBooking.carPrice.toLocaleString()}원</th>
                        </tr>
                        <tr className="reservationDetail_tr">
                            <td className="reservationDetail_td">보험금액</td>
                            <th className="reservationDetail_data">{selectedBooking.insurancePrice.toLocaleString()}원</th>
                        </tr>
                        <tr className="reservationDetail_tr">
                            <td className="reservationDetail_td">결제금액</td>
                            <th className="reservationDetail_data">{selectedBooking.totalPrice.toLocaleString()}원</th>
                        </tr>
                        <tr className="reservationDetail_tr">
                            <td className="reservationDetail_td">진행상황</td>
                            <th className="reservationDetail_data">{dText}</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    )
}