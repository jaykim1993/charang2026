import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarContext } from "../contexts/Calendarcontext";
import { BookingContext } from "../contexts/Bookingcontext";
import { DataContext } from "../contexts/Datacontext";

import "./MypageBooked.css";

export default function MypageBooked() {
  const { DeleteYear, timeAMPM, days } = useContext(CalendarContext);
  const { myBooking, fetchBookedList, fetchOneBookCar } = useContext(BookingContext);
  const { branch } = useContext(DataContext);

  // 드랍다운 버튼 만들기 26.02.23 성중
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    fetchBookedList();
    fetchOneBookCar();
  }, []);

  // 상태별 배열
  const bookingsByStatus = {
    UPCOMING: myBooking.filter(b => b.bookingStatus === "UPCOMING"),
    ONGOING: myBooking.filter(b => b.bookingStatus === "ONGOING"),
    PAST: myBooking.filter(b => b.bookingStatus === "PAST"),
  };
  const [selectedStatus, setSelectedStatus] = useState(
    bookingsByStatus["ONGOING"]?.length !== 0 ? "ONGOING" : "UPCOMING"
  );
  // 상태별 정렬 (시작일 기준)
  Object.keys(bookingsByStatus).forEach(status => {
    bookingsByStatus[status].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="MypageBooked">
      <h4>예약내역</h4>
      {myBooking.length === 0 ? (
        <div className='mypage_none'>
          <i className="bi bi-chat-square-dots"></i>
          <p>예약내역이 없습니다.</p>
          <Link to={'/searchcarlist'} className='mypage_btn'>
            예약하기
          </Link>
        </div>
      ) : (
        <div>
          {/* 예약 상태 드롭다운 */}
          <div className="bookingStatusDropdown">
            <button
              className="dropdownToggle"
              onClick={() => setIsOpen(prev => !prev)}>
              {selectedStatus === "ONGOING"
                ? "진행중인 예약"
                : selectedStatus === "UPCOMING"
                  ? "다가오는 예약"
                  : "지난 예약"}
              <i className="bi bi-caret-down-fill"></i>
            </button>

            {isOpen && (
              <ul className="dropdownMenu">
                {["ONGOING", "UPCOMING", "PAST"].map(status => (
                  <li
                    key={status}
                    className={selectedStatus === status ? "active" : ""}
                    onClick={() => {
                      setSelectedStatus(status);
                      setIsOpen(false);
                    }}
                  >
                    {status === "ONGOING"
                      ? "진행중인 예약"
                      : status === "UPCOMING"
                        ? "다가오는 예약"
                        : "지난 예약"}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <table className="mypageBookTable">
            <thead className="mypageBookThead">
              <tr>
                <th style={{ width: '240px' }}>차량 이미지</th>
                <th style={{ width: '200px' }}>차량 정보</th>
                <th colSpan={2}>예약 정보</th>
              </tr>
            </thead>
            {/* select 별 예약 유무 */}
            {bookingsByStatus[selectedStatus].length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={4} className="mypageBook_non">해당 예약 내역이 없습니다.</td>
                </tr>
              </tbody>
            ) :(
              bookingsByStatus[selectedStatus].map(book => {
                const branchName = branch.find(b => b.branchId === book.branchId)?.name || "";
                const sDate = new Date(book.startDate);
                const eDate = new Date(book.endDate);
                const sDay = days[sDate.getDay()];
                const eDay = days[eDate.getDay()];
  
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const [y, m, d] = book.startDate.split("-");
                const startDate = new Date(y, m - 1, d);
                const diffDays = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
                let dText;
                if (diffDays > 0) dText = `D-${diffDays}`;
                else if (diffDays === 0) dText = "D-Day";
                else dText = `D+${Math.abs(diffDays)}`;
  
                return (
                  <tbody
                    className={selectedStatus === "PAST" ? "mypage_tbodypast" : "mypage_tbody"}
                    key={book.bookingId}>
                    <tr>
                      <td>
                        <img src={`/images/cars/${book.carImg}`} alt={book.model} />
                      </td>
                      <td>
                        <h3 className="mapCarname">
                          {book.brand} {book.model}
                        </h3>
                        <p className="mapCarBooknum">{branchName}</p>
                      </td>
                      <td>
                        {selectedStatus === "ONGOING" && <p className="mapCarDaysOnGoing">진행중</p>}
                        {selectedStatus === "UPCOMING" && <p className="mapCarDays">{dText}</p>}
                        {selectedStatus === "PAST" && <p className="mapCarDays">완료</p>}
  
                        <p className="mapCarDate">
                          {DeleteYear(book.startDate)} ({sDay}) {timeAMPM(book.startTime)} ~{" "}
                          {DeleteYear(book.endDate)} ({eDay}) {timeAMPM(book.endTime)}
                        </p>
                      </td>
                      <td>
                        <div className="GoToDetailBoxmap">
                          <Link
                            to={`/mypage/detail/${book.bookingId}`}
                            className="mapGoToDetail"
                            onClick={() => window.scrollTo(0, 0)}>
                            예약 상세보기
                          </Link>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                );
              })
            )}
          </table>
        </div>
      )}
    </div>
  );
}