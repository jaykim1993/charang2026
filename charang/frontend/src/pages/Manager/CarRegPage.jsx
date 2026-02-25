import { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './CarRegPage.css';

export default function CarRegPage(){

    // 모든 값 하나의 객체로 관리
    const [regCar, setRegCar] = useState({
        brand:'', // 브랜드 이름
        model:'', // 모델 이름
        color:'', // 색상
        plateNumber:'', // 차량 번호
        modelYear:'', // 년도
        driverMinAge:'', // 최소 나이
        kmPer:'', // 연비
        priceValue:'', // 가격
        seats:'', // 좌석
        brandLogo:null, // 브랜드 이미지
        carImg:null, // 차량 이미지
        branchId:1, // 지점 아이디
        licenseType:1, // 면허 종류
        carSize:'경소형',
        carType:'승용',
        fuelType:'하이브리드',
        navigation:1,
        rearCamera:1,
        heatSeat:1,
        heatHandle:1,
        bluetooth:1,
        smartKey:1,
        sunRoof:1,
    })

    // 화면 이동 훅
    const navi = useNavigate();

    // 차량 등록 핸들러
    const regHandler = () => {

        const formData = new FormData();

      /// 파일만 별도로 추가
       formData.append('brandLogoImg', regCar.brandLogo);
       formData.append('carImgImg', regCar.carImg);

    const textData = {
        brand: regCar.brand,
        model: regCar.model,
        color: regCar.color,
        plateNumber: regCar.plateNumber,
        modelYear: Number(regCar.modelYear),
        driverMinAge: Number(regCar.driverMinAge),
        kmPer: regCar.kmPer,
        priceValue: Number(regCar.priceValue),
        seats: Number(regCar.seats),
        branchId: Number(regCar.branchId), 
        licenseType: Number(regCar.licenseType),
        carSize: regCar.carSize,
        carType: regCar.carType,
        fuelType: regCar.fuelType,
        navigation: Number(regCar.navigation),
        rearCamera: Number(regCar.rearCamera),
        heatSeat: Number(regCar.heatSeat),
        heatHandle: Number(regCar.heatHandle),
        bluetooth: Number(regCar.bluetooth),
        smartKey: Number(regCar.smartKey),
        sunRoof: Number(regCar.sunRoof)
    };

    console.log("보낼 데이터: ",textData);

    // JSON 문자열로 변환해서 testData 하나로 묶기
    formData.append('carDTOData', JSON.stringify(textData));

        axios.post("/api/addCar",formData)
        .then((res) => {
            console.log("등록 결과", res.data);
            // 등록 성공
            if(res.data === 1){
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

    // 공통 입력 처리 함수
    const inputHandler = (e) => {
        // input의 name 값 가져오기
        const inputName = e.target.name;

        if(e.target.type === 'file' && e.target.name === 'brandLogo'){
            setRegCar({...regCar,[inputName]:e.target.files[0]});
        }else if(e.target.type === 'file' && e.target.name === 'carImg')
            setRegCar({...regCar,[inputName]:e.target.files[0]});
        else{
            setRegCar({...regCar,[inputName]:e.target.value});
        }
    }
    

    return(
        <div className="carRegPage">
            <div className="crp_header">
                <h1>차량 등록</h1>
                <button type="button" className="crp_listBtn" onClick={() => navi(-1)}>전체목록</button>
            </div>
           
            <table className="car_reg_table">
                <tbody className="car_reg_tbody">
                    <tr className="crp_tr">
                        <td className="crp_td">브랜드</td>
                        <td className="crp_data">
                            <input type="text" name="brand" className="crp_input"
                            placeholder='예) 제네러스' onChange={inputHandler}/>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">브랜드 로고 이미지</td>
                        <td className="crp_data">
                            <input type="file" name="brandLogo" className="crp_input_img"
                            onChange={inputHandler}/>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">모델명</td>
                        <td className="crp_data">
                            <input type="text" name="model" className="crp_input"
                            placeholder='예) GG80' onChange={inputHandler}/>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">차량 이미지</td>
                        <td className="crp_data">
                            <input type="file" name="carImg" className="crp_input_img"
                            onChange={inputHandler}/>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">색상</td>
                        <td className="crp_data">
                            <input type="text" name="color" className="crp_input"
                            placeholder='예) white' onChange={inputHandler}/>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">차량 번호</td>
                        <td className="crp_data">
                            <input type="text" name="plateNumber" className="crp_input"
                            placeholder='예) 00호0000' onChange={inputHandler}/>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">연식</td>
                        <td className="crp_data">
                            <input type="text" name="modelYear" className="crp_input"
                            placeholder='예) 2026' onChange={inputHandler}/>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">지점 코드</td>
                        <td className="crp_data">
                            <select name="branchId" onChange={inputHandler} className="crp_select">
                                <option value={1}>인천공항 지점</option>
                                <option value={2}>김포공항 지점</option>
                                <option value={3}>서울동부 지점</option>
                                <option value={4}>서울남부 지점</option>
                                <option value={5}>서울북부 지점</option>
                            </select>
                        </td>
                    </tr >
                    <tr className="crp_tr">
                        <td className="crp_td">요구 면허종류</td>
                        <td className="crp_data">
                            <select name="licenseType" onChange={inputHandler} className="crp_select">
                                <option value={1}>1종</option>
                                <option value={2}>2종</option>
                            </select>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">최소나이</td>
                        <td className="crp_data">
                            <input type="number" name="driverMinAge" className="crp_input"
                            onChange={inputHandler}/>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">연비</td>
                        <td className="crp_data">
                            <input type="text" name="kmPer" onChange={inputHandler} className="crp_input"/>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">브랜드 가중치</td>
                        <td className="crp_data">
                            <input type="number" name="priceValue" onChange={inputHandler} className="crp_input"/>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">좌석 수</td>
                        <td className="crp_data">
                            <input type="number" name="seats" onChange={inputHandler} className="crp_input"/>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">차량 크기</td>
                        <td className="crp_data">
                            <select name="carSize" onChange={inputHandler} className="crp_select">
                                <option value="경소형">1종</option>
                                <option value="대형">1종 대형</option>
                                <option value="중형">2종</option>
                            </select>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">차량 타입</td>
                        <td className="crp_data">
                            <select name="carType" onChange={inputHandler} className="crp_select">
                                <option value="승용">승용</option>
                                <option value="SUV">SUV</option>
                                <option value="RV">RV</option>
                                <option value="화물">화물</option>
                            </select>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">연료 타입</td>
                        <td className="crp_data">
                            <select name="fuelType" onChange={inputHandler} className="crp_select">
                                <option value="하이브리드">하이브리드</option>
                                <option value="휘발유">휘발유</option>
                                <option value="경유">경유</option>
                            </select>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">네비게이션</td>
                        <td className="crp_data">
                            <select name="navigation" onChange={inputHandler} className="crp_select">
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">후방카메라</td>
                        <td className="crp_data">
                            <select name="rearCamera" onChange={inputHandler} className="crp_select">
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">열선시트</td>
                        <td className="crp_data">
                            <select name="heatSeat" onChange={inputHandler} className="crp_select">
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">핸들열선</td>
                        <td className="crp_data">
                            <select name="heatHandle" onChange={inputHandler} className="crp_select">
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">블루투스</td>
                        <td className="crp_data">
                            <select name="bluetooth" onChange={inputHandler} className="crp_select">
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">스마트키</td>
                        <td className="crp_data">
                            <select name="smartKey" onChange={inputHandler} className="crp_select">
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr className="crp_tr">
                        <td className="crp_td">썬루프</td>
                        <td className="crp_data">
                            <select name="sunRoof" onChange={inputHandler} className="crp_select">
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    
                </tbody>
            </table>
            <button className="crp_reg_btn" onClick={regHandler}>등록하기</button>
        </div>
    )
}