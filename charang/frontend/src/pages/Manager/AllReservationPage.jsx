import { useState, useContext, useEffect, useMemo } from "react";
import { DataContext } from "../../contexts/Datacontext";
import './AllReservationPage.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function AllReservationPage(){

    const { pageNum, paging, allBookCar, user, searchType, setSearchType, setSearchWord, bookFind, userFind, setPageNum, pagesHandler } = useContext(DataContext);

    // 화면 이동 훅
    const navi = useNavigate();

    // 예약정보+차량정보 불러오기 from ManagerDTO
    useEffect(() => {
        // userFind();
        bookFind();
    }, [pageNum]);

        console.log(user);

    // Paging from DataContext
    useEffect(() => {
        console.log("paging 상태가 변경됨!! : ", paging);
    }, [paging]); // paging 값이 바뀔 때마다 실행됨



    // --------------삭제
    // 체크한 해당 예약의 bookingId 가져오는 핸들러
    const checkHandler = (e, bookingId) => {
        let delBookingCopy = [...delBooking] // 얉은 복사

        if(e.target.checked){
            delBookingCopy.push(bookingId);
            setDelBooking(delBookingCopy);
        }
        else{
            delBookingCopy = delBooking.filter(id => id !== bookingId);
            setDelBooking(delBookingCopy);
        }
    }

    
    // 삭제 예약의 id를 담는 상태변수
    const [delBooking, setDelBooking] = useState([]);
    console.log(delBooking);
     const delHandler = () => {
    
            // 체크를 하지 않고 삭제버튼을 눌렀을 경우
            if(delBooking.length == 0){
                alert("삭제할 예약을 선택해주세요.");
                return;
            }else{
                const confirmCancel = window.confirm('선택 예약을 삭제하시겠습니까?');
                if (!confirmCancel) return;
                axios.delete("/api/deleteSelectBooks", {
                    data: delBooking
                    })
                .then((res)=>{
                    console.log("예약 삭제 결과: ", res.data);
                    if(res.data){

                        alert("선택 예약이 삭제되었습니다.");
                        bookFind();
                    }else{
                        alert("다시 시도해주세요.");
                    }
                })
                .catch((error)=>{
                    console.log("받아온 삭제 결과 에러: ", error);
                    alert("받아온 삭제 결과 에러: ", error);
                })
            }
        }

    // placeholder
    const placeholderWord = (searchType) => {
        console.log("검색: ", searchType);
         if(searchType === "bookingId"){
            return "예약코드를 검색하세요";
        }else{
            return "예약자ID를 검색하세요";
        }
    }

    return(
        <div className="AllReservation">
            <h1>전체 예약 목록</h1>
            <div className="AllReservation_top">
                <div className="search_area">
                    {/* 검색 타입 */}
                    <select name="searchType" className="search_select"
                    onChange={(e)=> setSearchType(e.target.value)}>
                        <option value="bookingId">예약코드</option>
                        <option value="userId">예약자ID</option>
                    </select>
                    {/* 검색 */}
                    <input type="text" name="searchWord" className="search_input" placeholder={placeholderWord(searchType)}
                    onChange={(e)=> setSearchWord(e.target.value)}/>
                    <button type="button" onClick={bookFind} className="search_btn">검색</button>
                </div>
                <button className="del_btn" onClick={delHandler}>삭제하기</button>
            </div>
            

            <table className="AllReservation_table" border={1}>
                <thead className="AllReservation_table_th">
                    <tr>
                        <th className="AllReservation_tableNum" style={{width:'5%'}}>번호</th>
                        <th className="AllReservation_tableNum" style={{width:'20%'}}>예약코드</th>
                        <th className="AllReservation_tableUser" style={{width:'5%'}}>예약자ID</th>
                        <th className="AllReservation_tableUser" style={{width:'7%'}}>예약자</th>
                        <th className="AllReservation_tableCar" style={{width:'10%'}}>예약차량</th>
                        <th className="AllReservation_tableResDate" style={{width:'9%'}}>예약일자</th>
                        <th className="AllReservation_tableRentDate" style={{width:'10%'}}>대여일자</th>
                        <th className="AllReservation_tableResDate" style={{width:'10%'}}>반납일자</th>
                        <th className="AllReservation_tableResDate" style={{width:'10%'}}>결제금액</th>
                        <th className="AllReservation_tableResDate" style={{width:'7%'}}>진행상태</th>
                        <th className="AllReservation_tableResDate" style={{width:'10%'}}>예약삭제</th>
                    </tr>
                </thead>
                <tbody className="AllReservation_table_tb">
                    {allBookCar && allBookCar.length > 0 ? (
                    allBookCar.map((item, index) => {
                        const pageSize = paging?.pageSize || 10; // 페이지당 개수
                        const rowNumber = (pageNum - 1) * pageSize + index + 1;

                        return (
                        <tr key={item.bookingId}>
                            <td>{rowNumber}</td>
                            <td className="AllReservation_clicktd" onClick={() => navi(`/manager/reservationDetail/${item.bookingId}?userName=${item.name}`)}>{item.bookingId}</td>
                            <td className="AllReservation_clicktd" onClick={() => navi(`/manager/reservationDetail/${item.bookingId}?userName=${item.name}`)}>{item.userId}</td>
                            <td className="AllReservation_clicktd" onClick={() => navi(`/manager/reservationDetail/${item.bookingId}?userName=${item.name}`)}>{item.name}</td>
                            <td className="AllReservation_clicktd" onClick={() => navi(`/manager/reservationDetail/${item.bookingId}?userName=${item.name}`)}> {item.model}</td>
                            <td>{item.bookedDate}</td>
                            <td>{item.startDate} {item.startTime.slice(0, 8)}</td>
                            <td>{item.endDate} {item.endTime.slice(0, 8)}</td>
                            <td>{item.totalPrice.toLocaleString()}원</td>
                            <td>{item.bookingStatus === "ONGOING"?"진행중":item.bookingStatus === "UPCOMING"?"대기중":"지난예약"}</td>
                            <td className="m_AllCar_tableDel">
                            <input
                                type="checkbox"
                                name="delcheck"
                                className="AllCar_del"
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => checkHandler(e, item.bookingId)}
                            />
                            </td>
                        </tr>
                        );
                    })
                    ) : (
                    <tr className="AllReservation_tr_none">
                        <td className="AllReservation_td_none" colSpan={12}>
                        예약이 존재하지 않습니다.
                        </td>
                    </tr>
                    )}
                    
                </tbody>
            </table>
            {/* 페이징 */}
            <div className="paging">
                {/* 이전 버튼 */}
                {/* 5페이지 넘어가야 화살표 나옴 */}
                {paging.prev && (
                    <button onClick={() => setPageNum(paging.startPage - 1)}>
                        <i className="bi bi-caret-left-fill"></i>
                    </button>
                )}

                {/* 페이지 번호들 */}
                {pagesHandler().map(num => (
                    <button key={num} className={pageNum === num ? "active" : ""} onClick={() => setPageNum(num)}>
                        {num}
                    </button>
                ))}

                {/* 다음 버튼 */}
                {paging.next && (
                    <button onClick={() => setPageNum(paging.endPage + 1)}>
                        <i className="bi bi-caret-right-fill"></i>
                    </button>
                )}
            </div>
        </div>
    )
}