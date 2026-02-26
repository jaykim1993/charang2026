import { Link } from "react-router-dom"
import { useContext } from "react"
import { DataContext } from "../contexts/Datacontext"
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import L from 'leaflet';
import './Location.css'
import { AuthContext } from "../contexts/Authcontext"; // 미로그인 시 방어코드 12.22 - 성중 - 성중

export default function GuideReturn(){

    
    const { userid, loginNeeded } = useContext(AuthContext);


    return(
        <>
        <div className="LocationPage3">
            <h3>차량반납안내</h3>
            <ol className="LocationPage3Ol">
                <li className="LocationPage3Li">대여한 차량은 반드시 대여가 이루어진 지점으로 반납해주세요.</li>
                <li className="LocationPage3Li">반납 시간은 계약서에 명시된 시간을 기준으로 엄수해 주시고 지연 시 추가 요금이 발생할 수 있어요.</li>
                <li className="LocationPage3Li">차량 반납 전 연료 상태 및 차량 내외부 상태를 확인해 주세요.</li>
                <li className="LocationPage3Li">차량 훼손이나 분실물이 확인될 경우, 약관에 따라 별도의 비용이 청구될 수 있어요.</li>
                <li className="LocationPage3Li">교통 상황, 기상 악화 등으로 인한 지연도 반납 시간 초과로 간주될 수 있어요.</li>
                <li className="LocationPage3Li">차량 반납 시 직원의 차량 상태 확인 절차가 진행될 수 있어요.</li>
                <li className="LocationPage3Li">반납 시 차량 키, 스마트키, 주유카드 등 대여 시 제공된 모든 물품을 함께 반환해 주세요.</li>
                <li className="LocationPage3Li">차량 내부에 개인 소지품이 남아있지 않은지 반드시 확인해 주세요. 분실물은 별도 보관 및 책임이 어려울 수 있어요.</li>
                <li className="LocationPage3Li">계약 연장 없이 반납 시간이 초과될 경우 보험 적용에 제한이 발생할 수 있어요.</li>
                <li className="LocationPage3Li">반납 후 추가 요금이 발생한 경우 등록된 결제 수단으로 자동 결제될 수 있어요.</li>
            </ol>
            <div className="LocationPage3BottomDiv">
                {userid?
                    <Link to={'/mypage/booked'}><button className="LocationPage3Btn" onClick={() => window.scrollTo(0,0)}>예약내역</button></Link>
                    :
                    <></>
                }
            </div>
        </div>
        </>
    )
}