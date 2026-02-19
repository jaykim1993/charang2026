import './CarRegPage.css';

export default function CarRegPage(){

    return(
        <div className="carRegPage">
            <h1>차량 등록</h1>
            <table className="car_reg_table">
                <tbody className="car_reg_tbody">
                    <tr>
                        <td>브랜드</td>
                        <td>
                            <input type="text" name="brand" placeholder='예) 제네러스'/>
                        </td>
                    </tr>
                    <tr>
                        <td>브랜드 로고 이미지</td>
                        <td>
                            로고 이미지
                        </td>
                    </tr>
                    <tr>
                        <td>모델명</td>
                        <td>
                            <input type="text" name="model" placeholder='예) GG80'/>
                        </td>
                    </tr>
                    <tr>
                        <td>차량 이미지</td>
                        <td>
                            carImg
                        </td>
                    </tr>
                    <tr>
                        <td>색상</td>
                        <td>
                            <input type="text" name="color" placeholder='예) white'/>
                        </td>
                    </tr>
                    <tr>
                        <td>차량 번호</td>
                        <td>
                            <input type="text" name="plateNumber" placeholder='예) 00호0000'/>
                        </td>
                    </tr>
                    <tr>
                        <td>연식</td>
                        <td>
                            <input type="text" name="modelYear" placeholder='예) 2026'/>
                        </td>
                    </tr>
                    <tr>
                        <td>지점 코드</td>
                        <td>
                            <select>
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
                            <select>
                                <option value={1}>1종</option>
                                <option value={2}>2종</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>최소나이</td>
                        <td>
                            <input type="number" name="driverMinAge"/>
                        </td>
                    </tr>
                    <tr>
                        <td>연비</td>
                        <td>
                            <input type="text" name="kmPer"/>
                        </td>
                    </tr>
                    <tr>
                        <td>브랜드 가중치</td>
                        <td>
                            <input type="number" name="priceValue"/>
                        </td>
                    </tr>
                    <tr>
                        <td>좌석 수</td>
                        <td>
                            <input type="number" name="seats"/>
                        </td>
                    </tr>
                    <tr>
                        <td>차량 크기</td>
                        <td>
                            <select>
                                <option value={"경소형"}>1종</option>
                                <option value={"대형"}>1종 대형</option>
                                <option value={"중형"}>2종</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>차량 타입</td>
                        <td>
                            <select>
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
                            <select>
                                <option value={"하이브리드"}>하이브리드</option>
                                <option value={"휘발유"}>휘발유</option>
                                <option value={"경유"}>경유</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>네비게이션</td>
                        <td>
                            <select>
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>후방카메라</td>
                        <td>
                            <select>
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>열선시트</td>
                        <td>
                            <select>
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>핸들열선</td>
                        <td>
                            <select>
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>블루투스</td>
                        <td>
                            <select>
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>스마트키</td>
                        <td>
                            <select>
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>썬루프</td>
                        <td>
                            <select>
                                <option value={1}>유</option>
                                <option value={0}>무</option>
                            </select>
                        </td>
                    </tr>
                    
                </tbody>
            </table>
        </div>
    )
}