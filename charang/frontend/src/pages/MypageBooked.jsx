import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { CalendarContext } from "../contexts/Calendarcontext";
import { BookingContext } from "../contexts/Bookingcontext";
import { AuthContext } from "../contexts/Authcontext";
import { DataContext } from "../contexts/Datacontext";

import "./MypageBooked.css";

export default function MypageBooked() {
  const { DeleteYear, timeAMPM, startdayText, enddayText, days } = useContext(CalendarContext);  // 연도 삭제
  const { myBookings, bookedlistAll } = useContext(BookingContext); // 예약내역 보기 함수 호출
  const { branch } = useContext(DataContext); // 유저 정보 호출

  // console.log(myBookings)
  // console.log(bookedlistAll)

  // 예약날짜 가까운 순서대로 정렬
  const sortedByLatest = [...myBookings].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const sortedByLatestCopy = [...sortedByLatest];
  sortedByLatestCopy.push(() => {
    startdayText,
    enddayText
  })
  useEffect(() => {
  window.scrollTo(0, 0);
  }, []);

  return (
    <div className="MypageBooked">
      <h2 className="guideMainText">예약내역</h2>
      <div className="myPageBookWarp">
        {myBookings.length === 0?
        <div>
          <div className="mypageBookCard">
            <i className="bi bi-exclamation-lg warningIcon"></i>
            <p className="noBookedP">아직 예약 내역이 없습니다.</p>
          </div>
          <Link to={'/searchcarlist'} className="noBookedGoToBook">예약하러가기</Link>
        </div>
        :
        <div>
          <table className="mypageBookTable">
            <thead className="mypageBookThead">
              <tr>
                <th>차량 이미지</th>
                <th>차량 정보</th>
                <th>예약 정보</th>
                <th></th>
              </tr>
            </thead>

          {sortedByLatest.map(book => {
            // 지점명 따기
            const branchName =
              branch.find(
                b => b.branchId === book.matchedCar?.branchId
            )?.name || '';
            // 요일
            const sDate = new Date(book.startDate);
            const eDate = new Date(book.endDate);
            const sDay = days[sDate.getDay()]; // 시작일 요일
            const eDay = days[eDate.getDay()]; // 종료일 요일

            // 오늘 (날짜 기준)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const [y, m, d] = book.startDate.split('-');
            const startDate = new Date(y, m - 1, d);
            const diffDays = Math.ceil(
              (startDate - today) / (1000 * 60 * 60 * 24)
            );
            let dText;
            if (diffDays > 0) dText = `D-${diffDays}`;
            else if (diffDays === 0) dText = 'D-Day';
            else dText = `D+${Math.abs(diffDays)}`;

            return(
                <tbody className="mypage_tbody"  key={book.bookingId}>
                  <tr>
                    <td>
                      <img src={`/images/cars/${book.matchedCar?.carImg}`} alt={book.matchedCar?.model}/>
                    </td>
                    <td>
                      <h3 className="mapCarname">{book.matchedCar?.brand} {book.matchedCar?.model}</h3>
                      <p className="mapCarBooknum" >{branchName}</p>
                    </td>
                    <td>
                      <h3 className="mapCarDays">{dText}</h3>
                      <p className="mapCarDate">
                        {DeleteYear(book.startDate)} ({sDay}) {timeAMPM(book.startTime)}
                        {" ~ "}
                        {DeleteYear(book.endDate)} ({eDay}) {timeAMPM(book.endTime)}
                      </p>
                    </td>
                    <td >
                      <div className="GoToDetailBoxmap">
                        <Link to={`/mypage/detail/${book.id}`} className="mapGoToDetail" onClick={() => window.scrollTo(0,0)}>예약 상세보기</Link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              
            );
          })}
          </table>
        </div>   
        }
      </div>
    </div>
  );
}