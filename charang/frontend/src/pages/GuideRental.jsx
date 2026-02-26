export default function GuideRental() {
    return (
        <div className="GuideRental">
            <h3 className="daaae">대여안내</h3>
            <div className="GuideRental_head">
                <p>차랑차랑렌터카 사용예약을 위해 고객님께서는 아래 절차대로 진행해 주세요.</p>
                <p>온라인으로 예약이 어려우신 경우 지점을 방문하시거나
                     전화로 예약이 가능합니다. (고객센터 : 910-1112)</p>
            </div>
            <div className="guideRentalProcessImg">
                <img src="/images/guideimgs/guide_1_1.jpg" />
            </div>
            <div className="guideSecond">
                <h3 className="guideSecondExplain">대여 중 사고시 보상범위</h3>
                <table className="guidetable1">
                    <tbody>
                        <tr>
                            <th className="guidetable1th">대인</th>
                            <td className="guidetable1td">무한대</td>
                        </tr>
                        <tr>
                            <th className="guidetable1th">대물</th>
                            <td className="guidetable1td">사고 건당 2천만원 한도</td>
                        </tr>
                        <tr>
                            <th className="guidetable1th">자손</th>
                            <td className="guidetable1td">
                                · 인당 1천5백만원 한도<br />
                                · 사고 건당 1억5천만원 한도
                            </td>
                        </tr>
                    </tbody>
                </table>
                <span className="guideSecondExplainDetail">계약서상 등록되지 않은 운전자는 종합보험혜택을 받으실 수 없어요.</span>
            </div>
            <div className="guideThird">
                <h3 className="guideThirdExplain">보험(차량손해면책제도)</h3>
                <p className="guideThirdExplainDetail">보험 가입 시 고객님의 귀책으로 인한 자차사고에 대해 보상을 받을 수 있는 제도예요.</p>
                <table className="guidetable2">
                    <tbody>
                        <tr className="guidetable2tr">
                            <th className="guidetable2th">구분</th>
                            <th className="guidetable2th">국산 · 수입차량</th>
                        </tr>
                        <tr className="guidetable2tr">
                            <td className="guidetable2td">선택안함</td>
                            <td className="guidetable2td">전액</td>
                        </tr>
                        <tr className="guidetable2tr">
                            <td className="guidetable2td">일반자차</td>
                            <td className="guidetable2td">30만원</td>
                        </tr>
                        <tr className="guidetable2tr">
                            <td className="guidetable2td">완전자차</td>
                            <td className="guidetable2td">면제</td>
                        </tr>
                    </tbody>
                </table>
                <span className="guideThirdExplainDetail">단, 대여차량 계약 시 선택한 보험 종류에 따라 고객 부담금(면책금)이 차등 적용돼요.</span>
                <span className="guideThirdExplainDetail">보험을 선택하지 않으면 사고 시 모든 비용을 부담해야 해요.</span>
            </div>
            <div className="guideFourth">
                <h3 className="guideFourthExplain">사고처리</h3>
                <p className="guideFourthExplainDetail">예기치 못한 사고발생! 당황하지 마세요.</p>
                <div className="guide4service-card">
                    <div className="guide4service-item">
                        <div className="guide4title">ONE STOP</div>
                        <div className="guide4content">서비스</div>
                    </div>
                    <div className="guide4service-item">
                        <div className="guide4title">사고처리 접수</div>
                        <div className="guide4content">1599-9111</div>
                    </div>
                    <div className="guide4service-item">
                        <div className="guide4title">긴급출동</div>
                        <div className="guide4content">서비스</div>
                    </div>
                </div>
                <span className="guideFourthExplainDetail">사고 및 고장 발생 시 사고접수(<i className="bi bi-telephone-fill"></i>1599-9111) 전화주세요.</span>
                <span className="guideFourthExplainDetail">고객님의 안전을 위해 사고처리 전문가가 신속하게 상담해드릴게요.</span>
                <span className="guideFourthExplainDetail">단 교통법규 위반, 음주운전 등으로 인해 사고발생 시 보상의 범위가 좁혀질 수 있어요.</span>
            </div>
            <div className="guideFifth">
                <h3 className="guideFifthExplain">대여 시 유의사항</h3>
                <img src="/images/guideimgs/guide_1_5.JPG" />
                <span className="guideFifthExplainDetail">대여 당일 차량인수 시 운전면허증 지참은 필수입니다.(도로교통법상 유효한 운전면허소지자)</span>
                <span className="guideFifthExplainDetail">사전 동의 없이 임의로 연장해 사용하실 경우 차량 손해에 대해 보상 및 면책을 받지 못할 수 있으니,
                    이용 연장 시 반드시 약속된 반납 시간 이전에 대여지점으로 연락바랍니다.</span>
                <span className="guideFifthExplainDetail">금지행위(음주/무면허 등)으로 인한 사고 발생시 보험 혜택 적용이 불가합니다.</span>
            </div>
        </div>
    )
}