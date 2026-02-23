import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { BookingContext } from "../contexts/Bookingcontext";
import { CalendarContext } from "../contexts/Calendarcontext";
import { DataContext } from "../contexts/Datacontext";
import { AuthContext } from '../contexts/Authcontext';
import DaumPostCode from "react-daum-postcode";
import "./Reservation.css";

export default function Reservation() {
    /* ===================== router ===================== */
    const navigate = useNavigate();

    const { state } = useLocation();

    const selectedCarId =
    state?.selectedCarId ||
    JSON.parse(sessionStorage.getItem("selectedCarId"));

    console.log(state.selectedCarId);
    const id = state.selectedCarId;
    console.log(id);
    /* ===================== context ===================== */
    const { fetchBookedList } = useContext(BookingContext);
    const { startdayText, enddayText, DeleteYear } = useContext(CalendarContext);
    const { car, branch } = useContext(DataContext);
    const { loginNeeded }=useContext(AuthContext);


    /* ===================== sessionStorage ===================== */
    const filteredInfoUser =
        JSON.parse(sessionStorage.getItem("filteredInfoUser")) || [];
    const firstFilteredCar =
        JSON.parse(sessionStorage.getItem("firstFilteredCar")) || [];
    const searchFilters =
        JSON.parse(sessionStorage.getItem("searchFilters")) || [];
    const totalPrice = 
        JSON.parse(sessionStorage.getItem("totalPrice")) || [];
    /* ===================== user ===================== */
    const [userid,setUserid]=useState(null);

    useEffect(()=>{
    axios.get('/api/userinfo')
    .then((res)=>{
        if(!res.data){
        loginNeeded();
        }else{
        setUserid(res.data);
        }
    })
    .catch((error)=>{
        console.log(error)
    })
    },[])
    
    /* ===================== 주소 관련 ===================== */
    const [isChange, setIsChange] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [zipcode, setZipcode] = useState("");
    const [change_address, setChange_address] = useState("");
    const [detailAddress, setDetailAddress] = useState("");

    const changeAddressHandler = (data) => {
        const address =
        data.userSelectedType === "R"
            ? data.roadAddress
            : data.jibunAddress;

        setZipcode(data.zonecode);
        setChange_address(address);
        setOpenModal(false);
    };

    /* ===================== 결제 ===================== */
    const [payment, setPayment] = useState(null);
     
    const payChange = (value) => {
    setPayment(value);
    };

    /* ===================== 모달 ===================== */
    const [modalOpen, setModalOpen] = useState(false);
    const [overlayOpen, setOverlayOpen] = useState(false);
    const [backtohome, setBacktohome] = useState(null);

    /* ===================== 데이터 가공 ===================== */
    const selectedCar =
    firstFilteredCar.find(car => car.carId === Number(selectedCarId)) ||
    car.find(car => car.carId === Number(selectedCarId)) ||
    null;

    const filterCar =
    filteredInfoUser.find(car => car.carId === Number(selectedCarId)) ||
    {
        filterStartDate: searchFilters.startDate,
        filterEndDate: searchFilters.endDate,
        filterStartTime: searchFilters.startTime,
        filterEndTime: searchFilters.endTime,
    };
    const branchName =
    selectedCar && branch.length > 0
        ? branch.find(b => b.branchId === selectedCar.branchId)?.name || ''
        : '';
    /* ===================== 예외 처리 (Hook 이후) ===================== */
    if (!selectedCarId) {
    return <div>잘못된 접근입니다.</div>;
    }

    if (!userid) {
    return <div>로딩중...</div>;
    }

    if (!selectedCar) {
    return <div>차량 정보를 불러올 수 없습니다.</div>;
    }

    /* ===================== 날짜 계산 ===================== */
    const date =
        (new Date(`${filterCar.filterEndDate}T${filterCar.filterEndTime}`) -
        new Date(`${filterCar.filterStartDate}T${filterCar.filterStartTime}`)) /
        (1000 * 60 * 30);

    /* ==================== 예약 확정 ===================== */
    const sessionUser = sessionStorage.getItem("userid");
    const userId = sessionUser ? JSON.parse(sessionUser).userId : null;
    console.log(userId); // "user01"
    const bookingId = `${Date.now()}_${userId}`;
    const carId = state.selectedCarId;
    const bookedDate = new Date().toISOString().slice(0, 10);
    const startDate = searchFilters.startDate;
    const startTime = searchFilters.startTime;
    const endDate = searchFilters.endDate;
    const endTime = searchFilters.endTime;
    const carPrice = totalPrice; 
    const insurancePrice = date * selectedCar.priceValue * 200;
    const finalTotalPrice = totalPrice + insurancePrice;
        console.log({
            bookingId,
            userId,
            carId,
            bookedDate,
            startDate,
            startTime,
            endDate,
            endTime,
            carPrice,
            insurancePrice,
            totalPrice: finalTotalPrice,
            });
    const addBookInfo = () => {
        if (!payment) {
            alert("결제수단을 선택해주세요.");
            return;
        }
        // 관리자 예약 방어코드 26.02.23 성중
        if (userId ==="admin") {
            alert("관리자는 예약이 불가합니다.");
            return;
        }

        axios.post('/api/insertBook', {    
            bookingId: bookingId,
            userId: userId,
            carId: carId,
            bookedDate: bookedDate,
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,
            carPrice: carPrice,
            insurancePrice: insurancePrice,
            totalPrice: finalTotalPrice
        })
        .then((res)=>{
            if(res.data == 1){

                alert("예약이 완료되었습니다.");
                fetchBookedList();
                navigate("/mypage/booked");
            }
        })
        .catch((error)=>{
            alert("예약 에러 발생");
            console.log(error);
        })


    };

    /* ===================== 이동 ===================== */
    const goHomeBtn = () => {
        setOverlayOpen(true);
        setModalOpen(true);
        setBacktohome(1);
    };

    const goBackBtn = () => {
        setOverlayOpen(true);
        setModalOpen(true);
        setBacktohome(2);
    };

    const backPage = () => {
        setModalOpen(false);
        setOverlayOpen(false);
        backtohome === 1 ? navigate("/") : navigate(-1);
    };

    const stayPage = () => {
        setModalOpen(false);
        setOverlayOpen(false);
        setBacktohome(null);
    };




    return(
        <div className="ReservationSection">
            {modalOpen?
            <div className="modalOpen">
                    <i onClick={stayPage} className="bi bi-x"></i>
                    <p className="havetologin">예약이 아직 완료되지 않았습니다.<br/>
                        페이지를 떠나시면 입력한 내용이 사라질 수 있습니다.
                    </p>
                <div className="reservationmodalbtn">
                    <button onClick={backPage}>{backtohome===1? '홈으로 이동하기':'뒤로가기'}</button>
                    <button onClick={stayPage}>예약 계속하기</button>
                </div>
            </div>
            :null}

            {overlayOpen?
            <div className="reservationOverlay"></div>:null
            }
            {/* 좌측 운전자 정보 */}
            <div className='Reser_reservationInfo'>
                {/* 홈 > 예약하기 > 결제하기 */}
                <div className="R_Head">
                    <span onClick={goHomeBtn} style={{color: '#999',cursor:'pointer'}}>홈</span>
                    <i className="bi bi-chevron-right" style={{color: '#999'}}></i>
                    <span onClick={goBackBtn} style={{color: '#999',cursor:'pointer'}}>예약하기</span>
                    <i className="bi bi-chevron-right" style={{color: '#999'}}></i>
                    <span>결제하기</span>
                </div>
                <h2>결제하기</h2>
                <div className='Reser_driverInfo'>
                    <h3><span>운전자 정보(예약자)</span>를 입력해 주세요.</h3>
                    <p>입력한 정보는 안전하게 보호할게요.</p>
                    {/* 운전자 기본 정보 */}
                    <div className='Reser_driverBasicInfo'>
                        <h4 className="Reser_h4">기본 정보</h4>
                        <ul>
                            <li>
                                <label>이름</label>
                                <h5>{userid.name}</h5>
                            </li>
                            <li>
                                <label>휴대폰 번호</label>
                                <h5>{userid.phone}</h5>
                            </li>
                            <li>
                                <label>생년월일</label>
                                <h5>{userid.resistNum.slice(0,5)}-*******</h5>
                            </li>
                            <li className="address_position">
                                <label>주소</label>
                                {zipcode === '' 
                                    ? <h5>{userid.address} {userid.addressDetail}</h5> 
                                    : <><h5>{zipcode}</h5> <h5>{change_address}</h5> <h5>{detailAddress}</h5></>
                                }
                                <button type='button' onClick={()=>setIsChange(!isChange)} className="addressBtn">주소검색</button>
                                
                                {isChange && 
                                    <div className="R_address_Modal">
                                        <i className="bi bi-x-lg" onClick={()=>setIsChange(!isChange)}></i>
                                        <input type='text' value={zipcode} placeholder='우편번호' readOnly name='post' id='post'/>
                                        <button type='button' id='userAddrsearch' onClick={()=>setOpenModal(!openModal)}>
                                            우편번호 검색
                                        </button>
                                        <input type='text' value={change_address} onChange={(e) => setChange_address(e.target.value)} 
                                            placeholder='도로명주소' name='userAddress' id='userAddress'/>
                                        <input type='text' placeholder='상세주소 입력' value={detailAddress}
                                    onChange={(e) => setDetailAddress(e.target.value)} name='detailAddress' id='detailAddress' />

                                        <br />

                                        <button type="button" onClick={handleAddressComplete} className="handleAddressComplete">완료</button>
                                    </div>
                                }
                                {openModal ? 
                                    <div className='R_modal'>
                                        <i className="bi bi-x-lg" onClick={()=>setOpenModal(!openModal)}></i>
                                        <DaumPostCode onComplete={changeAddressHandler} style={{height: '100%'}}/>
                                    </div>
                                : null}
                            </li>
                        </ul>
                    </div>
                    {/* 운전면허 정보 */}
                    <div className='Reser_driverLicenseInfo'>
                        <h4 className="Reser_h4">운전면허 정보</h4>
                        <ul>
                            <li>
                                <label>면허번호</label>
                                <input type='text' placeholder="예&#41; 구면허증 : 서울0112345600 / 신면허증 : 110112345600" />
                                {/* <p>예시&#41; 구면허증 : 서울0112345600 / 신면허증 : 110112345600</p> */}
                            </li>
                            <li>
                                <label>면허정보</label>
                                <input type='text' placeholder="예&#41; 2종 보통" />
                            </li>
                            <li>
                                <label>발급일자</label>
                                <input type='text' placeholder="예&#41; 20250123" />
                            </li>
                            <li>
                                <label>만료일자</label>
                                <input type='text' placeholder="예&#41; 20350123" />
                            </li>
                        </ul>
                        {/* 안내문구 */}
                        <div className='Reser_reservationNotice'>
                            <p>· 입력한 운전자 정보와 예약자 정보가 다를 경우 대여가 제한될 수 있어요.</p>
                            <p>· 나이, 면허종류, 운전경력에 따라 이용 가능한 차종 및 차량이 다를 수 있어요.</p>
                            {/* <p>자세한 자격 조건이 궁금하세요?</p> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* 우측 선택일자, 지점, 차량 */}
            <div className='Reser_reservationSummary'>
                <div className="summary_card">
                    <h5><span className="loginColor">{userid.name}</span>님의 여정</h5>
                    <div className="info_box">
                        <p className="label">지점</p>
                        <h4 className="val">{branchName}</h4>
                        <hr />
                        <p className="label">일정</p>
                        <h4 className="val">{DeleteYear(filterCar.filterStartDate)} ({startdayText}) {filterCar.filterStartTime} ~ {DeleteYear(filterCar.filterEndDate)} ({enddayText}) {filterCar.filterEndTime}</h4>
                        <hr />
                        <p className="label">차량</p>
                        <h4 className="val">{selectedCar.model}</h4>
                        <h5>{selectedCar.plateNumber}</h5>
                        <hr />                        
                        <div className="price_total">
                            {/* 결제정보 */}
                            <div className='Reser_payment'>
                                <h4 className="Reser_h4">결제 정보</h4>
                                <div className="reserPriceBox">
                                    <span>차량 금액</span>
                                    <p><strong style={{color:'gray',fontSize:'15px'}}>{totalPrice.toLocaleString()}</strong>&nbsp;원</p>
                                </div>
                                <div className="reserPriceBox">
                                    <span>보험 금액</span>
                                    <p><strong style={{color:'gray',fontSize:'15px'}}>{(date*selectedCar.priceValue*200).toLocaleString()}</strong>&nbsp;원</p>
                                </div>
                                <div className="reserPriceBox">
                                    <span>총 결제 금액</span>
                                    <p><strong>{(totalPrice + date*selectedCar.priceValue*200).toLocaleString()}</strong>&nbsp;원</p>
                                </div>     
                                <hr />
                                <p>결제수단 선택</p>
                                <ul>
                                    <li>
                                        <input
                                        type="checkbox"
                                        id="payment01"
                                        checked={payment === "bank"}
                                        onChange={() => payChange("bank")}
                                        />
                                        <label htmlFor="payment01">무통장입금</label>
                                    </li>
                                    <li>
                                        <input
                                        type="checkbox"
                                        id="payment02"
                                        checked={payment === "kakao"}
                                        onChange={() => payChange("kakao")}
                                        />
                                        <label htmlFor="payment02">카카오페이</label>
                                        <img src="kakao_pay.png" alt="카카오페이" className="kakao_pay" />
                                    </li>
                                    <li>
                                        <input
                                        type="checkbox"
                                        id="payment03"
                                        checked={payment === "naver"}
                                        onChange={() => payChange("naver")}
                                        />
                                        <label htmlFor="payment03">네이버페이</label>
                                        <img src="naver_pay.png" alt="네이버페이" className="naver_pay" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <button className="pay_btn" onClick={addBookInfo}>결제하기</button>
                    </div>
                </div>
            </div>
            {isChange && <div className="R_modal_overlay"></div>}
        </div>
    )
}