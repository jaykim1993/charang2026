import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../contexts/Datacontext";
import './AllReservationPage.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function AllReservationPage(){

    const { pageNum, setPageNum, pagesHandler, paging, setPaging } = useContext(DataContext);
    const [allBookCar, setAllBookCar] = useState([]);

    // 화면 이동 훅
    const navi = useNavigate();

    // 예약정보+차량정보 불러오기 from ManagerDTO
    useEffect(()=>{
        find();
    },[])
    useEffect(()=>{
        find();
    },[pageNum]);
    // Paging from DataContext
    useEffect(() => {
        console.log("paging 상태가 변경됨!! : ", paging);
    }, [paging]); // paging 값이 바뀔 때마다 실행됨




    const [searchType, setSearchType] = useState('model');
    const [searchWord, setSearchWord] = useState('');
    const find = () => {
        console.log("검색 타입:", searchType); 
        console.log("검색 단어:", searchWord);
        axios.get("/api/bookcarlist",{params:{searchType:searchType, searchWord:searchWord, page:pageNum}})
        .then((res)=>{
            if(res.data){
                setPaging(res.data.ph);
                setAllBookCar(res.data.list);
                console.log("예약+차량정보 ", allBookCar);
            }
        })
        .catch((error)=>{
            console.log("예약정보 받기 서버 오류", error);
        })
    }

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
                axios.delete("/api/deleteSelectBooks", {
                    data: delBooking
                    })
                .then((res)=>{
                    console.log("예약 삭제 결과: ", res.data);
                    if(res.data){
                        alert("선택 예약이 삭제되었습니다.");
                        find();
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

    return(
        <div className="ManagerAllReservation">
            <h1>전체 예약 목록</h1>
            {/* 검색 타입 */}
            <select name="searchType" onChange={(e)=> setSearchType(e.target.value)}>
                <option value="model">예약 차량</option>
                <option value="userId">예약자 아이디</option>
            </select>
            {/* 검색 */}
            <input type="text" name="searchWord" onChange={(e)=> setSearchWord(e.target.value)}/>
            <button type="button" onClick={find}>검색</button>
            <table className="managerAllReservation_table" border={1}>
                <thead className="managerAllReservation_table_th">
                    <tr>
                        <th className="managerAllRes_tableNum">번호</th>
                        <th className="managerAllRes_tableNum">예약코드</th>
                        <th className="managerAllRes_tableResDate">예약 일자</th>
                        <th className="managerAllRes_tableUser">예약자 아이디</th>
                        <th className="managerAllRes_tableCar">예약 차량</th>
                        <th className="managerAllRes_tableRentDate">시작 일자</th>
                        <th className="managerAllRes_tableReturnDate">시작 시간</th>
                        <th className="managerAllRes_tableResDate">반납 일자</th>
                        <th className="managerAllRes_tableResDate">반납 시간</th>
                        <th className="managerAllRes_tableResDate">삭제</th>
                        
                    </tr>
                </thead>
                <tbody className="managerAllReservation_table_tb">
                    {allBookCar && allBookCar.length>0?
                        allBookCar.map((item,index)=>(
                                <tr key={index} onClick={()=>navi(`/manager/reservationDetail/${item.bookingId}`)}>
                                    <td>{index+1}</td>
                                    <td>{item.bookingId}</td>
                                    <td>{item.bookedDate}</td>
                                    <td>{item.userId}</td>
                                    <td>{item.model}</td>
                                    <td>{item.startDate}</td>
                                    <td>{item.startTime}</td>
                                    <td>{item.endDate}</td>
                                    <td>{item.endTime}</td>
                                    <td className="m_AllCar_tableDel">
                                        {/* 체크한 차량의 carId만 값을 들고옴 */}
                                        <input type="checkbox" name="delcheck" 
                                        className="AllCar_del" onChange={(e)=>{checkHandler(e, item.bookingId)}}></input>
                                    </td>
                                </tr>
                        ))

                        :
                        <tr className="m_AllCar_tr_none">
                            <td className="m_AllCar_td_none" colSpan={10}>
                                예약이 존재하지 않습니다.
                            </td>
                        </tr>
                    }
                    
                </tbody>
            </table>
            {/* 페이징 */}
                <div className="notice_paging">
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
            <div className="btn_part">
                <button className="del_btn" onClick={delHandler}>삭제하기</button>
            </div>
        </div>
    )
}