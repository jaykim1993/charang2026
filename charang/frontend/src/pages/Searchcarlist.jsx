import { useState, useContext, useMemo } from "react";
// import { DataContext } from "../contexts/Datacontext"; // 안쓰면 제거
import { CalendarContext } from "../contexts/Calendarcontext";
import { AuthContext } from "../contexts/Authcontext";
import { BookingContext } from "../contexts/Bookingcontext";
import { useNavigate, useLocation } from "react-router-dom";
import Calendar from './Calendar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './Searchcarlist.css';

// ================= 1. 상수 데이터 분리 (설정값) =================
// Leaflet 아이콘 객체 (외부로 분리하여 불필요한 재생성 방지)
const SelectedIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// 지점 좌표 데이터
const BRANCH_LOCATIONS = [
    {id:1, lat: 37.446842, lng: 126.454047, name: "인천공항점", address: "인천광역시 중구 공항로 271", region: "인천", gu: "중구"},
    {id:2, lat: 37.56517, lng: 126.803013, name: "김포공항점", address: "서울특별시 강서구 하늘길 38", region: "김포", gu: "강서구"},
    {id:3, lat: 37.570097, lng: 127.064886, name: "서울동부점", address: "서울 동대문구 한천로 100 1-2층", region: "서울", gu: "동대문구"},
    {id:4, lat: 37.493788, lng: 127.012596, name: "서울남부점", address: "서울특별시 서초구 서초대로 283", region: "서울", gu: "서초구"},
    {id:5, lat: 37.653579, lng: 127.058793, name: "서울북부점", address: "서울 노원구 노해로 456 동방빌딩 1층", region: "서울", gu: "노원구"},
];

// 필터 옵션 데이터
const FILTER_CONFIG = {
    carSize: ['경소형', '중형', '대형'],
    fuelType: ['하이브리드', '경유', '휘발유'],
    brands: [
        { name: '쉐레보', img: 'CHEVROLET.png', category: '국산' },
        { name: '제네러스', img: 'GENESIS.png', category: '국산' },
        { name: '한대', img: 'HYUNDAI.png', category: '국산' },
        { name: 'KGB', img: 'KGM.png', category: '국산' },
        { name: '크아', img: 'KIA.png', category: '국산' },
        { name: '라노', img: 'RENAULT-KOREA.png', category: '국산' },
        { name: '아우디즈', img: 'AUDI.png', category: '수입' },
        { name: '빈츠', img: 'BENZ.png', category: '수입' },
        { name: 'BMW', img: 'BMW.png', category: '수입' },
        { name: 'BYD', img: 'BYD.png', category: '수입' },
        { name: '푸도', img: 'FORD.png', category: '수입' },
        { name: '렉사드', img: 'LEXUS.png', category: '수입' },
        { name: '테셀라', img: 'TESLA.png', category: '수입' },
        { name: '토유', img: 'TOYATA.png', category: '수입' },
        { name: '복스바그', img: 'VOLKSWAGEN.png', category: '수입' },
        { name: '볼바즈', img: 'VOLVO.png', category: '수입' },
    ],
    options: [
        { key: 'navigation', label: '내비게이션' },
        { key: 'rearCamera', label: '후방카메라' },
        { key: 'heatedSeat', label: '열선시트' },
        { key: 'heatedHandle', label: '핸들열선' },
        { key: 'bluetooth', label: '블루투스' },
        { key: 'smartKey', label: '스마트키' },
        { key: 'sunLoof', label: '썬루프' }, // DB 컬럼명 주의
    ]
};

export default function Recentcar() {
    // ================= 2. Context & Hooks =================
    const navigate = useNavigate();
    const { state } = useLocation();
    const selectedModel = state?.model; // 메인에서 모델 선택해서 넘어온 경우

    const { 
        firstFilteredCar, setLocation, setBranchId, location, 
        startDate, endDate, startTime, endTime, 
        setStartDate, setEndDate, setApply, 
        setIsLocation, setIsCalendar, isLocation, isCalendar, 
        startdayText, enddayText, DeleteYear, timeAMPM 
    } = useContext(CalendarContext);

    const { calculatePrice } = useContext(BookingContext);


    // ================= 3. State (필요한 상태만 남김) =================
    const [selectedFilters, setSelectedFilters] = useState({
        carSize: [],
        fuelType: [],
        brand: [],
        option: []
    });

    const [isDetail, setIsDetail] = useState(null); // 지점 상세 보기 ID
    const [tdOpen, setTdOpen] = useState(false); // 더보기 버튼

    // ================= 4. Logic: Derived State (useMemo 사용) =================
    // 4-1. 필터링 로직 (useEffect 제거, firstFilteredCar 변경 시 즉시 재계산)
    // => 화면 랜더링용 마지막 필터 적용 배열이며, 그룹화해서 랜더링 진행됨
    const secondFilteredCar = useMemo(() => {
        let cars = firstFilteredCar;

        // 메인페이지에서 모델을 선택해서 들어온 경우
        if (selectedModel) {
            cars = cars.filter(car => car.model === selectedModel);
        }

        // 상세 필터 적용
        return cars.filter(car => {
            const { carSize, fuelType, brand, option } = selectedFilters;

            if (carSize.length > 0 && !carSize.includes(car.carSize)) return false;
            if (fuelType.length > 0 && !fuelType.includes(car.fuelType)) return false;
            if (brand.length > 0 && !brand.includes(car.brand)) return false;

            // 옵션은 AND 조건 (모두 포함되어야 함)
            if (option.length > 0) {
                // FILTER_CONFIG에서 label과 매칭되는 key(DB컬럼명)를 찾아서 검사
                const optionKeys = option.map(optLabel => 
                    FILTER_CONFIG.options.find(o => o.label === optLabel)?.key
                );
                // 하나라도 false면 탈락
                for (let key of optionKeys) {
                    if (key && !car[key]) return false;
                }
            }
            return true;
        });
    }, [firstFilteredCar, selectedModel, selectedFilters]);

    // 4-2. 그룹화 로직 (secondFilteredCar 변경 시 즉시 재계산)
    const groupedCars = useMemo(() => {
        const groups = {};
        secondFilteredCar.forEach(car => {
            if (!groups[car.model]) groups[car.model] = [];
            groups[car.model].push(car);
        });
        return groups;
    }, [secondFilteredCar]);

    // 4-3. 총 대여 시간(30분 단위) 계산
    const rentalDuration = useMemo(() => {
        if (!startDate || !endDate || !startTime || !endTime) return 0;
        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);
        return (end - start) / (1000 * 60 * 30);
    }, [startDate, endDate, startTime, endTime]);


    // ================= 5. Event Handlers =================
    const toggleFilter = (category, value) => {
        setSelectedFilters(prev => {
            const current = prev[category];
            const next = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [category]: next };
        });
    };

    const resetFilters = () => {
        setSelectedFilters({ carSize: [], fuelType: [], brand: [], option: [] });
    };

    const handleResetAll = () => {
        setLocation("");
        setBranchId("");
        setStartDate(null);
        setEndDate(null);
        setApply(false);
        resetFilters();
        alert("검색 조건이 초기화되었습니다.");
        // navigate는 필요 시 여기서 호출 (현재 로직상 불필요해 보임)
    };

    const goToDetail = (carId) => {
        // 로그인 필요 위치 DetailPage로 조정 26.02.21
        if (!location || !endTime) {
            alert("날짜와 지점을 먼저 선택해주세요.");
            return;
        }
        console.log(carId);
        navigate(`/detailpage/${carId}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const calendarHandler = () => {
        setIsCalendar(!isCalendar);
        setIsLocation(false);
    };

    const locationHandler = () => {
        setIsCalendar(false);
        setIsLocation(!isLocation);
    };

    const detailCloseHandler = () => {
        if (isDetail) setIsDetail(false);
        else setIsLocation(false);
    };
    
    // 현재 선택된 지점 정보
    const detailSpot = BRANCH_LOCATIONS.find(item => item.id === isDetail);


    // ================= 6. Render Functions =================
    // 상단 선택된 필터 태그 렌더링
    const renderSelectedTags = () => {
        return Object.entries(selectedFilters).flatMap(([category, values]) => 
            values.map(value => (
                <button key={`${category}-${value}`} onClick={() => toggleFilter(category, value)}>
                    {value} <i className="bi bi-x-lg"></i>
                </button>
            ))
        );
    };

    // 차량 목록 렌더링
    const renderCarList = () => {
        const models = Object.keys(groupedCars);
        if (models.length === 0) return <p className="empty_car">선택 가능한 차량이 없습니다.</p>;

        return models.map(modelName => {
            const group = groupedCars[modelName];
            const first = group[0];

            return (
                <li key={modelName} className="grouped_car_item">
                    <div>
                        <img className="brands" src={`images/brands/${first.brandLogo}`} alt={first.brand} />
                        <img className="cars" src={`images/cars/${first.carImg}`} alt={modelName} />
                    </div>
                    <div className="car_list_ul">
                        {group.map((car, index) => {
                            const unitPrice = calculatePrice(car);
                            const totalPrice = unitPrice * rentalDuration;
                            
                            return (
                                <div key={car.carId} 
                                     className={`car_variant_info ${index !== group.length - 1 ? "Line_active" : ""}`}
                                     onClick={() => goToDetail(car.carId)}
                                     style={{ cursor: "pointer" }}>
                                    
                                    <h4>{modelName} {car.fuelType}</h4>
                                    <p className="S_detail">{car.modelYear}년식 · {car.carSize} · {car.carType}</p>
                                    <i className="bi bi-chevron-right"></i>

                                    {rentalDuration > 0 ? (
                                        <div className="car_ee">
                                            <p>{car.location}</p>
                                            <div className="carPrice">
                                                <span className="carPriceTotal">
                                                    총 금액 <strong>{totalPrice.toLocaleString()}</strong>원~
                                                </span>
                                                <span className="carPriceMin">
                                                    (30분당 <strong>{unitPrice.toLocaleString()}</strong>원)
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="carPrice">
                                            <span className="carPriceTotal">
                                                30분당 <strong>{unitPrice.toLocaleString()}</strong>원
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </li>
            );
        });
    };

    // console.log("secondFilteredCar", secondFilteredCar);
    // console.log("firstFilteredCar", firstFilteredCar);

    return (
        <div className="Recentcar">
            {/* 카테고리 필터 섹션 */}
            <div className="R_category">
                <ul>
                    <li>
                        <h3>차종/차량등급</h3>
                        <div className="cateBtn">
                            {FILTER_CONFIG.carSize.map(size => (
                                <button key={size} 
                                    onClick={() => toggleFilter('carSize', size)}
                                    className={selectedFilters.carSize.includes(size) ? 'active' : ''}>
                                    {size}
                                </button>
                            ))}
                        </div>
                    </li>
                    <li>
                        <h3>연료</h3>
                        <div className="cateBtn">
                            {FILTER_CONFIG.fuelType.map(fuel => (
                                <button key={fuel} 
                                    onClick={() => toggleFilter('fuelType', fuel)}
                                    className={selectedFilters.fuelType.includes(fuel) ? 'active' : ''}>
                                    {fuel}
                                </button>
                            ))}
                        </div>
                    </li>
                    <li>
                        <h3>제조사</h3>
                        {/* 국산/수입 구분하여 렌더링 */}
                        {['국산', '수입'].map(cat => (
                            <div key={cat}>
                                <h4>{cat}차</h4>
                                <div className="cateBtn">
                                    {FILTER_CONFIG.brands.filter(b => b.category === cat).map(brand => (
                                        <button key={brand.name} 
                                            onClick={() => toggleFilter('brand', brand.name)}
                                            className={selectedFilters.brand.includes(brand.name) ? 'active' : ''}>
                                            <img src={`images/brands/${brand.img}`} alt={brand.name} />
                                            &nbsp;{brand.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </li>
                    <li>
                        <h3>옵션</h3>
                        <div className="cateBtn">
                            {FILTER_CONFIG.options.map(opt => (
                                <button key={opt.label} 
                                    onClick={() => toggleFilter('option', opt.label)}
                                    className={selectedFilters.option.includes(opt.label) ? 'active' : ''}>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </li>
                </ul>
            </div>

            {/* 목록 및 예약 섹션 */}
            <div className="R_carlist">
                <div className="R_reservation">
                    {/* 지점 선택 */}
                    <div className="R_spotTable">
                        <div className="spot_choice" style={{ cursor: 'pointer' }}>
                            <div className="R_spotTitle" onClick={locationHandler}>
                                <p className="R_reservation_p">어디서 출발할까요?</p>
                                {location ? <h4>{location}</h4> : <h4>지점선택</h4>}
                            </div>
                        </div>
                    </div>
                    {/* 날짜 선택 */}
                    <div className="R_dateTable" style={{ cursor: 'pointer' }}>
                        <div className="R_dateTitle" onClick={calendarHandler}>
                            <p>언제 필요하세요?</p>
                            {startDate && endDate ? (
                                <h4>
                                    {DeleteYear(startDate)} ({startdayText}){timeAMPM(startTime)}
                                    {" ~ "}
                                    {DeleteYear(endDate)} ({enddayText}){timeAMPM(endTime)}
                                </h4>
                            ) : (
                                <h4>날짜선택</h4>
                            )}
                        </div>
                        <div className="searchButton">
                            <button type="submit" onClick={handleResetAll}>
                                초기화 <i className="bi bi-arrow-clockwise"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 지점 모달 */}
                {isLocation && (
                    <div className="R_location">
                        <span className="R_close01" onClick={detailCloseHandler}><i className="bi bi-x-lg"></i></span>
                        {isDetail && detailSpot ? (
                            <div className="R_selectLocation_detail">
                                <MapContainer center={[detailSpot.lat, detailSpot.lng]} zoom={15} style={{ height: "300px", width: "394px" }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OSM' />
                                    {BRANCH_LOCATIONS.map((spot) => (
                                        <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={SelectedIcon}>
                                            <Popup>{spot.name}</Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                                <h5>{detailSpot.name}</h5>
                                <p className="R_detial_address_title">주소</p>
                                <span className="R_detial_address">{detailSpot.address}</span>
                            </div>
                        ) : (
                            <>
                                <h3>지점을 선택하세요</h3>
                                <div className="R_selectLocation">
                                    {/* 지역별 자동 그룹핑 렌더링 예시 (서울, 김포 등) */}
                                    {['서울', '김포', '인천'].map(region => (
                                        <div key={region}>
                                            <span>{region}</span>
                                            <div className={region === '서울' ? 'R_seoul' : 'R_gu'}>
                                                {BRANCH_LOCATIONS.filter(b => b.region === region).map(branch => (
                                                    <div className="R_gu" key={branch.id}>
                                                        <div className="R_Click" onClick={() => setIsLocation(false)}>
                                                            <p onClick={() => { setLocation(branch.name); setBranchId(branch.id); }}>
                                                                {branch.name} <span>{branch.gu}</span>
                                                            </p>
                                                        </div>
                                                        <button className="R_detail" onClick={() => setIsDetail(branch.id)}>상세</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* 달력 모달 */}
                {isCalendar && (
                    <div className={`calendar-slide ${isCalendar ? "open" : ""}`}>
                        <span className="R_close02" onClick={() => setIsCalendar(false)}><i className="bi bi-x-lg"></i></span>
                        <Calendar />
                    </div>
                )}

                {/* 선택된 필터 태그 표시 & 초기화 버튼 */}
                <div className="cate_choice">
                    <div className="cate_Btn">
                        {renderSelectedTags()}
                    </div>
                    {Object.values(selectedFilters).some(arr => arr.length > 0) && (
                        <div className="delBtn">
                            <button onClick={resetFilters}>
                                <i className="bi bi-arrow-clockwise"></i>
                            </button>
                        </div>
                    )}
                </div>

                {/* 차량 리스트 결과 */}
                <p>총 <strong>{selectedModel ? secondFilteredCar.length : secondFilteredCar.length}</strong> 종</p>
                
                <ul className={`GrounpedCarsWrap ${tdOpen ? 'open' : ''}`}>
                    {renderCarList()}
                </ul>
                
                <button className="tableOpener" onClick={() => setTdOpen(!tdOpen)}>
                    {tdOpen ? '접기' : '더보기'}
                </button>
            </div>
        </div>
    );
}