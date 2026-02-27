import { useState, useContext, useMemo, useEffect, useRef } from "react";
import { CalendarContext } from "../contexts/Calendarcontext";
import { BookingContext } from "../contexts/Bookingcontext";
import { DataContext } from "../contexts/Datacontext";
import { useNavigate, useLocation } from "react-router-dom";
import Calendar from './Calendar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './Searchcarlist.css';
import 'leaflet/dist/leaflet.css';

// ================= 1. 상수 데이터 분리 (설정값) =================
// Leaflet 아이콘 객체 (외부로 분리하여 불필요한 재생성 방지)
const SelectedIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

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
        setStartDate, setEndDate,
        setIsLocation, setIsCalendar, isLocation, isCalendar,
        startdayText, enddayText, DeleteYear, timeAMPM
    } = useContext(CalendarContext);

    const { fetchBookedList, calculatePrice } = useContext(BookingContext);
    const { branch } = useContext(DataContext);

    // ================= 3. State (필요한 상태만 남김) =================
    const [selectedFilters, setSelectedFilters] = useState({
        carSize: [],
        fuelType: [],
        brand: [],
        option: []
    });
    useEffect(() => {
        fetchBookedList();
    }, []);
    // const [isDetail, setIsDetail] = useState(null); // 지점 상세 보기 ID)))))))))))))))))))))))))))))))))))))
    const [tdOpen, setTdOpen] = useState(false); // 더보기 버튼

    // ================= 4. Logic: Derived State (useMemo 사용) =================
    // 4-1. 필터링 로직 (useEffect 제거, firstFilteredCar 변경 시 즉시 재계산)
    // => 화면 랜더링용 마지막 필터 적용 배열이며, 그룹화해서 랜더링 진행됨
    const secondFilteredCar = useMemo(() => {
        let cars = firstFilteredCar;
        // console.log('firstFilteredCar(cars), ', cars);
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
        setIsCalendar(false);
        setIsLocation(false);
        setLocation("");
        setBranchId("");
        setStartDate(null);
        setEndDate(null);
        resetFilters();
        alert("검색 조건이 초기화되었습니다.");
        sessionStorage.removeItem("calendarFilters");
        sessionStorage.removeItem("filteredInfoUser");
        sessionStorage.removeItem("firstFilteredCar");
        // navigate는 필요 시 여기서 호출 (현재 로직상 불필요해 보임)
    };

    const goToDetail = (carId) => {
        // 로그인 필요 위치 DetailPage로 조정 26.02.21
        if (!location || !endTime) {
            alert("날짜와 지점을 먼저 선택해주세요.");
            return;
        }
        // console.log("선택차량 아이디 : ", carId);
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
    const CloseHandler = () => {
        setIsCalendar(false);
        setIsLocation(false);
    }
    // const detailCloseHandler = () => {
    //     if (isDetail) setIsDetail(false);
    //     else setIsLocation(false);
    // };

    // 현재 선택된 지점 정보
    // const detailSpot = branch.find(item => item.branchId === isDetail);
    // -----------------------------------------------------------------
    // 지점 상세보기 모달
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const detail = branch.find(
        item => item.branchId === selectedBranchId
    );

    let detail_lat = detail?.lat;
    let detail_lng = detail?.lng;

    // 상세보기 close 버튼 핸들러함수
    const detailCloseHandler = (e) => {
        e.stopPropagation();
        setIsDetailOpen(false);
    };

    // 모달 바깥쪽 클릭 시 모달 자동 닫히기
    const calendarRef = useRef(null);
    const locationRef = useRef(null);

    useEffect(() => {
        if (!isLocation) return;

        const handleClickOutside = (e) => {
        if (
            locationRef.current &&
            !locationRef.current.contains(e.target)
        ) {
            if (isDetailOpen) {
            setIsDetailOpen(false);
            }
            setIsLocation(false);
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isLocation, isDetailOpen]);

    useEffect(() => {
        if (!isCalendar) return;
        const handleClickOutside = (e) => {
        if (calendarRef.current && !calendarRef.current.contains(e.target)) {
            setIsCalendar(false);
        }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        }

    }, [isCalendar])
    // -----------------------------------------------------------------

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
                    <div className="R_spotTable" style={{ cursor: 'pointer' }} ref={locationRef}>
                        <div className="spot_choice">
                            <div className="R_spotTitle" onClick={locationHandler}>
                                <p className="R_reservation_p">어디서 출발할까요?</p>
                                {location ? <h4>{location}</h4> : <h4>지점선택</h4>}
                            </div>
                        </div>
                        {/* 지점 모달 파트 */}
                        {isLocation && (
                            <div className="R_location">
                            <div className="R_close01">
                                <i
                                className="bi bi-x-lg"
                                onClick={(e) => {
                                    e.stopPropagation();

                                    if (isDetailOpen) {
                                    setIsDetailOpen(false);
                                    } else {
                                    setIsLocation(false);
                                    }
                                }}
                                />
                            </div>
                            {/* 상세 위치 (지도.) */}
                            {isDetailOpen ? (
                                <>
                                <div className="R_selectLocation_detail">

                                    <MapContainer center={[detail_lat, detail_lng]} zoom={20} style={{ height: "300px", width: "394px" }}>
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
                                    <h5>{detail.name}</h5>
                                    <p className="R_detial_address_title">주소</p>
                                    <span className="R_detial_address">{detail.address}</span>
                                </div>

                                </>
                            ) : (
                                // 지점 목록 
                                <>
                                <h3>지점을 선택하세요</h3>
                                <div className="R_selectLocation">
                                    <span>서울</span>
                                    <div className="R_seoul">
                                    <div className="R_gu">
                                        <div className="R_Click">
                                        <p
                                            onClick={() => {
                                            setLocation("서울북부");
                                            setBranchId(5);
                                            setIsLocation(false);
                                            }}
                                        >
                                            서울 북부 <span>노원구</span>
                                        </p>
                                        </div>
                                        <button className="R_detail"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedBranchId(5);
                                            setIsDetailOpen(true);
                                        }}>상세</button>
                                    </div>

                                    <div className="R_gu">
                                        <div className="R_Click">
                                        <p
                                            onClick={() => {
                                            setLocation("서울남부");
                                            setBranchId(4);
                                            setIsLocation(false);
                                            }}
                                        >
                                            서울 남부 <span>서초구</span>
                                        </p>
                                        </div>
                                        <button className="R_detail"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedBranchId(4);
                                            setIsDetailOpen(true);
                                        }}>상세</button>
                                    </div>

                                    <div className="R_gu">
                                        <div className="R_Click">
                                        <p
                                            onClick={() => {
                                            setLocation("서울동부");
                                            setBranchId(3);
                                            setIsLocation(false);
                                            }}
                                        >
                                            서울 동부 <span>동대문구</span>
                                        </p>
                                        </div>
                                        <button className="R_detail"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedBranchId(3);
                                            setIsDetailOpen(true);
                                        }}>상세</button>
                                    </div>
                                    </div>

                                    <span>김포</span>
                                    <div className="R_gimpo">
                                    <div className="R_gu">
                                        <div className="R_Click">
                                        <p
                                            onClick={() => {
                                            setLocation("김포공항");
                                            setBranchId(2);
                                            setIsLocation(false);
                                            }}
                                        >
                                            김포공항 <span>강서구</span>
                                        </p>
                                        </div>
                                        <button className="R_detail"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedBranchId(2);
                                            setIsDetailOpen(true);
                                        }}>상세</button>
                                    </div>
                                    </div>

                                    <span>인천</span>
                                    <div className="R_gu">
                                    <div className="R_Click">
                                        <p
                                        onClick={() => {
                                            setLocation("인천공항");
                                            setBranchId(1);
                                            setIsLocation(false);
                                        }}
                                        >
                                        인천공항 <span>인천</span>
                                        </p>
                                    </div>
                                    <button className="R_detail"
                                        onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedBranchId(1);
                                        setIsDetailOpen(true);
                                        }}>상세</button>
                                    </div>
                                </div>
                                </>
                            )}
                            </div>
                        )}

                    </div>
                    {/* 날짜 선택 */}
                    <div className="R_dateTable" style={{ cursor: 'pointer' }}  ref={calendarRef}>
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
                        {/* 달력 모달 */}
                        {isCalendar && (
                            <div className="R_calendar-slide open">
                                <div className="R_isCalendar_top">
                                    <div className="R_close02">
                                        <i className="bi bi-x-lg" onClick={() => setIsCalendar(false)}></i>
                                    </div>
                                </div>
                                <Calendar />
                            </div>
                        )}
                    </div>
                </div>

               

                

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
                <p>총 &nbsp;<strong>{selectedModel ? secondFilteredCar.length : secondFilteredCar.length}</strong>&nbsp; 종</p>

                <ul className={`GrounpedCarsWrap ${tdOpen ? 'open' : ''}`}>
                    {renderCarList()}
                </ul>
                {secondFilteredCar.length == 0?(<></>):(<button className="tableOpener" onClick={() => setTdOpen(!tdOpen)}>
                    {tdOpen ? '접기' : '더보기'}
                </button>)}
                
            </div>
        </div>
    );
}