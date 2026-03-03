import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/Authcontext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import './CarDetailPage.css';

export default function CarDetailPage(){

    const navigate = useNavigate();

    // params로 carId값 들고 넘어옴
    const {carId} = useParams();

    // 해당 carId 정보 담을 상태변수
    const [oneCar, setOneCar] = useState({});

    // 해당 carI 정보 불러오기
    useEffect(()=>{
        console.log("현재 useParams로 가져온 carId: ", carId);
        axios.get("/api/carinfo/"+carId)
        .then((res)=>{
            console.log("해당 id 데이터: ",res.data);
            setOneCar(res.data);
        })
        .catch((error)=>{
            console.log("해당 id 데이터 오류: ", error);
        })
    },[]);

    // 수정하는 페이지로 이동하는 핸들러
    const modPageHandler = () => {
        navigate(`/manager/modPage/${carId}`);
    }

        const copyText = async (text) => {
            try {
                await navigator.clipboard.writeText(text);
                alert('차량 번호가 복사되었습니다.')
            } catch (err) {
            }
        };
        const copyText2 = async (text) => {
            try {
                await navigator.clipboard.writeText(text);
                alert('차량 모델명 복사되었습니다.')
            } catch (err) {
            }
        };

   return (
        <div className="carDetailPage">
            <div className="carDetail_container">
                <div className="carDetail_header">
                    <h2 className="carDetail_title">차량 상세정보</h2>
                    <div className="carDetail_btnBox">
                        <button type="button" className="carDetail_listBtn" onClick={() => navigate(-1)}>전체목록</button>
                        <button type="button" className="carDetail_listBtn" onClick={modPageHandler}>수정하기</button>
                    </div>
                </div>

                <table className="carDetail_table">
                    <tbody className="carDetail_table_body">
                        <tr className="carDetail_tr">
                            <td className="carDetail_td">차량ID</td>
                            <th className="carDetail_data">{oneCar.carId}</th>
                            <td className="carDetail_td">차량번호</td>
                            <th className="carDetail_data2" onClick={() => copyText(oneCar.plateNumber)} title="클릭하면 차량 번호가 복사됩니다">{oneCar.plateNumber}</th>
                        </tr>
                        <tr className="carDetail_tr">
                            <td className="carDetail_td">브랜드명</td>
                            <th className="carDetail_data">{oneCar.brand}</th>
                            <td className="carDetail_td">모델명</td>
                            <th className="carDetail_data2" onClick={() => copyText2(oneCar.model)} title="클릭하면 차량 모델명이 복사됩니다">{oneCar.model}</th>
                        </tr>
                        <tr className="carDetail_tr">
                            <td className="carDetail_td">브랜드이미지</td>
                            <th className="carDetail_data">
                                <img src={`/images/brands/${oneCar.brandLogo}`} alt={oneCar.carImg} className="carDetial_img1"/>
                            </th>
                            <td className="carDetail_td">모델이미지</td>
                            <th className="carDetail_data">
                                <img src={`/images/cars/${oneCar.carImg}`} alt={oneCar.carImg} className="carDetial_img"/>
                            </th>
                        </tr>
                        <tr className="carDetail_tr">
                            <td className="carDetail_td">색상</td>
                            <th className="carDetail_data">{oneCar.color}</th>
                            <td className="carDetail_td">좌석수</td>
                            <th className="carDetail_data">{oneCar.seats} 인승</th>
                        </tr>
                        <tr className="carDetail_tr">
                            <td className="carDetail_td">연식</td>
                            <th className="carDetail_data">{oneCar.modelYear}</th>
                            <td className="carDetail_td">크기</td>
                            <th className="carDetail_data">{oneCar.carSize}</th>
                        </tr>
                        <tr className="carDetail_tr">
                            <td className="carDetail_td">차량타입</td>
                            <th className="carDetail_data">{oneCar.carType}</th>
                            <td className="carDetail_td">연료타입</td>
                            <th className="carDetail_data">{oneCar.fuelType}</th>
                        </tr>
                        <tr className="carDetail_tr">
                            <td className="carDetail_td">면허타입</td>
                            <th className="carDetail_data">{oneCar.licenseType}종 보통</th>
                            <td className="carDetail_td">지점</td>
                            <th className="carDetail_data">{oneCar.name}</th>
                        </tr>
                        <tr className="carDetail_tr">
                            <td className="carDetail_td">연비</td>
                            <th className="carDetail_data">{oneCar.kmPer}</th>
                            <td className="carDetail_td">최소나이</td>
                            <th className="carDetail_data">{oneCar.driverMinAge}세</th>
                        </tr>
                        <tr className="carDetail_tr">
                            <td className="carDetail_td">네비게이션</td>
                            <th className="carDetail_data">{oneCar.navigation == 1 ? "있음" : "없음"}</th>
                            <td className="carDetail_td">브랜드가중치</td>
                            <th className="carDetail_data">{oneCar.priceValue}</th>
                        </tr>
                        <tr className="carDetail_tr">
                            <td className="carDetail_td">썬루프</td>
                            <th className="carDetail_data">{oneCar.sunRoof == 1 ? "있음" : "없음"}</th>
                            <td className="carDetail_td">후방카메라</td>
                            <th className="carDetail_data">{oneCar.rearCamera == 1 ? "있음" : "없음"}</th>
                        </tr>
                        <tr className="carDetail_tr">
                            <td className="carDetail_td">열선시트</td>
                            <th className="carDetail_data">{oneCar.heatSeat == 1 ? "있음" : "없음"}</th>
                            <td className="carDetail_td">열선핸들</td>
                            <th className="carDetail_data">{oneCar.heatHandle == 1 ? "있음" : "없음"}</th>
                        </tr>
                        <tr className="carDetail_tr">
                            <td className="carDetail_td">블루투스</td>
                            <th className="carDetail_data">{oneCar.bluetooth == 1 ? "있음" : "없음"}</th>
                            <td className="carDetail_td">스마트키</td>
                            <th className="carDetail_data">{oneCar.smartKey == 1 ? "있음" : "없음"}</th>
                        </tr>
                        <tr className="carDetail_tr">
                            <td className="carDetail_td">등록일자</td>
                            <th className="carDetail_data">{oneCar.regDate}</th>
                            <td className="carDetail_td">수정일자</td>
                            <th className="carDetail_data">{oneCar.modDate}</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}