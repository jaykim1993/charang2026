import { createContext, useContext, useState, useMemo } from "react";
import { DataContext } from "./Datacontext";
import { AuthContext } from "./Authcontext";
import { BookingContext } from "./Bookingcontext";

export const CalendarContext = createContext();

const toDateTime = (date, time) =>
  new Date(`${date}T${time}:00`);
export default function CalendarProvider({ children }) {
  const { userid } = useContext(AuthContext);
  const { cars } = useContext(DataContext);
  const { bookedlistAll } = useContext(BookingContext);

  //시작 달력 초기값 정하기 13시2분이면 13시30분부터 
  const canRentStart = new Date();

  //기본 현재 시간 구하기 ex) 13
  const tocanRentTime = canRentStart.getHours();
  //기본 현재 분 구하기 ex)12
  const tocanRentMin =canRentStart.getMinutes();

  

  //30분보다 적으면 시간 그대로
  //30분보다 크면 시간 +1
  const CanRentHour =()=>{
    if(tocanRentMin > 30){
      return tocanRentTime+1
    }else{
      return tocanRentTime
    } 
  } //CarRentHour() 가 현재 13시19분이면 기본값은 13 출력

  //기본 대여 분 30보다 크면
   const canRentMin = () => {
    return tocanRentMin > 30 ? '00' : '30';
    };
  
  const FinishRentHour=()=>{
    return CanRentHour()+1
  }
  


  /* ================= UI 상태 ================= */
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(`${CanRentHour()}:${canRentMin()}`);
  const [endTime, setEndTime] = useState(`${FinishRentHour()}:${canRentMin()}`);
  // 사용자 입력 차량 위치 정보, 홈에서 공유받아야 하며 지금은 임시
  const [location, setLocation] = useState("");
  const [apply, setApply] = useState(false);
  /* ================= 시간 필터 ================= */
  const blockedCarIds = useMemo(() => {
    if (!startDate || !endDate || !startTime || !endTime) return [];

    const filterStart = toDateTime(startDate, startTime);
    const filterEnd = toDateTime(endDate, endTime);

    return bookedlistAll
      .filter((book) => {
        const bookStart = toDateTime(
          book.startDate,
          book.startTime
        );
        const bookEnd = toDateTime(
          book.endDate,
          book.endTime
        );

        // 시간 겹침 판단
        return !(filterEnd <= bookStart || filterStart >= bookEnd);
      })
      .map((book) => book.carId);
  }, [bookedlistAll, startDate, endDate, startTime, endTime]);

  console.log("이용 불가능한 차량 리스트", blockedCarIds);




  /* ================= 예약 가능 차량 ================= */
  // 원본 cars 형식 그대로 필터 => 령경씨가 사용할 배열
  const availableCars = useMemo(() => {
    return cars.filter((car) => {
      if (blockedCarIds.includes(car.id)) return false;
      if (location && car.location !== location) return false;
      return true;
    });
  }, [cars, blockedCarIds, location]);
  console.log("시간 위치 필터 적용 원본 배열 availableCars: ", availableCars);

  /* ================= 검색 결과 가공 ================= */
  // 원본에서 필요 내용 + 사용자 필터 적용값 정리된 배열 
  const filteredInfoUser = useMemo(() => {
    if ( !userid) return [];

    return availableCars.map((car) => ({
        // userId: userid,
        carId: car.id,
        filterStartDate: startDate,
        filterEndDate: endDate,
        filterStartTime: startTime,
        filterEndTime: endTime,
        location: car.location,
        fuel_type: car.fuel_type,
    }));
    }, [
      availableCars,
      userid,
      startDate,
      endDate,
      startTime,
      endTime,
  ]);
  console.log("재가공된 filteredInfoUser: ", filteredInfoUser);

  /* ================= UI 트리거 ================= */
  // 날짜 선정 확인 함수
  const handleDateFilter = () => {
    if (!startDate || !endDate) {
      alert("대여 날짜를 선택해주세요.");
      return;
    }
    setApply(true);
  };
  // 예약 가능한 차량 검색 버튼
  const handleSearchBtn = (navigate) => {
  if (!availableCars.length) {
    alert("예약 가능한 차량이 없습니다.");
    return;
  }

  navigate("/searchcarlist");
};

// 지점 모달 toggle
  const [isLocation, setIsLocation] = useState(false);
  // 달력 모달 toggle
  const [isCalendar, setIsCalendar] = useState(false);

  //요일뽑기
  const startdateObj= new Date(startDate);
  const enddateObj= new Date(endDate);
  const startdayindex =startdateObj.getDay();
  const enddayindex =enddateObj.getDay();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const startdayText = days[startdayindex];
  const enddayText = days[enddayindex];

  const DeleteYear = (dateStr) => {
  const [, month, day] = dateStr.split("-");
  return `${month}.${day}`;
  };

  //다음예약가능 시간 30분으로 쪼개서 ex) 현재시간 오후 4시52분 => 4시30분 && 이전 블럭될수있게
// 현재 시각 기준 → 다음 예약 가능한 30분 단위 시간
const getNextAvailableTime = () => {
  const now = new Date();

  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 30) * 30;

  if (roundedMinutes === 60) {
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
  } else {
    now.setMinutes(roundedMinutes);
  }
  now.setSeconds(0);
  now.setMilliseconds(0);

  return now;
};
  //예약가능여부
const isDisabledStartTime = (date, time) => {
  if (!date || !time) return false;

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  if (date !== todayStr) return false;

  const selected = toDateTime(date, time);
  const limit = getNextAvailableTime();

  return selected < limit;
};

const isDisabledEndTime = (dateStr, startDateStr, startTime, endTime) => {
  if (!dateStr || !startDateStr || !endTime) return false;

  const selected = toDateTime(dateStr, endTime);
  const start = toDateTime(startDateStr, startTime);

  const selectedDate = new Date(dateStr);
  const startDate = new Date(startDateStr);

  // 시작일과 같은 날이면
  if (
    selectedDate.getFullYear() === startDate.getFullYear() &&
    selectedDate.getMonth() === startDate.getMonth() &&
    selectedDate.getDate() === startDate.getDate()
  ) {
    // 최소 30분 이후부터 선택 가능
    return selected < new Date(start.getTime() + 30 * 60 * 1000);
  }

  // 다른 날이면 제한 없음
  return false;
};
// 오전 오후
    const timeAMPM= (time)=>{
      const hours=Number(time.slice(0,2));
      const minutes=time.slice(3);
      const ampm= hours<12 ?'오전':'오후';
      return ` ${ampm} ${hours}:${minutes}`;
    }

  return (
    <CalendarContext.Provider
      value={{
        /* 날짜 / 시간 */
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        //요일
        startdayText,
        enddayText,
        DeleteYear,
        isDisabledStartTime,
        isDisabledEndTime,
        days,

        /* 위치 */
        location,
        setLocation,

        /* 상태 */
        apply,
        setApply,

        /* 데이터 */
        bookedlistAll,
        availableCars,
        filteredInfoUser,

        /* 함수 */
        handleDateFilter,
        handleSearchBtn,

        // 모달창 열림 닫힘
        setIsLocation,
        setIsCalendar,
        isLocation,
        isCalendar,

        // 오전 오후 구분
        timeAMPM
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}