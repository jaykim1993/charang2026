import { useContext, useRef, useMemo, useState } from "react";
import { CalendarContext } from "../contexts/Calendarcontext";
import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Calendar.css";

export default function RentalCalendar() {
  const {
    setIsCalendar,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    timeInfoArrHandler,
    apply,
    setApply,
    handleDateFilter,
    isDisabledEndTime,
    isDisabledStartTime
  } = useContext(CalendarContext);

  const calendarRef = useRef(null);

  const handlePrev = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    const current = api.getDate();
    const prevMonth = new Date(
      current.getFullYear(),
      current.getMonth() - 1,
      1
    );

    const today = new Date();
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    if (prevMonth < thisMonthStart) {
      alert("이전달은 조회할 수 없습니다.");
      return;
    }

    api.gotoDate(prevMonth);
  };

  const handleNext = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    const current = api.getDate();
    api.gotoDate(
      new Date(current.getFullYear(), current.getMonth() + 1, 1)
    );
  };

  const handleDateClick = ({ dateStr }) => {
    // 시작일이 없으면 시작
    if (!startDate) {
      setStartDate(dateStr);
      setEndDate(null);
      return;
    }

    // 종료일 설정
    if (!endDate) {
      if (dateStr < startDate) {
        setEndDate(startDate);
        setStartDate(dateStr);
      } else {
        setEndDate(dateStr);
      }
      return;
    }

    // 다시 선택 시 초기화
    setStartDate(dateStr);
    setEndDate(null);
  };

  const handleApply = () => {
    if (!startDate || !endDate) {
      alert("날짜를 선택해주세요.");
      return;
    }else{
      setApply(true);
      setIsCalendar(false);
    }

    handleDateFilter({
      startDate,
      endDate,
      startTime,
      endTime,
    });
  };

    // 초기화 버튼 핸들러
    const allCancleHandler=()=>{
      setStartDate(null);
      setEndDate(null);
      setApply(false);
    }

  const renderDay = (arg) =>
    arg.dayNumberText.replace("일", "");

  const timeOptions = useMemo(() => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      times.push(`${String(h).padStart(2, "0")}:00`);
      times.push(`${String(h).padStart(2, "0")}:30`);
    }
    return times;
  }, []);

  // const backgroundEvents = useMemo(() => {
  //   if (!startDate || !endDate) return [];

  //   const events = [];
  //   let current = new Date(startDate);
  //   const end = new Date(endDate);

  //   while (current <= end) {
  //     events.push({
  //       start: current.toISOString().split("T")[0],
  //       display: "background",
  //       className: "selected-range-bg",
  //     });
  //     current.setDate(current.getDate() + 1);
  //   }

  //   return events;
  // }, [startDate, endDate]);

  // 시작인, 종료일 class
  const backgroundEvents = useMemo(() => {
  if (!startDate) return [];

  const events = [];
  
  // 1. 시작일 표시
  events.push({
    start: startDate,
    display: "background",
    className: "range-start-node", // 시작일 전용 클래스
  });

  if (!endDate) return events;

  // 2. 중간 날짜들 표시 (시작일 다음날부터 종료일 전날까지)
  let current = new Date(startDate);
  current.setDate(current.getDate() + 1);
  const end = new Date(endDate);

  while (current < end) {
    events.push({
      start: current.toISOString().split("T")[0],
      display: "background",
      className: "selected-range-bg", // 중간 범위 클래스
    });
    current.setDate(current.getDate() + 1);
  }

  // 3. 종료일 표시
  events.push({
    start: endDate,
    display: "background",
    className: "range-end-node", // 종료일 전용 클래스
  });

  return events;
}, [startDate, endDate]);

  const todayStr = new Date().toISOString().split("T")[0];

// 날짜 비활성화돼서 없어진거 css주기위함
const dayCellClassNames = (arg) => {
  const today = new Date();
  const date = new Date(arg.date);

  // 오늘 이전 날짜면 disabled-day 클래스 추가
  if (date < today.setHours(0, 0, 0, 0)) {
    return ["disabled-day"];
  }
  return [];
};


  return (
    <>
      <div className="calendarWrap">
      <FullCalendar
        ref={calendarRef}
        plugins={[multiMonthPlugin, interactionPlugin]}
        initialView="twoMonth"
        locale={koLocale}
        showNonCurrentDates={false}
        dayCellClassNames={dayCellClassNames}
        dateClick={(info) => {
          const todayStr = new Date().toISOString().split("T")[0];
          if (info.dateStr < todayStr) return; // 클릭 막기
          handleDateClick(info);
        }}

        dayCellContent={renderDay}
        events={backgroundEvents}
        headerToolbar={{
          left: "myPrev",
          center: "title",
          right: "myNext",
        }}
        customButtons={{
          myPrev: {
            click: handlePrev,
            buttonContent: () => (
              <i className="bi bi-arrow-left-short"></i>
            ),
          },
          myNext: {
            click: handleNext,
            buttonContent: () => (
              <i className="bi bi-arrow-right-short"></i>
            ),
          },
        }}
        views={{
          twoMonth: {
            type: "multiMonth",
            duration: { months: 2 },
          },
        }}
        height="auto"
        expandRows={false}
        contentHeight="auto"
        fixedWeekCount={false}
      />
      {/* 12-23 령경 수정 시작 */}
      <div className="C_select">
            <>
            <hr className="C_select_hr" />
              <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between'}} className="C_time">
                <div className="C_startTime">
                  <span className="C_dateTitle">대여시간</span>
                  <select
                    className="C_selectTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}>
                    {timeOptions.map((time) => (
                      <option 
                        key={time} 
                        value={time}
                        disabled={isDisabledStartTime(startDate, time)}>
                          {time}
                      </option>
                    ))}
                  </select>
                </div>
                <p style={{fontSize: '25px'}}>~</p>
                <div className="C_endTime">
                  <span className="C_dateTitle">반납시간</span>
                  <select
                    className="C_selectTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}>
                    {timeOptions.map((time) => (
                      <option
                        key={time}
                        value={time}
                        disabled={isDisabledEndTime(endDate, startDate, startTime, time)}>
                        {time}
                    </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* 령경 수정 끝 */}

              <button className="C_X_btn" style={{ marginTop: "20px" }} onClick={allCancleHandler}>
                초기화
              </button>
              <button className="C_apply_btn" style={{ marginTop: "20px" }} onClick={handleApply}>
                적용하기
              </button>
            </>
        </div>
      </div>
    </>
    
  );
}
