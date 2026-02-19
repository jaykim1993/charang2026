import { useState, useContext, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Link, useNavigate, useParams } from "react-router-dom";
import { BookingContext } from '../contexts/Bookingcontext';
import { CalendarContext } from '../contexts/Calendarcontext';
import { AuthContext } from '../contexts/Authcontext';
import DaumPostCode from 'react-daum-postcode';

import './Reservation.css';

export default function Reservation(){
    // const {  } = useContext(BookingContext);
    const location = useLocation();
    // navigate 보낼 때 넣었던 state 객체 꺼내기 / 비어있을 경우를 대비해 기본값 {} 설정
    const { car, filter, totalPrice, filterStartDate, filterEndDate, filterStartTime, filterEndTime } = location.state || {};
    const { availableCars, filteredInfoUser, startdayText,enddayText, DeleteYear } = useContext(CalendarContext);
    const {userid, username, user_email, user_resistnum, user_phonenum, address, address_detail, user_iskorean, user_license } = useContext(AuthContext);
    const { setBookedlistAll, calculatePrice} = useContext(BookingContext);

    // 예외처리
    if(!car) return <div className='ReservationSection'>날짜, 지점을 선택해주세요.</div>;

    // 주소 수정 (상세주소 검색 모달)
    const [isChange, setIsChange]=useState(false);
    const [openModal,setOpenModal]=useState(false);

    const [zipcode,setZipcode]=useState(''); // 우편번호
    const [change_address, setChange_address]=useState(''); // 지역명 주소

    // const [arr,setArr]=useState('');
    const changeAddressHandler=(data)=>{
        // 도로명, 지역명으로 입력할 예정
        let arr = '';
        if(data.userSeletedType === 'R'){
            arr = data.roadAddress; // 도로명 주소
        }else{
            arr = data.jibunAddress; // 지역명 주소
        }
        setZipcode(data.zonecode);
        setChange_address(arr);
        // setIsChange(!isChange);
        setOpenModal(false);
    }
    console.log(change_address);

    // ===================== 예약/결제 관련 함수 ======================
    const { id } = useParams();
    const navigate = useNavigate();

    const selectedCar = availableCars.find(car => car.id === Number(id)) || availableCars[0];
    const filterCar =
        filteredInfoUser?.find(car => car.id === Number(id))
        ?? filteredInfoUser?.[0];

        if (!selectedCar || !filterCar) {
        return <div>예약 정보를 불러오는 중입니다...</div>;
        } // 방어코드 , 22일 성중 수정
    let date = (new Date(`${filterCar.filterEndDate}T${filterCar.filterEndTime}`)-new Date(`${filterCar.filterStartDate}T${filterCar.filterStartTime}`))/ (1000 * 60 * 30);
    // 예약/결제하기 버튼 함수
    const addBookInfo = () => {
        if (!payment) {
        alert("결제수단을 선택해주세요.");
        return;
        }
        if (!filterCar || !userid) {
            alert("예약 정보를 다시 선택해주세요.");
            return;
        } else {
            alert("예약이 완료되었습니다.");
        }
        setBookedlistAll(prev => [
          ...prev,
          {
            id: `${Date.now()}_${userid}`,
            bookedDate: new Date().toISOString().slice(0, 10),
            userId:userid,
            carId:car.id,
            startDate: filterCar.filterStartDate,
            endDate: filterCar.filterEndDate,
            startTime: filterCar.filterStartTime,
            endTime: filterCar.filterEndTime,
            carPrice: totalPrice,
            insurancePrice:  date * (car.price_value * 200),
            totalPrice: totalPrice + date*car.price_value*200
          }
        ]);
        navigate('/mypage/booked');
    };

    // 상세주소 입력
    const [detailAddress, setDetailAddress] = useState('');

    // 완료 버튼
    const handleAddressComplete = () => {
        if (!zipcode || !change_address) {
            alert("주소를 먼저 검색해주세요.");
            return;
        }
        setIsChange(false);
    };

    //기본 결제수단 
    const [payment, setPayment] = useState(null);
    const payChange = (value) => {
    setPayment(value);
    };

    //모달 세팅값
    const [modalOpen,setModalOpen]=useState(false);
    const [overlayOpen,setOverlayOpen]=useState(false);
    const [backtohome,setBacktohome]=useState(null);

    //홈으로가기버튼
    const goHomeBtn=()=>{
          setOverlayOpen(true);
          setModalOpen(true);
          setBacktohome(1)
    }
    //뒤로가기버튼
    const goBackBtn=()=>{
          setOverlayOpen(true);
          setModalOpen(true);
          setBacktohome(2)
    }
    //페이지이동버튼
    const backPage=()=>{
        setModalOpen(false);
        setOverlayOpen(false);
        if(backtohome ===1?navigate('/'):navigate(-1))
        navigate(-1);
    }
    const stayPage=()=>{
        setModalOpen(false);
        setOverlayOpen(false);
        setBacktohome(null);
    }

    

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
                                <h5>{username}</h5>
                            </li>
                            <li>
                                <label>휴대폰 번호</label>
                                <h5>{user_phonenum}</h5>
                            </li>
                            <li>
                                <label>생년월일</label>
                                <h5>{user_resistnum.slice(0,5)}-*******</h5>
                            </li>
                            <li className="address_position">
                                <label>주소</label>
                                {zipcode === '' 
                                    ? <h5>{address} {address_detail}</h5> 
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
                    <h5><span className="loginColor">{username}</span>님의 여정</h5>
                    <div className="info_box">
                        <p className="label">지점</p>
                        <h4 className="val">{car.location}</h4>
                        <hr />
                        <p className="label">일정</p>
                        <h4 className="val">{DeleteYear(filterStartDate)} ({startdayText}) {filterStartTime} ~ {DeleteYear(filterEndDate)} ({enddayText}) {filterEndTime}</h4>
                        <hr />
                        <p className="label">차량</p>
                        <h4 className="val">{car.model}</h4>
                        <h5>{car.plate_number}</h5>
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
                                    <p><strong style={{color:'gray',fontSize:'15px'}}>{(date*car.price_value*200).toLocaleString()}</strong>&nbsp;원</p>
                                </div>
                                <div className="reserPriceBox">
                                    <span>총 결제 금액</span>
                                    <p><strong>{(totalPrice + date*car.price_value*200).toLocaleString()}</strong>&nbsp;원</p>
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