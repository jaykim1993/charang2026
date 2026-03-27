import './GraphPage.css';
import { useState, useEffect } from "react";

export default function GraphPage() {

    const [graphBtn, setGraphBtn] = useState(4)
    const images = {
        4: "/graph/그래프4.png",
        5: "/graph/그래프5.png",
        6: "/graph/그래프6.png",
        7: "/graph/그래프7.png",
    };
    const graphText = {
        4: "월별 매출액",
        5: "월별 예약건수",
        6: "대여시간별 추이",
        7: "시간대별 이용량",
    };


    const table = (num) => {
   const graph = [
    {type: 'fa-solid fa-chart-pie', source: ['user', 'booking'], 
        content: '전체 예약 데이터를 연령대별로 분류하여 각 연령대가 차지하는 비중을 도넛 차트로 시각화, 연령대별 예약 점유율을 비교할 수 있다.\n\n· 20~40대 약 87% 차지, 50대 이상은 약 12%로 저조\n· 젊은 층 타겟 마케팅 강화 및 50대 이상 맞춤 프로모션 기획에 활용'},
    {type: 'fa-solid fa-chart-simple', source: ['user', 'booking', 'car'],
        content: '연령대별 선호 차종을 누적 막대 그래프로 시각화하여 경차·중형·대형 차종 선호도를 한눈에 비교할 수 있다.\n\n· 연령이 높아질수록 경차 비율 감소, 대형 차량 선호도 증가\n· 수요 패턴을 기반으로 신규 입고 차량 선정 및 타겟 마케팅에 활용'},
    {type: 'fa-solid fa-chart-line', source: ['user'],
        content: '월별 신규 가입자 수 추이를 꺾은선 그래프로 시각화하여 유입 증감 패턴을 월 단위로 확인할 수 있다.\n\n· 2025년 7월 급증 후 8월 급락하는 등 월별 유입 편차가 뚜렷하게 나타남\n· 저조한 달 조기 식별 후 프로모션·이벤트 기획, 급증 시기 성공 요인 반복 적용에 활용'},
    {type: 'fa-solid fa-chart-line', source: ['booking'],
        content: '월별 매출액 추이를 꺾은선 그래프로 시각화하여 성수기·비수기 매출 흐름을 파악할 수 있다.\n\n· 7월·12월 피크, 2월·9월 저조 패턴 반복, 26년 들어 전반적 회복세 확인\n· 성수기 차량·인력 선제 대응 및 비수기 프로모션·장기 대여 이벤트 기획에 활용'},
    {type: 'fa-solid fa-chart-line', source: ['booking'],
        content: '월별 예약건수 추이를 꺾은선 그래프로 시각화하여 예약 수요의 계절적 변동 패턴을 확인할 수 있다.\n\n· 7월 피크 후 급감 패턴 반복, 26년 하반기 꾸준한 증가세 확인\n· 비수기 사전 프로모션 기획 및 차량·인력 확대 시점 판단에 활용'},
    {type: 'fa-solid fa-chart-line', source: ['booking'],
        content: '대여 이용 시간대별 분포를 꺾은선 그래프로 시각화하여 단기·장기 대여 수요 패턴을 파악할 수 있다.\n\n· 12~16시간 구간 최다, 단기 수요 집중 / 48시간 이상 장기 수요도 유효\n· 단기·장기 요금제 구성 및 차량 회전율 최적화 전략 수립에 활용'},
    {type: 'fa-solid fa-chart-line', source: ['booking'],
        content: '시간대별 누적 이용량을 꺾은선 그래프로 시각화하여 차량 수요가 집중되는 피크 시간대를 파악할 수 있다.\n\n· 21~22시 이용량 최고조, 오전 5시 이후 점진적 증가 패턴 확인\n· 피크 시간대 배차·반납 집중 관리 및 심야·새벽 수요 분산 전략에 활용'},
    {type: 'fa-solid fa-chart-pie', source: ['car', 'booking'],
        content: '브랜드별 예약 점유율을 도넛 차트로 시각화하여 브랜드 간 수요 비중을 한눈에 비교할 수 있다.\n\n· 한대·테셀라·크아 상위 3개 브랜드가 약 65% 차지\n· 수요 높은 브랜드 우선 확보 및 저점유 브랜드 보유 필요성 재검토'},
    {type: 'fa-solid fa-chart-bar', source: ['car', 'booking'],
        content: '예약 건수 상위 9개 모델을 가로 막대 그래프로 시각화하여 인기 차종 순위를 한눈에 확인할 수 있다.\n\n· 상위 모델에 수요가 집중되며 하위 모델과 예약 건수 차이가 뚜렷함\n· 인기 모델 우선 확보, 하위 모델은 배치 및 프로모션 전략 재검토'},
    {type: 'fa-solid fa-chart-simple', source: ['branch', 'booking', 'car'],
        content: '지점별 예약 상위 브랜드를 누적 막대 그래프로 시각화하여 지점 간 브랜드 수요 차이를 비교할 수 있다.\n\n· 지점별 선호 브랜드가 상이하며 수요 쏠림 현상이 뚜렷하게 나타남\n· 브랜드 맞춤 배치로 예약률 향상 및 불필요한 차량 이동 비용 절감'},
]
        return (
            <div className="graphComment">
                <table className="graphTable">
                    <tbody className="graphTb">
                        <tr className="graphTr">
                            <td className="graphTdTitle">
                                차트 타입
                            </td>
                            <td className="graphTd">
                                <i className={graph[num].type}></i>
                            </td>
                        </tr>
                        <tr className="graphTr">
                            <td className="graphTdTitle">
                                {/* Raw Data */}
                                데이터 소스
                            </td>
                            <td className="graphTd">
                                {graph[num].source.map(item => (
                                    <span key={item}>{item}</span>
                                ))
                                }
                            </td>
                        </tr>
                        <tr className="graphTr">
                            <td className="graphTdTitle">
                                데이터 인사이트
                                {/* Data Analysis */}
                            </td>
                            <td className="graphTd">
                                {graph[num].content}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
const [now, setNow] = useState(new Date());

useEffect(() => {
    const timer = setInterval(() => {
        setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
}, []);

const startDate = new Date("2025-01-01");
const diff = now - startDate;
const dDay = Math.floor(diff / (1000 * 60 * 60 * 24));
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');

    return (
        <div className='graphBack'>
            <div className="ManagerGraph">
                <h1>통계 대시보드</h1>
                <p className='lastUpdate'>
                    <i className="bi bi-exclamation-circle-fill"></i>
                    &nbsp;&nbsp;마지막 업데이트 : 2026-03-26</p>
                <div className='dayBox'>
                    <div className='dDay'>{dDay}</div> : 
                    <div className='hours'>{hours}</div> : 
                    <div className='minutes'>{minutes}</div> : 
                    <div className='seconds'>{seconds}</div>
                </div>
                <div className='graphSection'>
                    <div className='graphSectionDiv1'>
                        <h4>회원 통계</h4>
                        <hr />
                        <div className='gsd'>
                            <div className='gsdd'>
                                <span>연령대별 예약 점유율</span>
                                <img className='graphImg1' src='/graph/그래프1.png' />
                                {table(0)}
                            </div>
                            <div className='gsdd'>
                                <span>연령대별 선호 차종</span>
                                <img className='graphImg2' src='/graph/그래프2.png' />
                                {table(1)}
                            </div>
                        </div>
                        <div className='gsdd'>
                            <span>월별 가입자 수</span>
                            <img className='graphSectionDiv1_3' src='/graph/그래프3.png' />
                            {table(2)}
                        </div>
                    </div>

                    <div>
                        <div className='graphSectionDiv3'>
                            <h4>예약 통계</h4>
                            <hr />

                            {[4, 5, 6, 7].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setGraphBtn(num)}
                                    className={graphBtn === num ? "active" : ""}
                                >
                                    {graphText[num]}
                                </button>
                            ))}
                            <div className='gsdd'>
                                <span>{graphText[graphBtn]}</span>
                                <img src={images[graphBtn]} />
                                {table(graphBtn-1)}
                            </div>
                        </div>
                    </div>

                    <div className='graphSectionDiv4'>
                        <h4>차량 통계</h4>
                        <hr />

                        <div className='gsd'>
                            <div className='gsdd'>
                                <span>브랜드별 예약 점유율</span>
                                <img src='/graph/그래프8.png' />
                                {table(7)}
                            </div>
                            <div className='gsdd'>
                                <span>모델별 예약 순위 </span>
                                <img src='/graph/그래프9.png' />
                                {table(8)}
                            </div>
                        </div>
                    </div>

                    <div className='graphSectionDiv5'>
                        <h4>지점 통계</h4>
                        <hr />
                        <div className='gsdd'>
                            <span>지점별 예약 상위 브랜드</span>
                            <div className='gsddd'>
                                <img src='/graph/그래프10.png' />
                                {table(9)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}