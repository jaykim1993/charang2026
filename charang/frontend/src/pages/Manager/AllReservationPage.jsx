import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../contexts/Datacontext";
import './AllReservationPage.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function AllReservationPage(){

    const { 
        pageNum, 
        paging, 
        allBookCar, 
        searchTypeBook, 
        setSearchTypeBook, 
        searchWordBook, 
        setSearchWordBook, 
        searchResetHandler,
        bookFind, 
        setPageNum, 
        pagesHandler, 
        allBookStatus, 
        bookStatusFind, 
        isBookLoading 
    } = useContext(DataContext);

    // 화면 이동 훅
    const navi = useNavigate();

    // 예약 검색 핸들러
    const searchHandler = () => {
        setPageNum(1); // 검색했을때 1페이지를 기본값으로 초기화
        bookFind();
    }
    
    // --- 추가된 초기화 로직 ---
    useEffect(() => {
        // 다른 페이지에서 진입 시 무조건 1페이지로 시작
        setPageNum(1);
        setSearchTypeBook("bookingId");
        searchResetHandler();
        bookStatusFind();
    }, []);


    // -----------------------
    // 예약정보+차량정보 불러오기 from ManagerDTO
    useEffect(() => {
        bookFind();
        bookStatusFind();
    }, [pageNum]);

        // console.log(user);

    // Paging from DataContext
    useEffect(() => {
        // console.log("paging 상태가 변경됨!! : ", paging);
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
    // console.log(delBooking);
     const delHandler = () => {
    
            // 체크를 하지 않고 삭제버튼을 눌렀을 경우
            if(delBooking.length == 0){
                alert("삭제할 예약을 선택해주세요.");
                return;
            }else{
                const confirmCancel = window.confirm(`${delBooking.length}개의 예약데이터를 삭제하시겠습니까?`);
                if (!confirmCancel) return;
                axios.delete("/api/deleteSelectBooks", {
                    data: delBooking
                    })
                .then((res)=>{
                    // console.log("예약 삭제 결과: ", res.data);
                    if(res.data){
                        alert(`${delBooking.length}개의 예약데이터가 삭제되었습니다.`);
                        bookFind();
                        setDelBooking([]);
                        bookStatusFind();
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
    const placeholderWord = () => {
        // console.log("검색 타입:", searchTypeBook);
        if (searchTypeBook === "bookingId") {
            return "예약코드를 검색하세요";
        } else if(searchTypeBook === "userId") {
            return "예약자ID를 검색하세요";
        } else if(searchTypeBook === "name") {
            return "예약자를 검색하세요";
        } else if(searchTypeBook === "car") {
            return "예약차량를 검색하세요";
        }
    };
    
    useEffect(() => {
        if (searchWordBook === "") {
            searchHandler();
        }
    }, [searchWordBook]);

    const inputDelHandler = () => {
        setSearchWordBook("");
        setPageNum(1);
    }

    return (
        <div className="AllReservation">
            <h1>전체 예약목록</h1>
            <div className="AllReservation_top">
                <div className="search_area">
                    {/* 검색 타입 */}
                    <select name="searchTypeBook" className="search_select" value={searchTypeBook}
                        onChange={(e) => setSearchTypeBook(e.target.value)}>
                        <option value="bookingId">예약코드</option>
                        <option value="userId">예약자ID</option>
                        <option value="name">예약자</option>
                        <option value="car">예약차량</option>
                    </select>
                    {/* 검색 */}
                    <input
                        type="text"
                        name="searchWordBook"
                        value={searchWordBook}
                        className="search_input"
                        placeholder={placeholderWord()}
                        onChange={(e) => setSearchWordBook(e.target.value)} />
                    {searchWordBook != "" ? <i className="bi bi-x-circle-fill" onClick={inputDelHandler}></i> : <></>}
                    <button type="button" onClick={searchHandler} className="search_btn">검색</button>
                </div>
                <button className="del_btn" onClick={delHandler}>삭제하기</button>
            </div>       

            <table className="AllReservation_table" border={1}>
                <thead className="AllReservation_table_th">
                    <tr className="AllReservation_table_tr">
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
                        <th className="AllReservation_tableResDate" style={{width:'10%'}}>삭제<p>({delBooking.length}/{allBookStatus.length})</p></th>
                    </tr>
                </thead>
                {isBookLoading? (
                    <tbody className="m_AllCar_tb">
                        <tr className="m_AllCar_tr_none">
                            <td colSpan={11} className="m_AllCar_td_none">
                                예약정보를 불러오는 중입니다...
                            </td>
                        </tr>
                    </tbody>
                ) : (
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
                                checked={delBooking.includes(item.bookingId)}
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
                )}
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