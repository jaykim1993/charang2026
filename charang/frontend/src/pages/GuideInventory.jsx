import { Link } from "react-router-dom"
import { useContext } from "react"
import { DataContext } from "../contexts/Datacontext"
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import L from 'leaflet';
import './Location.css'
import { AuthContext } from "../contexts/Authcontext"; // 미로그인 시 방어코드 12.22 - 성중 - 성중

export default function GuideInventory(){

const [locaisOpen, setLocaIsOpen] = useState(false);
const [locaselected, setLocaSelected] = useState('지점을 선택해주세요');
const {positions, cars}=useContext(DataContext)
const carCopy = [...cars]
const filteredCars = locaselected === '지점을 선택해주세요'
  ? carCopy
  : carCopy.filter(item => item.location === locaselected);


    const { userid, loginNeeded } = useContext(AuthContext);
    const [tdOpen, setTdOpen] = useState(false);
    return(
        <>
        <div className="LocationPage2">
            <h3>차량보유현황</h3>
                        <div className="Locationdropdown">
                            <button className="LocationdropdownBtn" onClick={() => setLocaIsOpen(!locaisOpen)}>
                                {locaselected} <i className="bi bi-chevron-down"></i>
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
        </>
    )
}