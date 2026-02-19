import { createContext, useContext, useState } from "react";
import { AuthContext } from "./Authcontext";
import { DataContext } from "./Datacontext";
import { useEffect, useMemo } from "react";
import axios from "axios";

export const BookingContext = createContext();

export default function BookingProvider({ children }) {
  const { userid } = useContext(AuthContext);
  const { car } = useContext(DataContext);

    // bookedlistAll (기존 예약 배열)
    // 40개의 초기값, 실제 예약 데이터화(12.26)
    // local storage에 저장되어있음
  //   const INITIAL_BOOKED_LIST = [
  //   // user01 (4)
  //   { bookingId:'1766041500000_user01', bookedDate:'2025-12-15', userId:'user01', carId:12,  startDate:'2026-03-03', endDate:'2026-03-05', startTime:'09:00', endTime:'15:00', carPrice:72000 ,insurancePrice:12000, totalPrice:84000 },
  //   { bookingId:'1766041500001_user01', bookedDate:'2025-12-16', userId:'user01', carId:45,  startDate:'2026-03-18', endDate:'2026-03-20', startTime:'10:30', endTime:'18:00', carPrice:98000 ,insurancePrice:12000, totalPrice:110000},
  //   { bookingId:'1766041500002_user01', bookedDate:'2025-12-20', userId:'user01', carId:88,  startDate:'2026-03-03', endDate:'2026-03-04', startTime:'08:00', endTime:'12:00', carPrice:56000 ,insurancePrice:12000, totalPrice:68000},
  //   { bookingId:'1766041500003_user01', bookedDate:'2025-12-22', userId:'user01', carId:130, startDate:'2026-02-20', endDate:'2026-02-22', startTime:'14:00', endTime:'20:00', carPrice:112000 ,insurancePrice:12000, totalPrice:124000}
  // ];
    // 예약 목록 
    const [bookedlistAll, setBookedlistAll] = useState(() => {
      const saved = localStorage.getItem("bookedlistAll");
      return saved ? JSON.parse(saved) : [];
    });

    // 서버에서 예약 데이터 가져오기
    useEffect(() => {
      axios.get("/api/booklist")
        .then((res) => {
          console.log("받아온 예약 데이터", res.data);
          if (Array.isArray(res.data)) {
            setBookedlistAll(res.data);
            localStorage.setItem(
              "bookedlistAll",
              JSON.stringify(res.data)
            );
          }
        })
        .catch((error) => {
          console.log("예약 목록 로딩 실패", error);
        });
    }, []);

    // ======================
    // Mypage.jsx 용 예약 목록
    // ======================
    const myBookings = useMemo(() => {
      if (!bookedlistAll.length || !userid || !car?.length) return [];

      return bookedlistAll
        .filter(book => String(book.userId) === String(userid))
        .map(book => {
          const matchedCar = car.find(c => c.carId === book.carId) || null;
          return { ...book, matchedCar };
        })
        .sort(
          (a, b) => new Date(b.bookedDate) - new Date(a.bookedDate)
        );
      }, [bookedlistAll, userid, car]);
      console.log("개인예약내역, ", myBookings);
    


      
      // Recentcarlist.jsx 용
      // 최근 본 차량 목록 보이기
      // 목록은 배열로 실존하지 않으며 local storage에만 존재한다
      // localStorage 내에서 해당 userid에 부합하는 내용만 찾기
        const myRecentlist = (userid) => {
          if (!userid) return [];
          const data = JSON.parse(localStorage.getItem("recentView")) || [];
          return data
            .filter(item => item.userid === userid)
            .sort((a, b) => b.viewed_at - a.viewed_at)
        };




  // ================= 금액 =================
  const calculatePrice = (car) => {
    const basePrice = 700;  // 기본요금
    let totalPrice = basePrice;  // 값이 담길 변수

    // 연식
    const baseModelYear = car.modelYear;

    if(baseModelYear === 2022){
        totalPrice -= 100;
    }else if(baseModelYear === 2023){
        totalPrice -= 50;
    }else if(baseModelYear === 2025){
        totalPrice += 100;
    }else{
        totalPrice += 0;
    }

    // 크기
    const baseVehicleSize = car.carSize;

    if(baseVehicleSize === '중형'){
        totalPrice += 50;
    }else if(baseVehicleSize === '대형'){
        totalPrice += 100;
    }else{
        totalPrice += 0;
    }

    // 연료
    const baseFuelType = car.fuelType;

    if(baseFuelType === '휘발유'){
        totalPrice += 50;
    }else if(baseFuelType === '하이브리드'){
        totalPrice += 100;
    }else{
        totalPrice += 0;
    }

    // 옵션
    if(car.heatedSeat){ totalPrice += 50; }
    if(car.heatedHandle){ totalPrice += 50; }
    if(car.sunRoof){ totalPrice += 100; }
    else{ null }

    // 브랜드별 값
    const priceValue = car.priceValue;

    // 최종 산출금액
    const finalPrice = Math.round(totalPrice * priceValue);

    return finalPrice;
  }





  return (
    <BookingContext.Provider value={{
      calculatePrice,
      bookedlistAll, 
      setBookedlistAll,
      myBookings,
      myRecentlist,

      // removeBookInfo
    }}>
      {children}
    </BookingContext.Provider>
  );
}

