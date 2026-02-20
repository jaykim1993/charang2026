import { Link } from "react-router-dom"
import { useContext } from "react"
import { DataContext } from "../contexts/Datacontext"
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import './Location.css'
import { AuthContext } from "../contexts/Authcontext"; // 미로그인 시 방어코드 12.22 - 성중 - 성중

export default function GuideInventory(){

const [locaisOpen, setLocaIsOpen] = useState(false);
const [locaselected, setLocaSelected] = useState('지점을 선택해주세요');
const [locaCvs,setLocaCvs] = useState("지점을 선택해주세요");
const {branch, car}=useContext(DataContext)
const carCopy = [...car]
  if(locaselected === 1){
    setLocaCvs === "인천공항"
  }else if(locaselected ===2){
    setLocaCvs === "김포공항"
  }else if(locaselected ===3){
    setLocaCvs === "서울동부"
  }else if(locaselected ===4){
    setLocaCvs === "서울남부"
  }else{
    setLocaCvs === "서울북부"
  }
const filteredCars = locaselected === '지점을 선택해주세요'
  ? carCopy
  : carCopy.filter(item => item.branchId === locaselected);



    const { userid, loginNeeded } = useContext(AuthContext);
    const [tdOpen, setTdOpen] = useState(false);
    return(
        <>
        <div className="LocationPage2">
            <h3>차량보유현황</h3>
                        <div className="Locationdropdown">
                            <button className="LocationdropdownBtn" onClick={() => setLocaIsOpen(!locaisOpen)}>
                                {locaCvs} <i className="bi bi-chevron-down"></i>
                            </button>
                               <ul className={`LocationdropdownMenu ${locaisOpen ? "open" : ""}`}>
                                    <li className="LocationDropDownMenuLi" onClick={() => {
                                        setLocaSelected(1);
                                        setLocaIsOpen(false);
                                    }}>인천공항</li>

                                    <li className="LocationDropDownMenuLi" onClick={() => {
                                        setLocaSelected(2);
                                        setLocaIsOpen(false);
                                    }}>김포공항</li>

                                    <li className="LocationDropDownMenuLi" onClick={() => {
                                        setLocaSelected(3);
                                        setLocaIsOpen(false);
                                    }}>서울동부</li>

                                    <li className="LocationDropDownMenuLi" onClick={() => {
                                        setLocaSelected(4);
                                        setLocaIsOpen(false);
                                    }}>서울남부</li>

                                    <li className="LocationDropDownMenuLi" onClick={() => {
                                        setLocaSelected(5);
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
                                    <tr key={car.carId}>
                                        <td className="LocationTableTD">
                                            <img
                                                src={`/images/cars/${car.carImg}`}
                                                alt={car.model}
                                                style={{ width: "150px" }}/>
                                        </td>
                                        <td className="LocationTableTD">{car.brand}</td>
                                        <td className="LocationTableTD">{car.model}</td>
                                        <td className="LocationTableTD">{car.plateNumber}</td>
                                        <td className="LocationTableTD">{car.modelYear}</td>
                                        <td className="LocationTableTD">{car.branchId === 1? '인천공항': car.branchId === 2? '김포공항' :car.branchId === 3? '서울동부':car.branchId === 4? '서울남부' :car.branchId === 5? '서울북부' : '' }</td>
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