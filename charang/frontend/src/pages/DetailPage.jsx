import { useState, useContext, useEffect } from "react";
import { CalendarContext } from "../contexts/Calendarcontext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { BookingContext } from "../contexts/Bookingcontext";
import { AuthContext } from "../contexts/Authcontext";
import { DataContext } from "../contexts/Datacontext";

// MapContainer = 맵을 불러오는 상자 
// TileLayer 하단 설명 참고
// Marker 마커 좌표 설정시 마커 생성
// Popup 마커 클릭시 텍스트 출력
import 'leaflet/dist/leaflet.css';
import './DetailPage.css'

export default function DetailPage(){
    const { userid, setModal } = useContext(AuthContext);
    const { calculatePrice } = useContext(BookingContext);
    const {  DeleteYear, startdayText, enddayText} = useContext(CalendarContext);
    // console.log('calculatePrice');
    // console.log(calculatePrice);
    const storedFilteredInfoUser = JSON.parse(localStorage.getItem("filteredInfoUser")) || [];
    const storedCalendarFilters = JSON.parse(localStorage.getItem("calendarFilters")) || {};
    
    // 차 id 가져오기
    const selectedCarId = Number(useParams().id);
    // user id 가져오기
    const { car,branch } = useContext(DataContext);
    
    const navigate = useNavigate();

    // console.log(selectedCarId);
    // 선택 차량
    const selectedCar = JSON.parse(localStorage.getItem("firstFilteredCar") || "[]")
    .find(car => car.carId === selectedCarId) || null;

    // 사용자 필터
        const filterCar = storedFilteredInfoUser.find(car => car.carId === selectedCarId) || {
        filterStartDate: storedCalendarFilters.startDate,
        filterEndDate: storedCalendarFilters.endDate,
        filterStartTime: storedCalendarFilters.startTime,
        filterEndTime: storedCalendarFilters.endTime,
        carId: selectedCar?.carId,
        branchId: selectedCar?.branchId,
        fuelType: selectedCar?.fuelType,
        };

    // 최근 본 차량 추가(Local Storage)
    useEffect(() => {
        if (!selectedCar || !userid) return;

            const raw = localStorage.getItem("recentView");
            const prev = raw ? JSON.parse(raw) : []; // 방어코드 , 22일 성중 수정

            // 같은 유저 + 같은 차량 제거
            const filtered = prev.filter(
                (item) =>
                !(
                    item.userid === userid &&
                    item.carId === selectedCar.carId
                )
            );

            const newRecentView = {
                id: `${Date.now()}_${userid}`,
                userid: userid,
                carId: selectedCar.carId,
                model: selectedCar.model,
                carImg: selectedCar.carImg,
                brand: selectedCar.brand,
                brandLogo: selectedCar.brandLogo,
                fuelType: selectedCar.fuelType,
                viewDate: new Date().toISOString().slice(0, 10),
            };

        const updated = [newRecentView, ...filtered];

        localStorage.setItem("recentView", JSON.stringify(updated));
    }, [selectedCar?.id, userid]);

    // true인 옵션만 필터링
    const getActiveOptions = (car) => {
        const optionsMap = {
            navigation: { name: '내비게이션', icon: 'bi-map' },
            rearCamera: { name: '후방카메라', icon: 'bi-webcam-fill' },
            heatSeat: { name: '열선시트', icon: 'bi-thermometer-sun' },
            heatHandle: { name: '핸들열선', icon: 'bi-sun' },
            bluetooth: { name: '블루투스', icon: 'bi-bluetooth' },
            smartKey: { name: '스마트키', icon: 'bi-key-fill' },
            sunRoof: { name: '썬루프', icon: 'bi-brightness-high' },
            
        };

        // car 객체에서 위 키값이 true인 것들만 배열로 반환
        return Object.keys(optionsMap)
        .filter((key) => Boolean(car[key]))  // 1/true면 true, 0/false/undefined면 false
        .map((key) => optionsMap[key]);
    };

    const activeOptions = getActiveOptions(selectedCar);

    if(!selectedCar) return <div>차량정보를 불러올 수 없습니다.</div>;

    // 가격 계산
    let date = (new Date(`${filterCar.filterEndDate}T${filterCar.filterEndTime}`)-new Date(`${filterCar.filterStartDate}T${filterCar.filterStartTime}`))/ (1000 * 60 * 30);

    //  console.log('기간: ',date);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
    if (!date || !selectedCar || !calculatePrice) return;

    const price = calculatePrice(selectedCar) * date;

    setTotalPrice(price);

    // 새로고침 대비 저장
    localStorage.setItem("totalPrice", JSON.stringify(price));
    }, [date, selectedCar, calculatePrice]);

    // ===================== Reservation으로 값 넘기기 ========================
    const toReservation = () => {
        if (!userid) {
            alert("로그인 후 이용 가능합니다.");
            setModal('login');
            return;
        }

        if(!filterCar){
            alert("예약 정보를 다시 선택해주세요");
            return;
        }
        navigate('/reservation', {
            state : {selectedCarId}
        });
    };

       const SelectedIcon = new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    // 지점명 따기
            const branchName =
              branch.find(
                b => b.branchId === selectedCar.branchId
            )?.location || '';

            const lat =
              branch.find(
                b => b.branchId === selectedCar.branchId
            )?.lat || '';

            const lng =
              branch.find(
                b => b.branchId === selectedCar.branchId
            )?.lng || '';

            const address =
              branch.find(
                b => b.branchId === selectedCar.branchId
            )?.address || '';


    return(
        <div className="DetailPage">
            {/* 좌측 - 상세 전체 */}
            <div className="detailContent">
                {/* 홈 > 예약 */}
                <div className="D_Head">
                    <Link to={'/'}><span>홈</span></Link>
                    <i className="bi bi-caret-right-fill"></i>
                    <span>예약하기</span>
                </div>
                {/* 이미지, 차이름 등 */}
                <div className="D_imgInfo">
                    <div className="D_carImg">
                        <img src={`/images/cars/${selectedCar.carImg}`} alt={`${selectedCar.brand} ${selectedCar.model}`} />
                    </div>
                    <p><img src={`/images/brands/${selectedCar.brandLogo}`} alt={`${selectedCar.brand}`} /> {selectedCar.brand}</p>
                    <h4>{selectedCar.model} {selectedCar.fuelType}</h4>
                    <h5>{selectedCar.plateNumber}</h5>
                </div>

                <hr />

                {/* 차량정보 */}
                <div className="D_carInfo">
                    <h4>차량 정보</h4>
                    {/* 기본정보 */}
                    <ul className="basic_info_list">
                        <li><strong>{selectedCar.fuelType}</strong>로 움직이는 차량이에요.
                            <i className="bi bi-fuel-pump-fill"></i>
                        </li>
                        <li><strong>{selectedCar.modelYear}</strong>년식 이에요.
                            <i className="bi bi-car-front-fill"></i>
                        </li>
                        <li><strong>{selectedCar.seats}인승</strong>이에요.
                            <i className="bi bi-people-fill"></i>
                        </li>
                        <li>연비는 <strong>{selectedCar.kmPer}</strong>이에요.
                            <i className="bi bi-ev-front-fill"></i>
                        </li>
                        <li><strong>{selectedCar.licenseType}종 보통</strong>부터 이용 가능해요.
                            <i className="bi bi-person-fill-up"></i>
                        </li>
                        <li><strong>만 {selectedCar.driverMinAge}세 이상</strong> 이용 가능해요.
                            <i className="bi bi-person-vcard"></i>
                        </li>
                    </ul>
                    {/* 옵션 */}
                    <hr/>
                    <div className="option_list">
                        <h4>옵션</h4>
                        <ul className="option_list">
                        {activeOptions.length > 0 ? (
                            activeOptions.map((opt, index) => (
                                <li key={index}>
                                    <i className={`bi ${opt.icon}`}></i>
                                    <span>{opt.name}</span>
                                </li>
                            ))
                        ) : (
                            <li>포함된 옵션이 없습니다.</li>
                        )}
                    </ul>
                    </div>
                </div>

                <hr />

                {/* 요금안내 */}
                <div className="D_priceInfo">
                    <h4>요금안내</h4>
                    <p>차량의 기본 대여 금액과 보험 금액은 차량 브랜드별로 가치를 가지며,</p>
                    <p>차량의 연식, 차량 크기, 연료, 옵션 유무에 따라 가격이 계산됩니다.</p>
                    <br/>
                    <Link to={'/guide/pricing'}>상세보기 <i className="bi bi-arrow-right-circle-fill"></i></Link>
                </div>

                <hr />
                
                {/* 지도 */}
                <div className="D_location">
                    <h4>대여 및 반납 장소</h4>
                    <MapContainer
                        key={`${lat}-${lng}`}    
                        center={[lat, lng]}
                        zoom={15}
                        style={{ height: "300px", width: "300px" }}
                    >
                        <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                        />
                        {/* positions 배열을 map으로 돌면서 여러 Marker 렌더링 */}
                        {branch.map((spot) => (
                        <Marker key={spot.branchId} position={[spot.lat, spot.lng]}
                        icon={SelectedIcon}
                        >
                            <Popup>{spot.name}</Popup>
                        </Marker>
                        ))}
                    </MapContainer>
                    <h5>{branchName}</h5>
                    <hr className="D_line"/>
                    <p className="D_detial_address_title">주소</p>
                    <span className="D_detial_address">{address}</span>
                    
                    <hr className="D_line"/>
                    {/* 반납규정 */}
                    <div className="D_rentalPolicy">
                        <strong>대여 및 반납 규정</strong>
                        <p>· 대여 및 반납은 지점별 이용 가능한 시간 내 가능해요.</p>
                        <p>· 예약자(제 1운전자) 뿐 아니라 사전에 등록된 제 2운전자와 제 3운전자도 대여 및 반납이 가능해요.</p>
                        <p>· 차량 대여 시, 운전면허 지참은 필수세요. (도로교통법상 유효한 운전면허 소지자)</p>
                    </div>
                </div>

                {/* 유의사항 */}
                <div className="D_usageNotice">
                    <div className="D_notice">
                        <strong><i className="bi bi-exclamation-circle-fill"></i> 유의사항</strong>
                        <p>· 이미지와 실제 차량은 사양, 색상이 다를 수 있어요.</p>
                        <p>· 100% 금연차량으로 운영하고 있어요.</p>
                        <p>· 반려동물은 같이 탈 수 없어요.</p>
                        <p>· 낚시용품을 실을 수 없어요.</p>
                        <p>· 반납 시 남은 대여시간이 6시간 미만이면 환불을 받을 수 없어요.</p>
                    </div>
                    <hr />
                    <div className="D_covid_notice">
                        <strong><i className="bi bi-exclamation-circle-fill"></i> COVID-19 방역 안내</strong>
                        <p>차랑차랑은 COVID-19 감염 예방을 위해 전 직원 마스크 착용 의무화 및 전 차량을 소독하고 있습니다.</p>
                    </div>
                </div>
            </div>

            {/* 우측 - 요약 및 예약하기 버튼 */}
            <div className="detailSummary">
                <div className="summary_card">
                    <h5>예약 정보</h5>
                    {/* filteredInfoUser가 배열일 경우 map으로 돌리고, 단일 객체면 바로 출력 */}
                    {filterCar && [filterCar].map((info, idx) => (
                        <div key={idx} className="info_box">
                            <div className="info_item">
                                <p className="label">지점</p>
                                <h4 className="val">{branchName}</h4>
                            </div>
                            <hr />
                            <div className="info_item">
                                <p className="label">일정</p>
                                <h4 className="val">{DeleteYear(info.filterStartDate)}({startdayText}) {info.filterStartTime} ~ {DeleteYear(info.filterEndDate)}({enddayText}) {info.filterEndTime}</h4>
                            </div>
                        </div>
                    ))}

                    <hr />

                    <div className="price_total">
                        <p>총&nbsp;&nbsp;<strong>{totalPrice.toLocaleString()}</strong>&nbsp;원</p>
                        <span>(보험금 별도)</span>
                    </div>
                    <button className="reserve_btn"
                    // onClick={addBookInfo}
                    onClick={toReservation}
                    >예약하기
                    </button>
                </div>
            </div>
        </div>
    )
}