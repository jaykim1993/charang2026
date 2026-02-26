import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BookingContext } from "../contexts/Bookingcontext";
import { CalendarContext } from "../contexts/Calendarcontext";
import { DataContext } from "../contexts/Datacontext";
import { AuthContext } from '../contexts/Authcontext';
import "./Reservation.css";

export default function Reservation() {
    /* ===================== router ===================== */
    const navigate = useNavigate();


    const selectedCarId =
    Number(useParams().selectedCarId) ||
    JSON.parse(sessionStorage.getItem("selectedCarId"));
    const [searchParams] = useSearchParams();
    const carPrice = Number(searchParams.get("totalPrice"));
    // console.log(selectedCarId);
    const id = selectedCarId;
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
    /* ===================== user ===================== */
    const userID = JSON.parse(sessionStorage.getItem("userid") || "{}").userId;
    console.log("세션에서 불러온 로그인 유저 ID ", userID);
    const [userinfo,setUserinfo]=useState(userID);
    
    useEffect(()=>{
    axios.get(`/api/userinfo/${userID}`,{userId:userID})
    .then((res)=>{
        if(!res.data){
        loginNeeded();
        }else{
        console.log(res.data);
        setUserinfo(res.data);
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

    if (!userinfo) {
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
    const carId = selectedCarId;
    const bookedDate = new Date().toISOString().slice(0, 10);
    const startDate = searchFilters.startDate;
    const startTime = searchFilters.startTime;
    const endDate = searchFilters.endDate;
    const endTime = searchFilters.endTime; 
    const insurancePrice = date * selectedCar.priceValue * 200;
    const finalTotalPrice = carPrice + insurancePrice;
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
            paymentMethod: payment,
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
            totalPrice: finalTotalPrice,
            paymentMethod: payment
        })
        .then((res)=>{
            if(res.data == 1){

                const confirmCancel = window.confirm('결제를 진행하시겠습니까?');
                if (!confirmCancel) return;
                alert("결제가 완료되었습니다. 예약 정보 페이지로 이동합니다.");
                fetchBookedList();
                navigate(`/mypage/detail/${bookingId}`);
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
                    <h3><span>운전자 정보</span>를 확인해주세요.</h3>
                    <p>운전자 정보는 안전하게 보호됩니다.</p>
                    {/* 운전자 기본 정보 */}
                    <div className='Reser_driverBasicInfo'>
                        <h5 className="Reser_h4">기본 정보</h5>
                        <ul>
                            <li>
                                <label>이름</label>
                                <h5>{userinfo.name}</h5>
                            </li>
                            <li>
                                <label>휴대폰 번호</label>
                                <h5>{userinfo.phone}</h5>
                            </li>
                            <li>
                                <label>생년월일</label>
                                <h5>{userinfo.resistNum}</h5>
                            </li>
                            <li className="address_position">
                                <label>주소</label>
                                <h5>{userinfo.address} {userinfo.addressDetail}</h5>
                            </li>
                        </ul>
                        <h5 className="Reser_h4">면허정보</h5>
                        <ul>
                            <li>
                                <label>면허종류</label>
                                <h5>{userinfo.license}종 보통</h5>
                            </li>
                            <li>
                                <label>면허번호</label>
                                <h5>{userinfo.licenseNum}</h5>
                            </li>
                        </ul>
                    </div>
                    {/* 안내문구 */}
                    <div className='Reser_reservationNotice'>
                        <div className="R_notice">
                            <strong><i className="bi bi-exclamation-circle-fill"></i> 유의사항</strong>
                            <p>· 입력한 운전자 정보와 예약자 정보가 다를 경우 대여가 제한될 수 있어요.</p>
                            <p>· 나이, 면허종류, 운전경력에 따라 이용 가능한 차종 및 차량이 다를 수 있어요.</p>
                            <p>· 취소 수수료는 취소 시점에 따라 차등 적용되오며, 당일 취소는 환불 불가합니다.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 우측 선택일자, 지점, 차량 */}
            <div className='Reser_reservationSummary'>
                <div className="summary_card">
                    <h5><span className="loginColor">{userinfo.name}</span>님의 여정</h5>
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
                                    <p><strong style={{color:'gray',fontSize:'15px'}}>{carPrice.toLocaleString()}</strong>&nbsp;원</p>
                                </div>
                                <div className="reserPriceBox">
                                    <span>보험 금액</span>
                                    <p><strong style={{color:'gray',fontSize:'15px'}}>{(date*selectedCar.priceValue*200).toLocaleString()}</strong>&nbsp;원</p>
                                </div>
                                <div className="reserPriceBox">
                                    <span>총 결제 금액</span>
                                    <p><strong>{(carPrice + date*selectedCar.priceValue*200).toLocaleString()}</strong>&nbsp;원</p>
                                </div>     
                                <hr />
                                <p>결제수단 선택</p>
                                <ul>
                                    <li>
                                        <input
                                        type="checkbox"
                                        id="payment01"
                                        checked={payment === "무통장입금"}
                                        onChange={() => payChange("무통장입금")}
                                        />
                                        <label htmlFor="payment01">무통장입금</label>
                                    </li>
                                    <li>
                                        <input
                                        type="checkbox"
                                        id="payment02"
                                        checked={payment === "카카오페이"}
                                        onChange={() => payChange("카카오페이")}
                                        />
                                        <label htmlFor="payment02">카카오페이</label>
                                        <img src="/kakao_pay.png" alt="카카오페이" className="kakao_pay" />
                                    </li>
                                    <li>
                                        <input
                                        type="checkbox"
                                        id="payment03"
                                        checked={payment === "네이버페이"}
                                        onChange={() => payChange("네이버페이")}
                                        />
                                        <label htmlFor="payment03">네이버페이</label>
                                        <img src="/naver_pay.png" alt="네이버페이" className="naver_pay" />
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