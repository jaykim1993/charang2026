import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/Authcontext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import './CarModPage.css';

export default function CarModPage() {

    const navigate = useNavigate();

    // params로 carId값 들고 넘어옴
    const { carId } = useParams();

    // 해당 carId 정보 담을 상태변수
    // const [oneCar, setOneCar] = useState({});

    // 해당 carId 정보 불러와서 기본값으로 채우기
    useEffect(() => {
        console.log("현재 useParams로 가져온 carId: ", carId);
        axios.get("/api/carinfo/" + carId)
            .then((res) => {
                console.log("해당 id 데이터: ", res.data);
                setUpdateCar(res.data);
            })
            .catch((error) => {
                console.log("해당 id 데이터 오류: ", error);
            })
    }, []);

    // 모든 값 하나의 객체로 관리
    const [updateCar, setUpdateCar] = useState({
        brand: '', // 브랜드 이름
        model: '', // 모델 이름
        color: '', // 색상
        plateNumber: '', // 차량 번호
        modelYear: '', // 년도
        driverMinAge: '', // 최소 나이
        kmPer: '', // 연비
        priceValue: '', // 가격
        seats: '', // 좌석
        branchId: 1, // 지점 아이디
        licenseType: 1, // 면허 종류
        carSize: '경소형',
        carType: '승용',
        fuelType: '하이브리드',
        navigation: 1,
        rearCamera: 1,
        heatSeat: 1,
        heatHandle: 1,
        bluetooth: 1,
        smartKey: 1,
        sunRoof: 1,
    })

    // // 수정 핸들러
    const modHandler = () => {

        const formData = new FormData();

        const textData = {
            carId: Number(carId),
            brand: updateCar.brand,
            model: updateCar.model,
            color: updateCar.color,
            plateNumber: updateCar.plateNumber,
            modelYear: Number(updateCar.modelYear),
            driverMinAge: Number(updateCar.driverMinAge),
            kmPer: updateCar.kmPer,
            priceValue: Number(updateCar.priceValue),
            seats: Number(updateCar.seats),
            branchId: Number(updateCar.branchId),
            licenseType: Number(updateCar.licenseType),
            carSize: updateCar.carSize,
            carType: updateCar.carType,
            fuelType: updateCar.fuelType,
            navigation: Number(updateCar.navigation),
            rearCamera: Number(updateCar.rearCamera),
            heatSeat: Number(updateCar.heatSeat),
            heatHandle: Number(updateCar.heatHandle),
            bluetooth: Number(updateCar.bluetooth),
            smartKey: Number(updateCar.smartKey),
            sunRoof: Number(updateCar.sunRoof)
        };

        console.log("보낼 데이터: ", textData);

        // JSON 문자열로 변환해서 testData 하나로 묶기
        formData.append('carDTOData', JSON.stringify(textData));

        console.log(" JSON.stringify(textData)", JSON.stringify(textData));
        axios.put("/api/modifyCar", formData)
            .then((res) => {
                if (res.data === 1) {
                    alert("수정되었습니다.");
                    navigate("/manager/carlist");
                } else {
                    alert("다시 시도해주세요.");
                }
            })
            .catch((error) => {
                console.log("회원정보 수정 에러: ", error);
            })
    }

    // 공통 입력 처리 함수
    const changeHandler = (e) => {
        // input의 name 값 가져오기
        const inputName = e.target.name;

        setUpdateCar({ ...updateCar, [inputName]: e.target.value });
    }

    return (
        <div className="carMod">
            <div className="carMod_container">
                <div className="carMod_header">
                    <h2 className="carMod_title">차량 상세 정보 수정</h2>
                    <div className="carMod_btnBox">
                        <button type="button" className="carMod_Btn" onClick={() => navigate(-1)}>뒤로가기</button>
                    </div>
                </div>

                <table className="carMod_table">
                    <tbody className="carMod_tbody">
                        {/* 브랜드 */}
                        <tr className="carMod_tr">
                            <td className="carMod_td_label">브랜드</td>
                            <td className="carMod_td_input">
                                <input type="text" name="brand" className="carMod_input"
                                    placeholder='예) 제네러스' onChange={changeHandler} value={updateCar.brand} />
                            </td>
                        </tr>
                        {/* 모델명 */}
                        <tr className="carMod_tr">
                            <td className="carMod_td_label">모델명</td>
                            <td className="carMod_td_input">
                                <input type="text" name="model" className="carMod_input"
                                    placeholder='예) GG80' onChange={changeHandler} value={updateCar.model} />
                            </td>
                        </tr>
                        {/* 색상 */}
                        <tr className="carMod_tr">
                            <td className="carMod_td_label">색상</td>
                            <td className="carMod_td_input">
                                <input type="text" name="color" className="carMod_input"
                                    placeholder='예) white' onChange={changeHandler} value={updateCar.color} />
                            </td>
                        </tr>
                        {/* 차량 번호 */}
                        <tr className="carMod_tr">
                            <td className="carMod_td_label">차량 번호</td>
                            <td className="carMod_td_input">
                                <input type="text" name="plateNumber" className="carMod_input"
                                    placeholder='예) 00호0000' onChange={changeHandler} value={updateCar.plateNumber} />
                            </td>
                        </tr>
                        {/* 연식 */}
                        <tr className="carMod_tr">
                            <td className="carMod_td_label">연식</td>
                            <td className="carMod_td_input">
                                <input type="text" name="modelYear" className="carMod_input"
                                    placeholder='예) 2026' onChange={changeHandler} value={updateCar.modelYear} />
                            </td>
                        </tr>
                        {/* 지점 코드 */}
                        <tr className="carMod_tr">
                            <td className="carMod_td_label">지점 위치</td>
                            <td className="carMod_td_input">
                                <select name="branchId" className="carMod_select" onChange={changeHandler} value={updateCar.branchId}>
                                    <option value={1}>인천공항 지점</option>
                                    <option value={2}>김포공항 지점</option>
                                    <option value={3}>서울동부 지점</option>
                                    <option value={4}>서울남부 지점</option>
                                    <option value={5}>서울북부 지점</option>
                                </select>
                            </td>
                        </tr>
                        {/* 면허 종류 */}
                        <tr className="carMod_tr">
                            <td className="carMod_td_label">요구 면허</td>
                            <td className="carMod_td_input">
                                <select name="licenseType" className="carMod_select" onChange={changeHandler} value={updateCar.licenseType}>
                                    <option value={1}>1종 보통</option>
                                    <option value={2}>2종 보통</option>
                                </select>
                            </td>
                        </tr>
                        {/* 최소 나이 */}
                        <tr className="carMod_tr">
                            <td className="carMod_td_label">최소 나이</td>
                            <td className="carMod_td_input">
                                <input type="number" name="driverMinAge" className="carMod_input" onChange={changeHandler} value={updateCar.driverMinAge} />
                            </td>
                        </tr>
                        {/* 연비 */}
                        <tr className="carMod_tr">
                            <td className="carMod_td_label">연비</td>
                            <td className="carMod_td_input">
                                <input type="text" name="kmPer" className="carMod_input" onChange={changeHandler} value={updateCar.kmPer} />
                            </td>
                        </tr>
                        {/* 브랜드 가중치(가격) */}
                        <tr className="carMod_tr">
                            <td className="carMod_td_label">브랜드 가중치</td>
                            <td className="carMod_td_input">
                                <input type="number" name="priceValue" className="carMod_input" onChange={changeHandler} value={updateCar.priceValue} />
                            </td>
                        </tr>
                        {/* 좌석 수 */}
                        <tr className="carMod_tr">
                            <td className="carMod_td_label">좌석 수</td>
                            <td className="carMod_td_input">
                                <input type="number" name="seats" className="carMod_input" onChange={changeHandler} value={updateCar.seats} />
                            </td>
                        </tr>
                        {/* 차량 크기 */}
                        <tr className="carMod_tr">
                            <td className="carMod_td_label">차량 크기</td>
                            <td className="carMod_td_input">
                                <select name="carSize" className="carMod_select" onChange={changeHandler} value={updateCar.carSize}>
                                    <option value="경소형">경소형</option>
                                    <option value="중형">중형</option>
                                    <option value="대형">대형</option>
                                </select>
                            </td>
                        </tr>
                        {/* 차량 타입 */}
                        <tr className="carMod_tr">
                            <td className="carMod_td_label">차량 타입</td>
                            <td className="carMod_td_input">
                                <select name="carType" className="carMod_select" onChange={changeHandler} value={updateCar.carType}>
                                    <option value="승용">승용</option>
                                    <option value="SUV">SUV</option>
                                    <option value="RV">RV</option>
                                    <option value="화물">화물</option>
                                </select>
                            </td>
                        </tr>
                        {/* 연료 타입 */}
                        <tr className="carMod_tr">
                            <td className="carMod_td_label">연료 타입</td>
                            <td className="carMod_td_input">
                                <select name="fuelType" className="carMod_select" onChange={changeHandler} value={updateCar.fuelType}>
                                    <option value="하이브리드">하이브리드</option>
                                    <option value="휘발유">휘발유</option>
                                    <option value="경유">경유</option>
                                    <option value="전기">전기</option>
                                </select>
                            </td>
                        </tr>
                        {/* 옵션 항목들 (네비, 후방카메라 등) */}
                        {["navigation", "rearCamera", "heatSeat", "heatHandle", "bluetooth", "smartKey", "sunRoof"].map((option) => (
                            <tr className="carMod_tr" key={option}>
                                <td className="carMod_td_label">
                                    {option === "navigation" && "네비게이션"}
                                    {option === "rearCamera" && "후방카메라"}
                                    {option === "heatSeat" && "열선시트"}
                                    {option === "heatHandle" && "핸들열선"}
                                    {option === "bluetooth" && "블루투스"}
                                    {option === "smartKey" && "스마트키"}
                                    {option === "sunRoof" && "썬루프"}
                                </td>
                                <td className="carMod_td_input">
                                    <select name={option} className="carMod_select" onChange={changeHandler} value={updateCar[option]}>
                                        <option value={1}>유</option>
                                        <option value={0}>무</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="button" className="carMod_modBtn" onClick={modHandler}>수정하기</button>
            </div>
        </div>
    )
}