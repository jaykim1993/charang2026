import { useState, useContext, useEffect } from "react";

import './AllReservationPage.css';

export default function AllReservationPage(){



    return(
        <div className="ManagerAllReservation">
            <h1>전체 예약 목록</h1>
            <table className="managerAllReservation_table" border={1}>
                <thead className="managerAllReservation_table_th">
                    <tr>
                        <th className="managerAllRes_tableNum">번호</th>
                        <th className="managerAllRes_tableNum">예약코드</th>
                        <th className="managerAllRes_tableCar">예약 차량</th>
                        <th className="managerAllRes_tableUser">예약자</th>
                        <th className="managerAllRes_tableRentDate">대여 일자</th>
                        <th className="managerAllRes_tableReturnDate">반납 일자</th>
                        <th className="managerAllRes_tableResDate">예약 일자</th>
                        <th className="managerAllRes_tableResDate">예약 일자</th>
                    </tr>
                </thead>
                <tbody className="managerAllReservation_table_tb">
                    <tr>
                        <td>d</td>
                        <td>d</td>
                        <td>d</td>
                        <td>d</td>
                        <td>d</td>
                        <td>d</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}