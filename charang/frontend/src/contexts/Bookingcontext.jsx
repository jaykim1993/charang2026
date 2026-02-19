import { createContext, useContext, useState } from "react";
import { AuthContext } from "./Authcontext";
import { DataContext } from "./Datacontext";
import { useEffect, useMemo } from "react";


export const BookingContext = createContext();

export default function BookingProvider({ children }) {
  const { userid } = useContext(AuthContext);
  const { cars } = useContext(DataContext);

    // bookedlistAll (기존 예약 배열)
    // 40개의 초기값, 실제 예약 데이터화(12.26)
    // local storage에 저장되어있음
    const INITIAL_BOOKED_LIST = [
    // user01 (4)
    { id:'1766041500000_user01', bookedDate:'2025-12-15', userId:'user01', carId:12,  startDate:'2026-01-03', endDate:'2026-01-05', startTime:'09:00', endTime:'15:00', carPrice:72000 ,insurancePrice:12000, totalPrice:84000 },
    { id:'1766041500001_user01', bookedDate:'2025-12-16', userId:'user01', carId:45,  startDate:'2026-01-18', endDate:'2026-01-20', startTime:'10:30', endTime:'18:00', carPrice:98000 ,insurancePrice:12000, totalPrice:110000},
    { id:'1766041500002_user01', bookedDate:'2025-12-20', userId:'user01', carId:88,  startDate:'2026-02-03', endDate:'2026-02-04', startTime:'08:00', endTime:'12:00', carPrice:56000 ,insurancePrice:12000, totalPrice:68000},
    { id:'1766041500003_user01', bookedDate:'2025-12-22', userId:'user01', carId:130, startDate:'2026-02-20', endDate:'2026-02-22', startTime:'14:00', endTime:'20:00', carPrice:112000 ,insurancePrice:12000, totalPrice:124000},

    // user02 (4)
    { id:'1766041500004_user02', bookedDate:'2025-12-15', userId:'user02', carId:22,  startDate:'2026-01-05', endDate:'2026-01-07', startTime:'07:30', endTime:'13:30', carPrice:60000,insurancePrice:12000, totalPrice:72000 },
    { id:'1766041500005_user02', bookedDate:'2025-12-18', userId:'user02', carId:64,  startDate:'2026-02-01', endDate:'2026-02-02', startTime:'16:00', endTime:'22:00', carPrice:84000,insurancePrice:12000, totalPrice:96000 },
    { id:'1766041500006_user02', bookedDate:'2025-12-21', userId:'user02', carId:170, startDate:'2026-02-25', endDate:'2026-02-27', startTime:'09:00', endTime:'18:00', carPrice:135000,insurancePrice:12000, totalPrice:147000 },
    { id:'1766041500007_user02', bookedDate:'2025-12-23', userId:'user02', carId:33,  startDate:'2026-01-25', endDate:'2026-01-26', startTime:'12:00', endTime:'18:00', carPrice:76000 ,insurancePrice:12000, totalPrice:88000},

    // user03 (4)
    { id:'1766041500008_user03', bookedDate:'2025-12-14', userId:'user03', carId:31,  startDate:'2026-01-02', endDate:'2026-01-03', startTime:'10:00', endTime:'14:00', carPrice:52000,insurancePrice:12000, totalPrice:64000 },
    { id:'1766041500009_user03', bookedDate:'2025-12-19', userId:'user03', carId:75,  startDate:'2026-01-22', endDate:'2026-01-24', startTime:'11:00', endTime:'20:00', carPrice:128000,insurancePrice:12000, totalPrice:140000 },
    { id:'1766041500010_user03', bookedDate:'2025-12-23', userId:'user03', carId:140, startDate:'2026-02-06', endDate:'2026-02-07', startTime:'07:00', endTime:'12:30', carPrice:64000,insurancePrice:12000, totalPrice:76000 },
    { id:'1766041500011_user03', bookedDate:'2025-12-25', userId:'user03', carId:98,  startDate:'2026-02-26', endDate:'2026-02-28', startTime:'15:00', endTime:'22:00', carPrice:119000,insurancePrice:12000, totalPrice:131000 },

    // user04 (4)
    { id:'1766041500012_user04', bookedDate:'2025-12-16', userId:'user04', carId:41,  startDate:'2026-01-10', endDate:'2026-01-11', startTime:'08:00', endTime:'16:00', carPrice:88000,insurancePrice:12000, totalPrice:90000 },
    { id:'1766041500013_user04', bookedDate:'2025-12-20', userId:'user04', carId:120, startDate:'2026-02-08', endDate:'2026-02-10', startTime:'09:30', endTime:'19:00', carPrice:142000,insurancePrice:12000, totalPrice:154000 },
    { id:'1766041500014_user04', bookedDate:'2025-12-24', userId:'user04', carId:185, startDate:'2026-02-18', endDate:'2026-02-19', startTime:'13:00', endTime:'18:00', carPrice:69000,insurancePrice:12000, totalPrice:81000 },
    { id:'1766041500015_user04', bookedDate:'2025-12-26', userId:'user04', carId:60,  startDate:'2026-01-27', endDate:'2026-01-28', startTime:'10:00', endTime:'15:00', carPrice:73000,insurancePrice:12000, totalPrice:85000 },

    // user05 (4)
    { id:'1766041500016_user05', bookedDate:'2025-12-17', userId:'user05', carId:90,  startDate:'2026-01-06', endDate:'2026-01-08', startTime:'17:00', endTime:'23:00', carPrice:110000,insurancePrice:12000, totalPrice:122000 },
    { id:'1766041500017_user05', bookedDate:'2025-12-21', userId:'user05', carId:110, startDate:'2026-01-30', endDate:'2026-02-01', startTime:'07:00', endTime:'16:30', carPrice:125000 ,insurancePrice:12000, totalPrice:137000},
    { id:'1766041500018_user05', bookedDate:'2025-12-24', userId:'user05', carId:52,  startDate:'2026-02-10', endDate:'2026-02-11', startTime:'12:00', endTime:'18:00', carPrice:68000,insurancePrice:12000, totalPrice:80000 },
    { id:'1766041500019_user05', bookedDate:'2025-12-27', userId:'user05', carId:99,  startDate:'2026-02-24', endDate:'2026-02-25', startTime:'09:00', endTime:'17:00', carPrice:94000 ,insurancePrice:12000, totalPrice:106000},

    // user06 (4)
    { id:'1766041500020_user06', bookedDate:'2025-12-18', userId:'user06', carId:116, startDate:'2026-01-12', endDate:'2026-01-14', startTime:'10:00', endTime:'22:30', carPrice:160000,insurancePrice:12000, totalPrice:172000 },
    { id:'1766041500021_user06', bookedDate:'2025-12-22', userId:'user06', carId:80,  startDate:'2026-01-26', endDate:'2026-01-27', startTime:'16:00', endTime:'22:00', carPrice:76000,insurancePrice:12000, totalPrice:88000 },
    { id:'1766041500022_user06', bookedDate:'2025-12-26', userId:'user06', carId:144, startDate:'2026-02-05', endDate:'2026-02-07', startTime:'08:00', endTime:'18:00', carPrice:150000,insurancePrice:12000, totalPrice:162000 },
    { id:'1766041500023_user06', bookedDate:'2025-12-28', userId:'user06', carId:70,  startDate:'2026-02-21', endDate:'2026-02-22', startTime:'11:00', endTime:'19:00', carPrice:82000,insurancePrice:12000, totalPrice:94000 },

    // user07 (4)
    { id:'1766041500024_user07', bookedDate:'2025-12-19', userId:'user07', carId:116, startDate:'2026-01-04', endDate:'2026-01-06', startTime:'08:30', endTime:'22:00', carPrice:145000,insurancePrice:12000, totalPrice:157000 },
    { id:'1766041500025_user07', bookedDate:'2025-12-23', userId:'user07', carId:50,  startDate:'2026-01-21', endDate:'2026-01-23', startTime:'06:30', endTime:'10:00', carPrice:42000,insurancePrice:12000, totalPrice:54000 },
    { id:'1766041500026_user07', bookedDate:'2025-12-26', userId:'user07', carId:132, startDate:'2026-02-12', endDate:'2026-02-14', startTime:'09:00', endTime:'18:30', carPrice:138000,insurancePrice:12000, totalPrice:150000 },
    { id:'1766041500027_user07', bookedDate:'2025-12-29', userId:'user07', carId:77,  startDate:'2026-02-27', endDate:'2026-02-28', startTime:'14:00', endTime:'20:00', carPrice:72000,insurancePrice:12000, totalPrice:84000 },

    // user08 (4)
    { id:'1766041500028_user08', bookedDate:'2025-12-20', userId:'user08', carId:100, startDate:'2026-01-07', endDate:'2026-01-08', startTime:'16:00', endTime:'20:00', carPrice:56000,insurancePrice:12000, totalPrice:68000 },
    { id:'1766041500029_user08', bookedDate:'2025-12-24', userId:'user08', carId:187, startDate:'2026-01-29', endDate:'2026-01-30', startTime:'20:00', endTime:'23:00', carPrice:43000,insurancePrice:12000, totalPrice:55000 },
    { id:'1766041500030_user08', bookedDate:'2025-12-27', userId:'user08', carId:150, startDate:'2026-02-09', endDate:'2026-02-11', startTime:'10:00', endTime:'18:00', carPrice:120000,insurancePrice:12000, totalPrice:132000 },
    { id:'1766041500031_user08', bookedDate:'2025-12-30', userId:'user08', carId:66,  startDate:'2026-02-23', endDate:'2026-02-24', startTime:'09:00', endTime:'15:00', carPrice:70000,insurancePrice:12000, totalPrice:82000 },

    // user09 (4)
    { id:'1766041500032_user09', bookedDate:'2025-12-21', userId:'user09', carId:180, startDate:'2026-01-09', endDate:'2026-01-10', startTime:'12:00', endTime:'16:00', carPrice:60000,insurancePrice:12000, totalPrice:72000 },
    { id:'1766041500033_user09', bookedDate:'2025-12-25', userId:'user09', carId:64,  startDate:'2026-01-31', endDate:'2026-02-02', startTime:'14:00', endTime:'20:00', carPrice:98000,insurancePrice:12000, totalPrice:110000 },
    { id:'1766041500034_user09', bookedDate:'2025-12-28', userId:'user09', carId:155, startDate:'2026-02-15', endDate:'2026-02-16', startTime:'08:00', endTime:'14:00', carPrice:74000,insurancePrice:12000, totalPrice:86000 },
    { id:'1766041500035_user09', bookedDate:'2025-12-31', userId:'user09', carId:90,  startDate:'2026-02-27', endDate:'2026-02-28', startTime:'10:00', endTime:'18:00', carPrice:92000,insurancePrice:12000, totalPrice:104000 },

    // user10 (4)
    { id:'1766041500036_user10', bookedDate:'2025-12-22', userId:'user10', carId:190, startDate:'2026-01-11', endDate:'2026-01-12', startTime:'13:30', endTime:'17:30', carPrice:58000,insurancePrice:12000, totalPrice:70000 },
    { id:'1766041500037_user10', bookedDate:'2025-12-26', userId:'user10', carId:195, startDate:'2026-01-24', endDate:'2026-01-25', startTime:'13:30', endTime:'17:30', carPrice:58000,insurancePrice:12000, totalPrice:70000 },
    { id:'1766041500038_user10', bookedDate:'2025-12-29', userId:'user10', carId:168, startDate:'2026-02-06', endDate:'2026-02-08', startTime:'09:00', endTime:'18:00', carPrice:132000,insurancePrice:12000, totalPrice:144000 },
    { id:'1766041500039_user10', bookedDate:'2025-12-31', userId:'user10', carId:72,  startDate:'2026-02-20', endDate:'2026-02-21', startTime:'11:00', endTime:'16:00', carPrice:65000,insurancePrice:12000, totalPrice:77000 }
  ];

    const [bookedlistAll, setBookedlistAll] = useState(() => {
      const saved = localStorage.getItem("bookedlistAll");
      return saved ? JSON.parse(saved) : INITIAL_BOOKED_LIST;
    });
    useEffect(() => {
      localStorage.setItem(
        "bookedlistAll",
        JSON.stringify(bookedlistAll)
      );
      // console.log(bookedlistAll);
    }, [bookedlistAll]);


    
    // 예약 취소 버튼 함수
    // 마이페이지 혹은 예약내역 페이지에서 예약 취소 버튼용
      // const removeBookInfo = (bookId) => {
      //   // booklistUser 에서 해당 데이터 제거
      //   setBooklistUser((prev) =>
      //     prev.((book) => book.id !== bookId)
      //   );

      //   // booklistAll 에서 해당 데이터 제거
      //   setBookedlistAll((prev) =>
      //     prev.((book) => book.id !== bookId)
      //   );

      //   alert("예약이 취소되었습니다.");
      // };


    //  Mypage.jsx 용 
      // 예약 내역 보이기
      // 전체 예약에서 userid 매칭해서 해당 user 예약내역
      // + 차량 정보 합치기(cars)
      const myBookings = useMemo(() => {
          return bookedlistAll
            .filter(book => book.userId === userid)
            .map(book => {
              const car = cars.find(c => c.id === book.carId);
              return { ...book, car };
            })
            .sort(
              (a, b) => new Date(b.bookedDate) - new Date(a.bookedDate)
            );
          }, [bookedlistAll, userid, cars]);


      
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
    const baseModelYear = car.model_year;

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
    const baseVehicleSize = car.car_size;

    if(baseVehicleSize === '중형'){
        totalPrice += 50;
    }else if(baseVehicleSize === '대형'){
        totalPrice += 100;
    }else{
        totalPrice += 0;
    }

    // 연료
    const baseFuelType = car.fuel_type;

    if(baseFuelType === '휘발유'){
        totalPrice += 50;
    }else if(baseFuelType === '하이브리드'){
        totalPrice += 100;
    }else{
        totalPrice += 0;
    }

    // 옵션
    if(car.heated_seat){ totalPrice += 50; }
    if(car.heated_handle){ totalPrice += 50; }
    if(car.sun_loof){ totalPrice += 100; }
    else{ null }

    // 브랜드별 값
    const priceValue = car.price_value;

    // 최종 산출금액
    const finalPrice = Math.round(totalPrice * priceValue);

    return finalPrice;
  }

  // 인기순 차량 선택 변수
  const [clickCar, setClickCar] = useState('');



  return (
    <BookingContext.Provider value={{
      calculatePrice,
      bookedlistAll, 
      setBookedlistAll,
      myBookings,
      myRecentlist,
      setClickCar,
      clickCar
      // removeBookInfo
    }}>
      {children}
    </BookingContext.Provider>
  );
}

