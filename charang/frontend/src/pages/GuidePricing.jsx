import { useState,useEffect } from "react"
import { useContext } from "react"
import { DataContext } from "../contexts/Datacontext"
import './Guide.css'
import { Link, Outlet } from "react-router-dom"

export default function GuidePricing(){
const {cars}=useContext(DataContext); //데이터받아오기

const [showPage,setShowPage]=useState(true); //기본화면 출력 기본값 true
const showGuideOne=()=>{
    setShowPage(true);
    console.log(showPage)
}
const showGuideTwo=()=>{
    setShowPage(false);
    console.log(showPage)
}

const carsCopy=[...cars] //얕은복사

const uniqueCars = carsCopy.filter((car, index, array) =>   // 얕은복사한거로 중복제거
  index === array.findIndex(carItem => carItem.model === car.model)
);
//=====================================================================================================================
const [selectWhereCar,SetSelectWhereCar]=useState(true); //국내/수입 차량 선택 기본값   국내true 수입false
const selectKorean=()=>{
    SetSelectWhereCar(true);
    SetSelectKoreanSize(1);
    console.log(selectWhereCar);
}
const selectForeign=()=>{
    SetSelectWhereCar(false);
    SetSelectForeignSize(1)
    console.log(selectWhereCar);
}
 //=====================================================================================================================
const [selectKoreanSize, SetSelectKoreanSize]=useState(1); //국내차량 사이즈선택 기본값   소형 1 중형2 대형3 RV4 화물5
const selectKoreanSmall=()=>{  //국내소형선택
    SetSelectKoreanSize(1);
    console.log(selectKoreanSize);
}
const selectKoreanMiddle=()=>{  //국내중형선택
    SetSelectKoreanSize(2);
    console.log(selectKoreanSize);
}
const selectKoreanLarge=()=>{  //국내대형선택
    SetSelectKoreanSize(3);
    console.log(selectKoreanSize);
}
const selectKoreanRV=()=>{  //국내RV선택
    SetSelectKoreanSize(4);
    console.log(selectKoreanSize);
}
const selectKoreanTruck=()=>{  //국내화물선택
    SetSelectKoreanSize(5);
    console.log(selectKoreanSize);
}
//=====================================================================================================================

const [selectForeignSize, SetSelectForeignSize]=useState(1); //수입차량 사이즈선택 기본값   소형 1 중형2 대형3
const selectForeignSmall=()=>{  //수입소형선택
    SetSelectForeignSize(1);
     console.log(selectForeignSize);
}
const selectForeignMiddle=()=>{  //수입중형선택
    SetSelectForeignSize(2);
    console.log(selectForeignSize);
}
const selectForeignLarge=()=>{  //수입대형선택
    SetSelectForeignSize(3);
    console.log(selectForeignSize);
}
//=====================================================================================================================
const KOREAN_BRANDS = ['한대', '크아', '제네러스', 'KGB', '라노', '쉐레보'];
const FOREIGN_BRANDS = ['아우디즈', '빈츠', 'dmw', '렉사드', '테셀라', '볼바즈','복스바그','토유','BYD'];
const SMALL_SIZES = ['소형', '경소형'];

// 사이즈나 타입 별 분류 
const koreanSmall = uniqueCars.filter(item => 
  KOREAN_BRANDS.includes(item.brand) && SMALL_SIZES.includes(item.car_size)
);
const koreanMiddle = uniqueCars.filter(item => 
  KOREAN_BRANDS.includes(item.brand) && item.car_size === '중형'
);
const koreanLarge = uniqueCars.filter(item => 
  KOREAN_BRANDS.includes(item.brand) && item.car_size === '대형'
);
const koreanRV = uniqueCars.filter(item => 
  KOREAN_BRANDS.includes(item.brand) && item.car_type === 'RV'
);
const koreanTruck = uniqueCars.filter(item => 
  KOREAN_BRANDS.includes(item.brand) && item.car_type === '화물'
);
const foreignSmall = uniqueCars.filter(item => 
  FOREIGN_BRANDS.includes(item.brand) && SMALL_SIZES.includes(item.car_size)
);
const foreignMiddle = uniqueCars.filter(item => 
  FOREIGN_BRANDS.includes(item.brand) && item.car_size === '중형'
);
const foreignLarge = uniqueCars.filter(item => 
  FOREIGN_BRANDS.includes(item.brand) && item.car_size === '대형'
);

const getFilteredCars = () => {
        if (selectWhereCar) { // 국내차
            if (selectKoreanSize === 1){return koreanSmall} 
            else if (selectKoreanSize === 2){return koreanMiddle}
            else if (selectKoreanSize === 3){return koreanLarge}
            else if (selectKoreanSize === 4){return koreanRV}
            else if (selectKoreanSize === 5){return koreanTruck}
            else return [];
        } else { // 수입차
            if (selectForeignSize === 1){return foreignSmall}
            else if (selectForeignSize === 2){return foreignMiddle}
            else if (selectForeignSize === 3){return foreignLarge}
            else return [];
        }
    };
    const carListToRender = getFilteredCars();
    const [tdOpen, setTdOpen] = useState(false);
//=================================================


    return(
        <>
        <div>
            <h3>요금안내</h3>
            <div className="guideSelectWhereBox">
                <button className={`guideSelectWhereCar ${selectWhereCar? "active" : ""}`} onClick={selectKorean}>국내</button>
                <button className={`guideSelectWhereCar ${!selectWhereCar? "active" : ""}`} onClick={selectForeign}>수입</button>
            </div>
            <div className="guideSelectCarSize">
                {selectWhereCar?(
                <div className="guideSelectKorCar">
                    <button className={`guideSelectCarSizeBtn ${selectKoreanSize===1?'active':''}`} onClick={selectKoreanSmall}>경소형</button>
                    <button className={`guideSelectCarSizeBtn ${selectKoreanSize===2?'active':''}`} onClick={selectKoreanMiddle}>중형</button>
                    <button className={`guideSelectCarSizeBtn ${selectKoreanSize===3?'active':''}`} onClick={selectKoreanLarge}>대형</button>
                    <button className={`guideSelectCarSizeBtn ${selectKoreanSize===4?'active':''}`} onClick={selectKoreanRV}>승합/RV</button>
                    <button className={`guideSelectCarSizeBtn ${selectKoreanSize===5?'active':''}`} onClick={selectKoreanTruck}>화물</button>
                </div>
                ):(
                <div className="guideSelectForCar">
                    <button className={`guideSelectCarSizeBtn2 ${selectForeignSize===1?'active':''}`} onClick={selectForeignSmall}>소형</button>
                    <button className={`guideSelectCarSizeBtn2 ${selectForeignSize===2?'active':''}`} onClick={selectForeignMiddle}>중형</button>
                    <button className={`guideSelectCarSizeBtn2 ${selectForeignSize===3?'active':''}`} onClick={selectForeignLarge}>대형</button>
                </div>
            )}
            </div>
            <span>차량의 기본 대여 금액과 보험 금액은 차량 브랜드별로 가치를 가지며, </span>
            <p>차량의 연식, 차량 크기, 연료, 옵션 유무에 따라 가격이 계산됩니다.</p>
            <div className={`LoTableWrap ${tdOpen ? 'open' : ''}`}>
                <table className="guideTable">
                    <thead className="guideThead">
                        <tr className="guideTr">
                            <th className="guideTh">차종</th>
                            <th className="guideTh">기본 요금 (30분)</th>
                            <th className="guideTh">보험 요금 (24시간)</th>
                        </tr>
                    </thead>
                    <tbody className="guideTbody">
                    {carListToRender.length > 0 ? (
                        carListToRender.map((car) => (
                        <tr key={car.id}>
                            <td className="guideTd">{car.model}</td>
                            {/* 시간당 요금 (3000 * price_value) */}
                            <td className="guideTd">{(700 * car.price_value)}원</td>
                            {/* 하루 완전 자차 보험료 */}
                            <td className="guideTd">{(200 *48* car.price_value)}원</td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td>조회 가능한 차량이 없습니다. 다시 선택해주세요.</td>
                        </tr>
                        )}
                    </tbody>
                </table>
                </div>
                <button className="tableOpener" onClick={() => setTdOpen(!tdOpen)}>
                    {tdOpen ? '접기' : '더보기'}
                </button>
                <div className="guideGoToBookBox">
                    <Link to='/searchcarlist'className="guideGoToBook"  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>예약하러가기</Link>
                </div>
        </div>
        </>
    )
}