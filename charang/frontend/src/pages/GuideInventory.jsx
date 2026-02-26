import { Link } from "react-router-dom"
import { useContext } from "react"
import { DataContext } from "../contexts/Datacontext"
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import './GuideInventory.css'
import { AuthContext } from "../contexts/Authcontext"; // 미로그인 시 방어코드 12.22 - 성중 - 성중

export default function GuideInventory(){

const [locaisOpen, setLocaIsOpen] = useState(false);
const [locaselected, setLocaSelected] = useState('지점 선택');
const [locaCvs,setLocaCvs] = useState("지점 선택");
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
const filteredCars = locaselected === '지점 선택'
  ? carCopy
  : carCopy.filter(item => item.branchId === locaselected);

    const { userid, loginNeeded } = useContext(AuthContext);
    const [tdOpen, setTdOpen] = useState(false);
    return(
        <div className="LocationPage2">
            <h4 style={{marginBottom:'20px'}}>차량보유현황</h4>
                        
            <div className={`LoTableWrap ${tdOpen ? 'open' : ''}`}>
                <table>
                    <thead>
                        <tr className="invenTR">
                            <th className="invenTH">차량 이미지</th>
                            <th className="invenTH">차량 브랜드</th>
                            <th className="invenTH">모델명</th>
                            <th className="invenTH">차량 번호</th>
                            <th className="invenTH">연식</th>
                            <th className="invenTH">
                                <div className="invendropdown">
                                    <button className="invendropdownBtn" onClick={() => setLocaIsOpen(!locaisOpen)}>
                                        {locaCvs}  <i className={`bi ${locaisOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                                    </button>
                                    <ul className={`LocationdropdownMenu ${locaisOpen ? "open" : ""}`}>
                                            <li className="LocationDropDownMenuLi" onClick={() => {
                                                setLocaSelected(1);
                                                setLocaIsOpen(false);
                                                setLocaCvs("인천공항");
                                            }}>인천공항</li>

                                            <li className="LocationDropDownMenuLi" onClick={() => {
                                                setLocaSelected(2);
                                                setLocaIsOpen(false);
                                                setLocaCvs("김포공항");
                                            }}>김포공항</li>

                                            <li className="LocationDropDownMenuLi" onClick={() => {
                                                setLocaSelected(3);
                                                setLocaIsOpen(false);
                                                setLocaCvs("서울동부");
                                            }}>서울동부</li>

                                            <li className="LocationDropDownMenuLi" onClick={() => {
                                                setLocaSelected(4);
                                                setLocaIsOpen(false);
                                                setLocaCvs("서울남부");
                                            }}>서울남부</li>

                                            <li className="LocationDropDownMenuLi" onClick={() => {
                                                setLocaSelected(5);
                                                setLocaIsOpen(false);
                                                setLocaCvs("서울북부");
                                            }}>서울북부</li>
                                        </ul>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="invenTB">
                        {filteredCars.map((car) => (
                        <tr key={car.carId}>
                            <td className="invenTableTD">
                                <img
                                    src={`/images/cars/${car.carImg}`}
                                    alt={car.model}
                                    style={{ width: "150px" }}/>
                            </td>
                            <td className="invenTableTD">{car.brand}</td>
                            <td className="invenTableTD">{car.model}</td>
                            <td className="invenTableTD">{car.plateNumber}</td>
                            <td className="invenTableTD">{car.modelYear}</td>
                            <td className="invenTableTD">{car.branchId === 1? '인천공항': car.branchId === 2? '김포공항' :car.branchId === 3? '서울동부':car.branchId === 4? '서울남부' :car.branchId === 5? '서울북부' : '' }</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="tableOpener" onClick={() => setTdOpen(!tdOpen)}>
                {tdOpen ? '접기' : '더보기'}
            </button>
        </div> 
    )
}