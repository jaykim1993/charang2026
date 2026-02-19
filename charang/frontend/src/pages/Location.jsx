import { Link } from "react-router-dom"
import { useContext } from "react"
import { DataContext } from "../contexts/Datacontext"
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import L from 'leaflet';
import './Location.css'
import { AuthContext } from "../contexts/Authcontext"; // 미로그인 시 방어코드 12.22 - 성중 - 성중

//===================================================================================
export default function LocationPage(){
// 클릭 시 지도 이동 + 줌 확대 커스텀 훅
function MoveMapOnClick({ position, zoom }) {
  const map = useMap();
  map.flyTo(position, zoom, { duration: 1.0 });
  return null;
}

const NoneSelectIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const SelectedIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const [selectedId, setSelectedId] = useState(null);
const [mapAction, setMapAction] = useState(null); // 클릭한 마커 위치와 줌
const defaultZoom = 10;
const {positions, cars}=useContext(DataContext)

//마커 클릭시 해당 마커 id번호로 state값 변하게
const [locationDetail,setLocationDetail]=useState(null);
const seeloca =(spotId)=>{
    setLocationDetail(spotId)
}
const handleSelectSpot = (spot) => {
  setSelectedId(spot.id);
  setLocationDetail(spot.id);
  setMapAction({
    position: [spot.lat, spot.lng],
    zoom: defaultZoom + 5,
  });
};


const makeMap =  <MapContainer
                center={[37.56517, 126.773023]}
                zoom={defaultZoom}
                style={{ height: '400px', width: '900px' }}
                minZoom={8}
                >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {positions.map((spot) => (
               <Marker
                    key={spot.id}
                    position={[spot.lat, spot.lng]}
                    icon={selectedId === spot.id ? SelectedIcon : NoneSelectIcon}
                    eventHandlers={{
                        click: () => handleSelectSpot(spot),
                    }}
                    >
                    <Popup offset={[0, -40]}>{spot.name}</Popup>
                    </Marker>
            ))}
            {/* 클릭 이벤트가 발생하면 지도 이동 + 줌 적용 */}
            {mapAction && <MoveMapOnClick position={mapAction.position} zoom={mapAction.zoom} />}
            </MapContainer>
//===================================================================================

const [pageShow,setpageShow]=useState(1) //보여주는 페이지 기본 1
const location1Page =()=>{
    setpageShow(1)
}
const location2Page =()=>{
    setpageShow(2)
}
const location3Page =()=>{
    setpageShow(3)
}
//
const selectedSpot = positions.find((p) => p.id === locationDetail);

//====================================================================================

navigator.geolocation.getCurrentPosition(
  (pos) => {
    const mylat = pos.coords.latitude;
    const mylng = pos.coords.longitude;
    console.log('내 위치:', mylat, mylng);
  },
  (err) => {
    console.error('위치 오류', err);
  }
);

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function findNearestSpot(myLat, myLng, positions) {
  let nearest = null;
  let minDist = Infinity;

  positions.forEach((spot) => {
    const dist = getDistance(myLat, myLng, spot.lat, spot.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = spot;
    }
  });

  return nearest;
}
const findMyNearest = () => {
  if (!positions || positions.length === 0) return;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const myLat = pos.coords.latitude;
      const myLng = pos.coords.longitude;

      const nearest = findNearestSpot(myLat, myLng, positions);
      if (!nearest) return;

      //연결
      setSelectedId(nearest.id);
      setLocationDetail(nearest.id);
      setMapAction({
        position: [nearest.lat, nearest.lng],
        zoom: defaultZoom + 5,
      });
    },
    () => {
      alert('위치 권한을 허용해주세요');
    }
  );
};


const [locaisOpen, setLocaIsOpen] = useState(false);
const [locaselected, setLocaSelected] = useState('지점을 선택해주세요');

const carCopy = [...cars]
const filteredCars = locaselected === '지점을 선택해주세요'
  ? carCopy
  : carCopy.filter(item => item.location === locaselected);


//============================================================================================
// 미로그인 시 방어코드 12.22 - 성중 - 성중
const { userid, loginNeeded } = useContext(AuthContext);
const [tdOpen, setTdOpen] = useState(false);
return(
        <>
            <div className="guideWrap">
                <div className="guideTop">
                    {/* 수정 필요 */}
                    <div><Link to={'/'} className="guideGoToHome">홈</Link></div>
                    <span><i className="bi bi-caret-right-fill"></i></span>
                    <div>지점안내/정비</div>
                </div>
                <div className="guideFlex">
                    <div className="guideLeft">
                        {/* <h2 className="guideSideText">지점 및 차량정비 안내</h2> */}
                        <span className={`guideSideMenus ${pageShow===1? 'active':''}`} onClick={location1Page} >지점/정비소</span>
                        <span className={`guideSideMenus ${pageShow===2?'active':''}`} onClick={location2Page} >차량보유현황</span>
                        <span className={`guideSideMenus ${pageShow===3?'active':''}`} onClick={location3Page} >차량반납안내</span>
                    </div>
                    <div className="guideRight">
                        {/* <h1 className="guideMainText">지점 및 차량정비 안내</h1> */}
                        <div className="guideSelectBar">
                            <button className={`guideSelectButns ${pageShow===1? 'active':''}`} onClick={location1Page}>지점/정비소</button>
                            <button className={`guideSelectButns ${pageShow===2? 'active':''}`} onClick={location2Page}>차량보유현황</button>
                            <button className={`guideSelectButns ${pageShow===3? 'active':''}`} onClick={location3Page}>차량반납안내</button>
                        </div>
                        {pageShow===1?
                        <div>
                            
                           <div className="LocationupBtnBox">
                            {positions.map((spot) => (
                                <button
                                    key={spot.id}
                                    onClick={() => handleSelectSpot(spot)}
                                    className={`LocationupBtn ${selectedId === spot.id ? 'active' : ''}`}
                                    >
                                    {spot.name}
                                    </button>
                            ))}
                            </div>
                            
                        <div className="maprenderbox">
                            <div className="ndo">
                                <button onClick={findMyNearest} className="findNearestBtn">
                                    <i className="bi bi-person-walking"></i>
                                </button>
                           {makeMap}</div>  </div>
                        {selectedSpot && (
                                <div className="locationDetailBox">
                                    <h2 className="LocationSpotName">{selectedSpot.name}</h2>
                                    <h3 className="LocationSpotArea">{selectedSpot.location}</h3>
                                    <h3 className="LocationSpotDetail">{selectedSpot.location_detail}</h3>
                                    <h3 className="LocationSpotTel">Tel : {selectedSpot.tel}</h3>
                                </div>
                        )}
                        <div className="HowComeWrap">
                            {locationDetail===1?
                            <div>
                                <h3 className="LocationHowCome">오시는 길</h3>
                                <ul className="LocationHowComeBox">
                                    <li className="LocationRideType">
                                        <p className="ekek">자가용 이용 시</p>
                                            <ul className="LocationUl">
                                                <li>인천공항고속도로 → 영종도 방면 진입</li>
                                                <li>영종대교 통과 후 공항신도시(운서동) 방향으로 진입</li>
                                                <li>공항대로에서 BMW 드라이빙센터·파라다이스시티 방면 우회전</li>
                                                <hr/>
                                            </ul>
                                    </li>
                                    <li className="LocationRideType">
                                        <p className="ekek">대중교통 이용 시</p>
                                            <ul className="LocationUl">
                                                <li>공항철도 이용 / 인천공항 1터미널역 하차</li>
                                                <li>2번·13번 출구 방향 버스정류장에서 영종도 또는 용유도 방면 버스 환승</li>
                                                <li>하차 후 도보 약 5~10분<br/><br/></li>
                                                <li>버스 이용 / 가까운 정류장 : 공항신도시입구 , 용유119안전센터</li>
                                                <li>주요 버스 : 302 / 306 / 307 / 영종도 순환버스(지역 버스)</li>
                                            </ul>
                                    </li>
                                </ul>
                            </div>
                            :
                            locationDetail===2?
                               <div>
                                <h3 className="LocationHowCome">오시는 길</h3>
                                <ul  className="LocationHowComeBox">
                                    <li className="LocationRideType">
                                        <p className="ekek">자가용 이용 시</p>
                                        <ul className="LocationUl">
                                            <li>올림픽대로 → 공항대로 진입</li>
                                            <li>김포공항 주변 방화대로·공항대로에서 진입</li>
                                            <hr/>
                                        </ul>
                                    </li>
                                    <li className="LocationRideType">
                                        <p className="ekek">대중교통 이용 시</p>
                                        <ul className="LocationUl">
                                            <li>지하철 이용 / 공항철도 / 5호선 / 9호선 → 김포공항역 하차</li>
                                            <li>역에서 도보 이동 가능 (김포공항 정류장까지 약 5~10분)<br/><br/></li>
                                            <li>버스 이용 / 가까운 정류장 : 김포공항국내선 , 김포공항국제선</li>
                                            <li>주요 버스 : 601 / 605 / 651 / 6629 / 6632 / 6641 / 6712 / 3 / 12 / 22 / 50 / 66 / 78</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            :
                            locationDetail===3?
                               <div>
                                <h3 className="LocationHowCome">오시는 길</h3>
                                <ul  className="LocationHowComeBox">
                                    <li className="LocationRideType">
                                        <p className="ekek">자가용 이용 시</p>
                                        <ul className="LocationUl">
                                            <li>천호대로(장한평역 방면) → 장한평역 사거리 진입</li>
                                            <li>장한평역 근처 골목으로 진입 후 목적지 도착</li>
                                            <hr/>
                                        </ul>
                                    </li>
                                    <li className="LocationRideType">
                                        <p className="ekek">대중교통 이용 시</p>
                                        <ul className="LocationUl">
                                            <li>지하철 이용 / 5호선 → 장한평역 하차 / 2호선 → 용두역 / 신답역 하차</li>
                                            <li>역에서 도보 이동 가능 (10분)<br/><br/></li>
                                            <li>버스 이용 / 가까운 정류장 : 장한평역 , 장한평역사거리 , 동대문우체국앞</li>
                                            <li>주요 버스 : 1212 / 2233 / 201 / 202 / 241 / 240 / 145</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            :
                            locationDetail===4?
                               <div>
                                <h3 className="LocationHowCome">오시는 길</h3>
                                <ul  className="LocationHowComeBox">
                                    <li className="LocationRideType">
                                        <p className="ekek">자가용 이용 시</p>
                                        <ul className="LocationUl">
                                            <li>서초대로(교대역·서초역 방면) 진입</li>
                                            <li>교대역 사거리 또는 서초역 사거리에서 서초대로 옆길로 진입</li>
                                            <hr/>
                                        </ul>
                                    </li>
                                    <li className="LocationRideType">
                                        <p className="ekek">대중교통 이용 시</p>
                                        <ul className="LocationUl">
                                            <li>지하철 이용 / 2호선 / 3호선 → 교대역 하차</li>
                                            <li>5번·6번 출구 이용 시 도보 5~8분<br/><br/></li>
                                            <li>버스 이용 / 가까운 정류장 : 교대역.법원.검찰청 , 서초역 , 서초역.서초3동주민센터</li>
                                            <li>주요 버스 : 405 / 740 / 421 / 5413 / 9101 / 1551 / 서초03</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            :
                            locationDetail===5?
                               <div>
                                <h3 className="LocationHowCome">오시는 길</h3>
                                <ul  className="LocationHowComeBox">
                                    <li className="LocationRideType">
                                        <p className="ekek">자가용 이용 시</p>
                                        <ul className="LocationUl">
                                            <li>동부간선도로 또는 동일로 → 하계역·중계역 방면으로 이동</li>
                                            <li>동일로(하계역 사거리)에서 골목으로 진입하면 바로 도착</li>
                                            <hr/>
                                        </ul>
                                    </li>
                                    <li className="LocationRideType">
                                        <p className="ekek">대중교통 이용 시</p>
                                        <ul className="LocationUl">
                                            <li>지하철 이용 / 7호선 → 하계역 하차</li>
                                            <li>3번·4번 출구 이용 시 도보 5–7분<br/><br/></li>
                                            <li>버스 이용 / 가까운 정류장 : 하계역 , 하계역사거리 , 중계2·3동 주민센터</li>
                                            <li>주요 버스 : 146 / 1132 / 1120 / 1224 / 1140 / 노원05</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            : 
                            <div className="locationDetailBox">
                                <h2 className="LocationClickMarker">지점 위치를 클릭하여 상세 정보를 확인하세요.</h2>
                            </div>
                            }
                        </div>
                    </div>
                    :  pageShow===2?
                    <div className="LocationPage2">
                        <div className="Locationdropdown">
                            <button className="LocationdropdownBtn" onClick={() => setLocaIsOpen(!locaisOpen)}>
                                {locaselected} <i class="bi bi-chevron-down"></i>
                            </button>
                               <ul className={`LocationdropdownMenu ${locaisOpen ? "open" : ""}`}>
                                    <li className="LocationDropDownMenuLi" onClick={() => {
                                        setLocaSelected('인천공항');
                                        setLocaIsOpen(false);
                                    }}>인천공항</li>

                                    <li className="LocationDropDownMenuLi" onClick={() => {
                                        setLocaSelected('김포공항');
                                        setLocaIsOpen(false);
                                    }}>김포공항</li>

                                    <li className="LocationDropDownMenuLi" onClick={() => {
                                        setLocaSelected('서울동부');
                                        setLocaIsOpen(false);
                                    }}>서울동부</li>

                                    <li className="LocationDropDownMenuLi" onClick={() => {
                                        setLocaSelected('서울남부');
                                        setLocaIsOpen(false);
                                    }}>서울남부</li>

                                    <li className="LocationDropDownMenuLi" onClick={() => {
                                        setLocaSelected('서울북부');
                                        setLocaIsOpen(false);
                                    }}>서울북부</li>
                                </ul>
                        </div>
                        <div className={`LoTableWrap ${tdOpen ? 'open' : ''}`}>
                            <table>
                                <thead>
                                    <tr className="LocationTR">
                                        <th className="LocationTH">차량 이미지</th>
                                        <th className="LocationTH">차량 브랜드</th>
                                        <th className="LocationTH">모델명</th>
                                        <th className="LocationTH">차량 번호</th>
                                        <th className="LocationTH">연식</th>
                                        <th className="LocationTH">지점</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredCars.map((car) => (
                                    <tr key={car.id}>
                                        <td className="LocationTableTD">
                                            <img
                                                src={`/images/cars/${car.car_img}`}
                                                alt={car.model}
                                                style={{ width: "150px" }}/>
                                        </td>
                                        <td className="LocationTableTD">{car.brand}</td>
                                        <td className="LocationTableTD">{car.model}</td>
                                        <td className="LocationTableTD">{car.plate_number}</td>
                                        <td className="LocationTableTD">{car.model_year}</td>
                                        <td className="LocationTableTD">{car.location}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button className="tableOpener" onClick={() => setTdOpen(!tdOpen)}>
                            {tdOpen ? '접기' : '더보기'}
                        </button>
                    </div> 
                    :
                    <div className="LocationPage3">
                        <ol className="LocationPage3Ol">
                            <li className="LocationPage3Li">대여한 차량은 반드시 대여가 이루어진 지점으로 반납해주세요.</li>
                            <li className="LocationPage3Li">반납 시간은 계약서에 명시된 시간을 기준으로 엄수해 주시고 지연 시 추가 요금이 발생할 수 있어요.</li>
                            <li className="LocationPage3Li">차량 반납 전 연료 상태 및 차량 내외부 상태를 확인해 주세요.</li>
                            <li className="LocationPage3Li">차량 훼손이나 분실물이 확인될 경우, 약관에 따라 별도의 비용이 청구될 수 있어요.</li>
                            <li className="LocationPage3Li">교통 상황, 기상 악화 등으로 인한 지연도 반납 시간 초과로 간주될 수 있어요.</li>
                            <li className="LocationPage3Li">차량 반납 시 직원의 차량 상태 확인 절차가 진행될 수 있어요.</li>
                        </ol>
                        <div className="LocationPage3BottomDiv">
                            {userid?
                                <Link to={'/mypage/booked'}><button className="LocationPage3Btn" onClick={() => window.scrollTo(0,0)}>마이페이지로 이동</button></Link>
                                :
                                <button className="LocationPage3Btn" onClick={loginNeeded}>마이페이지로 이동</button>
                            }
                        </div>
                    </div>
                    }
                    </div>
                 </div>
            </div>
          
        </>
)}