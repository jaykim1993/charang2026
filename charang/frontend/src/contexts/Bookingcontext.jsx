import { createContext, useContext, useState } from "react";
import { AuthContext } from "./Authcontext";
import { DataContext } from "./Datacontext";
import { useMemo, useEffect } from "react";
import axios from "axios";

export const BookingContext = createContext();

export default function BookingProvider({ children }) {
  const { userid } = useContext(AuthContext);
  const { car } = useContext(DataContext);


    // ======================
    // 예약 목록 전체 불러오기 (Home.jsx, AllReservationPage.jsx 용)
    // ======================
    const [bookedlistAll, setBookedlistAll] = useState([]);
    const fetchBookedList = async () => {
      try {
        const res = await axios.get("/api/booklist");
        if (Array.isArray(res.data)) {
          setBookedlistAll(res.data);
        }
      } catch (err) {
        console.log("예약 목록 로딩 실패", err);
      }
    };

    // ======================
    // 개인 예약 목록 (MypageBooked.jsx)
    // ======================
      const [myBooking, setMyBooking] = useState([]);
      const userId = userid;
      useEffect(() => {
        fetchOneBookCar();
      }, []);
      const fetchOneBookCar = async () => {
        const res = await axios.get("/api/onebookcar", {
          withCredentials: true 
        });
        // console.log("개인 예약 (+카 정보 조인)", res.data);
        setMyBooking(res.data);
      };
    

    // ======================
    // 예약 취소 (MypageBooked.jsx, AllReservationPage.jsx)
    // ======================
      // 해당 예약의 bookingId로 접근해서 삭제한다.
      // 두 페이지에 필요하므로 함수화해서 페이지마다 import
      const deleteBooking = async (bookingId, navigate) => {
        const confirmCancel = window.confirm('예약을 취소하시겠습니까?');
        if (!confirmCancel) return;

        try {
          const res = await axios.delete('/api/deleteBook', {
            params: { bookingId }
          });

          console.log(res.data);

          if (res.data) {
            alert('예약이 취소되었습니다.');
            navigate('/mypage/booked');
          } else {
            alert('예약 취소에 실패했습니다.');
          }
        } catch (error) {
          console.error(error);
          alert('서버 오류로 예약 취소에 실패했습니다.');
        }
      };

    // ======================
    // 최근 본 차량 목록 (Home.jsx, Recentcarlist.jsx)
    // ======================
      // 목록은 DB나 배열로 실존하지 않으며 local storage에만 존재한다.
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
      myBooking,
      myRecentlist,
      fetchBookedList,
      fetchOneBookCar,
      deleteBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
}

