import { useState, useContext, useEffect } from "react";

import './AllCarPage.css';

export default function AllCarPage(){


    return(
        <div className="ManagerAllCar">
            <h1>전체 차량 목록</h1>
            <table className="managerAllCar_table">
                <thead className="managerAllCar_th">
                    <tr>
                        <th className="managerAllCar_tableNum">번호</th>
                        <th className="managerAllCar_tableCar">차량</th>
                        <th className="managerAllCar_tableCarNum">차량 번호</th>
                        <th className="managerAllCar_tableCarCode">차량 코드</th>
                        <th className="managerAllCar_tableRegDate">등록일자</th>
                    </tr>
                </thead>
                <tbody className="managerAllCar_tb">
                    <tr>
                        <td>d</td>
                        <td>d</td>
                        <td>d</td>
                        <td>d</td>
                    </tr>
                </tbody>
            </table>
            <div className="btn_part">
                <button className="reg_btn">등록하기</button>
            </div>
        </div>
    )
}