import { useEffect, useState, useRef } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CalendarContext } from "../contexts/Calendarcontext";
import { AuthContext } from "../contexts/Authcontext";
import { BookingContext } from "../contexts/Bookingcontext";
import { DataContext } from "../contexts/Datacontext";
import Calendar from './Calendar';
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// MapContainer = 맵을 불러오는 상자 
// TileLayer 하단 설명 참고
// Marker 마커 좌표 설정시 마커 생성
// Popup 마커 클릭시 텍스트 출력.
import 'leaflet/dist/leaflet.css';

export default function Home() {
  const navigate = useNavigate();
  const { setBranchId, setLocation, location, startDate, endDate, startTime, endTime,
    handleSearchBtn, setIsLocation, setIsCalendar, isLocation, isCalendar, startdayText,
    enddayText, DeleteYear, timeAMPM } = useContext(CalendarContext);
  const { myRecentlist } = useContext(BookingContext);
  const { userid, username } = useContext(AuthContext);
  const { car, branch } = useContext(DataContext);

  const images = [
    { img: "/images/banner/banner01.png", link: "/customerservice/notice/Info/23" },
    { img: "/images/banner/banner02.png", link: "/customerservice/notice/Info/28" },
    { img: "/images/banner/banner03.png", link: "/customerservice/notice/Info/25" },
    { img: "/images/banner/banner04.png", link: "/customerservice/notice/Info/26" },
  ];

  const [index, setIndex] = useState(0);

  const startX = useRef(0);
  const isDragging = useRef(false);
  const currentX = useRef(0);

  // 3초마다 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 드래그 시작
  const handleStart = (clientX) => {
    isDragging.current = true;
    startX.current = clientX;
  };

  // 드래그 이동
  const handleMove = (clientX) => {
    if (!isDragging.current) return;
    currentX.current = clientX - startX.current;
  };

  // 드래그 종료
  const handleEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (currentX.current > 50) {
      setIndex((prev) => (prev - 1 + images.length) % images.length);
    } else if (currentX.current < -50) {
      setIndex((prev) => (prev + 1) % images.length);
    }

    currentX.current = 0;
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
  // 최근 본 차량
  const recentViewList = myRecentlist(userid);

  // 최근 본 차량 5개 컷
  const recentViewListCoopy = [...recentViewList];
  const sec03Sort = recentViewListCoopy.sort((a, b) => b.id - a.id).slice(0, 5);

  // 인기순 | 신규 차량 toggle
  const [isTop, setIsTop] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const topClickHandler = () => {
    setIsTop(!isTop);
    setIsNew(!isNew);
  }

  // 25년도 차량만 => 26년을 가장 빠르게 출력되게 수정
  const newCarList =
    car
      .filter(item => item.modelYear === 2025 || item.modelYear === 2026)
      .reduce((carImgList, nowCarImg) => {
        if (!carImgList.some(img => img.carImg === nowCarImg.carImg)) {
          carImgList.push(nowCarImg)
        }
        return (carImgList);
      }, []);

  // 이전 이후 버튼
  const [before_x, setBefore_x] = useState(0);
  const before_btn = () => {
    if (before_x > 0) {
      setBefore_x(before_x + 1325);
    } else {
      setBefore_x(0);
    }
  }
  const after_btn = () => {
    if (before_x === -14575) {
      setBefore_x(before_x - 505);
    } else if (before_x > -15080) {
      setBefore_x(before_x - 1325);
    } else {
      setBefore_x(0);
    }
  }

  useEffect(() => {
    setBefore_x(0);
  }, [isNew])

  // 해당 차량 브랜드 searchcarlist로 넘기기
  const goToSearchcarlist = (model) => {
    navigate("/searchcarlist", {
      state: { model }
    });
  };

  const homeAD = [
    {
      id: 1,
      title: "저렴한 요금!",
      desc: "4일 요금으로 7일 제공",
      icon: "/images/banner/cardAD.png",
      link: "/guide/pricing",
    },
    {
      id: 2,
      title: "최신식 차량 보유",
      desc: "23–25년식 차량",
      icon: "/images/banner/carAD.png",
      link: "/guide/inventory",
    },
    {
      id: 3,
      title: "수도권 5개 지점",
      desc: "지점별 유기적 네트워킹",
      icon: "/images/banner/locationAD.png",
      link: "/guide/branch",
    },
    {
      id: 4,
      title: "전문 상담 서비스",
      desc: "평일 09:00–18:00 상담 가능",
      icon: "/images/banner/inquiry.png",
      link: "/customerservice/inquiry/list",
    },
  ];


  // 인기순 차량 배열
  const goodCar = [
    { id: 1, model: '그랑조', img: 'hy_2.webp', carTitle: '한대 그랑조', carInfo: '20대도 즐겨 찾는 인기 렌트카, 세련된 디자인과 편안한 주행감을 갖춘 한대 그랑조!', hashtag: `#요즘세단` },
    { id: 2, model: 'dmw new 5', img: 'bmw_5.webp', carTitle: 'dmw new 5', carInfo: '프리미엄 세단. 비즈니스와 일상 모두에 잘 어울리는 모델!', hashtag: '#도심드라이브' },
    { id: 3, model: 'WV7', img: 'kia_2.webp', carTitle: '크아 WV7', carInfo: '넉넉한 실내 공간과 실용성을 강조한 SUV. 가족 이동이나 장거리 주행에 부담 없는 선택!', hashtag: '#여행각SUV' },
  ];

  const SelectedIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });


  return (
    <div className="Home">
      {/* 예약 섹션 */}
      <div className="H_secone">
        <div className="H_reservation">

          <div ref={calendarRef} className="calendar-wrapper">
            <div className={`H_dateTable ${isCalendar ? "open" : ""}`}>
              <p>언제 필요하세요?</p>
              <div className="H_dateTitle" onClick={calendarHandler}>
                {startDate && endDate ? (
                  <p>
                    {DeleteYear(startDate)} ({startdayText}) {timeAMPM(startTime)}
                    {" ~ "}
                    {DeleteYear(endDate)} ({enddayText}) {timeAMPM(endTime)}
                  </p>
                ) : (
                  <p>날짜를 선택하세요</p>
                )}
              </div>
            </div>

            {isCalendar && (
              <div className="calendar-slide open">
                <div className="Home_isCalendar_top">
                  <div className="H_close02">
                    <i className="bi bi-x-lg" onClick={() => setIsCalendar(false)}></i>
                  </div>
                </div>
                <Calendar />
              </div>
            )}
          </div>

          {/* 지점 선택 파트 */}
          <div className="H_spotTable">
            <div ref={locationRef}
              className={`spot_choice ${isLocation ? "open" : ""}`}>

              <p>어디서 출발할까요?</p>
              <div className="H_spotTitle" onClick={locationHandler}>
                {location ? <p>{location}</p>
                  : <p>지점을 선택하세요</p>}
              </div>

              <button
                className="H_searchButton"
                type="submit"
                onClick={() => {
                  handleSearchBtn(navigate);
                  CloseHandler();
                }}
              >
                예약할 차량 찾기&nbsp;
                <i className="bi bi-arrow-right"></i>
              </button>

              {/* 지점 모달 파트 */}
              {isLocation && (
                <div className="H_location">
                  <div className="H_close01">
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
                      <div className="H_selectLocation_detail">

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
                        <p className="H_detial_address_title">주소</p>
                        <span className="H_detial_address">{detail.address}</span>
                      </div>

                    </>
                  ) : (
                    // 지점 목록 
                    <>
                      <h3>지점을 선택하세요</h3>
                      <div className="H_selectLocation">
                        <span>서울</span>
                        <div className="H_seoul">
                          <div className="H_gu">
                            <div className="H_Click">
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
                            <button className="H_detail"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBranchId(5);
                                setIsDetailOpen(true);
                              }}>상세</button>
                          </div>

                          <div className="H_gu">
                            <div className="H_Click">
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
                            <button className="H_detail"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBranchId(4);
                                setIsDetailOpen(true);
                              }}>상세</button>
                          </div>

                          <div className="H_gu">
                            <div className="H_Click">
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
                            <button className="H_detail"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBranchId(3);
                                setIsDetailOpen(true);
                              }}>상세</button>
                          </div>
                        </div>

                        <span>김포</span>
                        <div className="H_gimpo">
                          <div className="H_gu">
                            <div className="H_Click">
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
                            <button className="H_detail"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBranchId(2);
                                setIsDetailOpen(true);
                              }}>상세</button>
                          </div>
                        </div>

                        <span>인천</span>
                        <div className="H_gu">
                          <div className="H_Click">
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
                          <button className="H_detail"
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
          </div>
        </div>
      </div>



      {/* sec01 - 배너 슬라이드 */}
      <div className="H_sec01"
        style={{
          overflow: "hidden",
          width: "100%",
          userSelect: "none",
        }}

        // 마우스 드래그 슬라이드 넘기기
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => {
          if (isDragging.current) {
            e.preventDefault();
            handleMove(e.clientX);
          }
        }}

        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}>

        <div style={{
          display: "flex",
          transition: "transform 0.4s ease",
          transform: `translateX(-${index * 100}%)`,
        }}>

          {images.map((item, i) => (
            <Link to={item.link} key={i} style={{ width: "100%", flexShrink: 0, display: 'block'}}>
              <img src={item.img} alt={`banner0${i+1}`}
                style={{ width: "100%", flexShrink: 0, pointerEvents: "none"}} />
            </Link>
          ))}
        </div>
      </div>

      {/* 광고_1 */}
      <div className="H_section05">
        <h4 className="H_sec04_H">
          쉽고 빠른 차량 렌트 
          <span className="H_sec04_H_span">
            차랑차랑
          </span>
        </h4>


        <ul className="H_sec04_list">
          {homeAD.map((item) => (
            <div to={'/guide'} key={item.id} >
              <Link to={item.link} onClick={() => scrollTo(0, 0)}>
                <li className="H_sec04_card">
                  <div className="H_sec04_imgWrap">
                    <img className="H_sec04_img" src={item.icon} alt={item.title} />
                  </div>
                  <h3 className="H_sec04_h3">{item.title}</h3>
                  <p className="H_sec04_p">{item.desc}</p>
                </li>
              </Link>
            </div>
          ))}
        </ul>
      </div>

      {/* sec - 인기순 */}
      <div className="H_sec_top5">
        <h4>인기순</h4>
        {/* <div className="H_sec_top5_hashtag">
          <span>#인기폭발</span><span>#가성비갑</span><span>#신차</span>
        </div> */}
        <ul className="H_sec_top5_map">
          {goodCar.map((item, index) => (
            <li key={index} onClick={() => { goToSearchcarlist(item.model); scrollTo(0, 0); }}>
              <span className="H_sec_top5_rank">{index + 1}</span>
              <span className="H_sec_top5_sticker">인기차량</span>
              <div className="top5_img">
                <img src={`/images/cars/${item.img}`} alt={item.carTitle} />
              </div>
              <div className="H_good">
                <h5>{item.carTitle}</h5>
                <p className="H_good_p">{item.carInfo}</p>
                <p className="hashtags">{item.hashtag}</p>
              </div>
              <i className="bi bi-arrow-right-circle-fill"></i>
            </li>
          ))}
        </ul>
      </div>

      {/* 신규차량 */}
      <div className="H_sec_new">
        <h4>신규 차량</h4>
        <div className="H_sec_new_map">
          <p onClick={before_btn} className="H_before_btn">〈</p>
          <div className="H_slide">
            <ul style={{ transform: `translateX(${before_x}px)` }}>
              {newCarList && newCarList.map((item) => (
                <li key={item.carId} onClick={() => { goToSearchcarlist(item.model); scrollTo(0, 0) }}>
                  <div className="H_new">
                    {/* <img className="H_new_carLogo" src={`/images/brands/${item.brand_logo}`} alt="car_logo" style={{width:"10px"}}/> */}
                    <div className="H_new_carName">
                      <b className="H_new_Year">{item.modelYear}년 입고</b>
                      <br />
                      <b className="H_new_Name">{item.model}</b>
                    </div>
                    <img src={`/images/cars/${item.carImg}`} alt='carImg' />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p onClick={after_btn} className="H_after_btn">〉</p>
        </div>
      </div>


      {/* 광고_2 */}
      <div className="H_sec_banner_one">
        <img className="H_ad10" src='/images/banner/advertise10.png'></img>
      </div>

      {/* sec - 최근본차량 */}
      {userid &&
        <div className="H_sec_history">
          <div className="H_sec_history_block">
            <h4><span className="joinColorText">{username}</span>님의 최근 본 차량</h4>
            <Link to={'/mypage/recent'} className="H_more">
              <span>더보기</span>
            </Link>
          </div>
          {sec03Sort.length > 0 ?
            <div className="H_sec_history_map">
              {sec03Sort.map(item => (
                <div className="H_recent" key={item.id} onClick={() => { goToSearchcarlist(item.model); scrollTo(0, 0) }}>
                  <img src={`/images/cars/${item.carImg}`} alt={item.model} />
                </div>
              ))}
            </div>
            :
            <>
              <div className="H_sec_noRecentcars">
                <p>최근 본 차량이 없습니다.</p>
                <div>
                  <span>!</span>
                </div>
              </div>
            </>}
        </div>
      }

      {/* 광고 3 배너 */}
      <div className="H_sect_blockBanner">
        <h4>2026 특가 혜택!</h4>
        <div className="H_sec04_advertisementBanner">
          <Link to={'/customerservice/notice/Info/9'}>
            <img src="/images/banner/advertisementBanner01.png" alt="광고배너1" />
          </Link>
          <Link to={'/customerservice/notice/Info/4'}>
            <img src="/images/banner/advertisementBanner02.png" alt="광고배너2" />
          </Link>
          <Link to={'/customerservice/notice/Info/13'}>
            <img src="/images/banner/advertisementBanner03.png" alt="광고배너3" />
          </Link>
          <Link to={'/customerservice/notice/Info/30'}>
            <img src="/images/banner/advertisementBanner04.png" alt="광고배너4" />
          </Link>
          <Link to={'/customerservice/notice/Info/5'}>
            <img src="/images/banner/advertisementBanner05.png" alt="광고배너5" />
          </Link>
        </div>
      </div>
    </div>
  )
}