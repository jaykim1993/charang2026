import { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './CarRegPage.css';

export default function CarRegPage(){

    // 화면 이동 훅
    const navi = useNavigate();

    // 차량 입력값 담는 상태변수
    // 텍스트 및 숫자 입력값
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [color, setColor] = useState('');
    const [plateNumber, setPlateNumber] = useState('');
    const [modelYear, setModelYear] = useState('');
    const [driverMinAge, setDriverMinAge] = useState('');
    const [kmPer, setKmPer] = useState('');
    const [priceValue, setPriceValue] = useState('');
    const [seats, setSeats] = useState('');

    // 파일 입력값
    const [brandLogo, setBrandLogo] = useState(null);
    const [carImg, setCarImg] = useState(null);

    // 선택 입력값
    const [branchId, setBranchId] = useState(1);
    const [licenseType, setLicenseType] = useState(1);
    const [carSize, setCarSize] = useState('경소형');
    const [carType, setCarType] = useState('승용');
    const [fuelType, setFuelType] = useState('하이브리드');

    // 옵션 선택 (유: 1, 무: 0)
    const [navigation, setNavigation] = useState(1);
    const [rearCamera, setRearCamera] = useState(1);
    const [heatSeat, setHeatSeat] = useState(1);
    const [heatHandle, setHeatHandle] = useState(1);
    const [bluetooth, setBluetooth] = useState(1);
    const [smartKey, setSmartKey] = useState(1);
    const [sunRoof, setSunRoof] = useState(1);

    // 차량 등록 핸들러
    const regHandler = () => {
        axios.post("/api/addCar",
            {
            brand: brand,
            model: model,
            color: color,
            plateNumber: plateNumber,
            modelYear: modelYear,
            branchId: branchId,
            licenseType: licenseType,
            driverMinAge: driverMinAge,
            kmPer: kmPer,
            priceValue: priceValue,
            seats: seats,
            carSize: carSize,
            carType: carType,
            fuelType: fuelType,
            navigation: navigation,
            rearCamera: rearCamera,
            heatSeat: heatSeat,
            heatHandle: heatHandle,
            bluetooth: bluetooth,
            smartKey: smartKey,
            sunRoof: sunRoof 
            })
        .then((res) => {
            console.log("등록 결과", res.data);
            // 등록 성공
            if(res.data){
                alert("차량 등록이 완료되었습니다.");
                navi('/manager/carlist');
            }
            // 등록 실패
            else{
                alert("차량 등록 실패하였습니다.");
            }
        })
        .catch((error)=>{
            console.log("차량 등록 에러: ", error);
        })
    }
    

    return(
        <div className="carRegPage">
            <h1>차량 등록</h1>
            <table className="car_reg_table">
                <tbody className="car_reg_tbody">
                    <tr>
                        <td>브랜드</td>
                        <td>
                            <input type="text" name="brand" 
                            placeholder='예) 제네러스' onChange={(e)=>setBrand(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                        <td>브랜드 로고 이미지</td>
                        <td>
                            <input type="file" name="brandLogo" onChange={(e)=>setBrandLogo(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                        <td>모델명</td>
                        <td>
                            <input type="text" name="model" 
                            placeholder='예) GG80' onChange={(e)=>setModel(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                        <td>차량 이미지</td>
                        <td>
                            <input type="file" name="carImg" onChange={(e)=>setCarImg(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                        <td>색상</td>
                        <td>
                            <input type="text" name="color" 
                            placeholder='예) white' onChange={(e)=>setColor(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                        <td>차량 번호</td>
                        <td>
                            <input type="text" name="plateNumber" 
                            placeholder='예) 00호0000' onChange={(e)=>setPlateNumber(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                        <td>연식</td>
                        <td>
                            <input type="text" name="modelYear" 
                            placeholder='예) 2026' onChange={(e)=>setModelYear(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                        <td>지점 코드</td>
                        <td>
                            <select value={branchId} onChange={(e)=>setBranchId(e.target.value)}>
                                <option value={1}>인천공항 지점</option>
                                <option value={2}>김포공항 지점</option>
                                <option value={3}>서울동부 지점</option>
                                <option value={4}>서울남부 지점</option>
                                <option value={5}>서울북부 지점</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>요구 면허종류</td>
                        <td>
                            <select value={licenseType} onChange={(e)=>setLicenseType(e.target.value)}>
                                <option value={1}>1종</option>
                                <option value={2}>2종</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>최소나이</td>
                        <td>
                            <input type="number" name="driverMinAge" onChange={(e)=>setDriverMinAge(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                        <td>연비</td>
                        <td>
                            <input type="text" name="kmPer" onChange={(e)=>setKmPer(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                        <td>브랜드 가중치</td>
                        <td>
                            <input type="number" name="priceValue" onChange={(e)=>setPriceValue(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                        <td>좌석 수</td>
                        <td>
                            <input type="number" name="seats" onChange={(e)=>setSeats(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                        <td>차량 크기</td>
                        <td>
                            <select value={carSize} onChange={(e)=>setCarSize(e.target.value)}>
                                <option value={"경소형"}>1종</option>
                                <option value={"대형"}>1종 대형</option>
                                <option value={"중형"}>2종</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>차량 타입</td>
                        <td>
                            <select value={carType} onChange={(e)=>setCarType(e.target.value)}>
                                <option value={"승용"}>승용</option>
                                <option value={"SUV"}>SUV</option>
                                <option value={"RV"}>RV</option>
                                <option value={"화물"}>화물</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>연료 타입</td>
                        <td>
                            <select value={fuelType} onChange={(e)=>setFuelType(e.target.value)}>
                                <option value={"하이브리드"}>하이브리드</option>
                                <option value={"휘발유"}>휘발유</option>
                                <option value={"경유"}>경유</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>네비게이션</td>
                        <td>
                            <select value={navigation} onChange={(e)=>setNavigation(e.target.value)}>
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>후방카메라</td>
                        <td>
                            <select value={rearCamera} onChange={(e)=>setRearCamera(e.target.value)}>
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>열선시트</td>
                        <td>
                            <select value={heatSeat} onChange={(e)=>setHeatSeat(e.target.value)}>
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>핸들열선</td>
                        <td>
                            <select value={heatHandle} onChange={(e)=>setHeatHandle(e.target.value)}>
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>블루투스</td>
                        <td>
                            <select value={bluetooth} onChange={(e)=>setBluetooth(e.target.value)}>
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>스마트키</td>
                        <td>
                            <select value={smartKey} onChange={(e)=>setSmartKey(e.target.value)}>
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>썬루프</td>
                        <td>
                            <select value={sunRoof} onChange={(e)=>setSunRoof(e.target.value)}>
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    
                </tbody>
            </table>
            <div className="btn_part">
                <button className="reg_btn" onClick={regHandler}>등록하기</button>
            </div>
        </div>
    )
}