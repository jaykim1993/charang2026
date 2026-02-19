import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../contexts/Authcontext";
import { Link, useNavigate } from "react-router-dom"; // 차량 클릭시 serchcarlist ,12.23 성중
import { BookingContext } from "../contexts/Bookingcontext";
import { useEffect } from "react";

import './Recentcarlist.css';

export default function Recentcarlist() {
  const { userid } = useContext(AuthContext);
  const { myRecentlist } = useContext(BookingContext);
  const navigate = useNavigate(); // 차량 클릭시 serchcarlist 12.23 성중

  // 화면에 출력되는 차량의 수
  const [viewMore, setViewMore] = useState(8);
  // 더보기 toggle
  // const [isMore, setIsMore] = useState(true);
  // // 숨기기 toggle
  // const [isHidden, setIsHidden] = useState(false);
  
  // const moreHandler = () => {
  //   if(recentViews.length > viewMore){
  //     setViewMore(prev => prev+8);
  //     setIsHidden(true);
  //   }else if(viewMore > recentViews.length){
  //     setViewMore(false);
  //     setIsHidden(true);
  //   }else{
  //     setIsMore(true);
  //     setIsHidden(false);
  //   }
  // };

  const moreHandler = () => {
    setViewMore(prev => prev + 8);
  };

  const hiddenHandler = () => {
    setViewMore(8); // 기본 8개로 접기
  };
  
  const recentViews = myRecentlist(userid);

  // 해당 차량 브랜드 searchcarlist로 넘기기 12.23 성중
  const goToSearchcarlist = (model) => {
    navigate("/searchcarlist", {
      state: { model }
    });
  };

  useEffect(() => {
  window.scrollTo(0, 0);
  }, []);

const [recentView, setRecentView] = useState([]);

  useEffect(() => {
  const raw = localStorage.getItem("recentView");
  if (raw) {
    setRecentView(JSON.parse(raw));
  }
  }, []);

  //삭제
  const removeRecentView = (carId) => {
  setRecentView(prev => {
    const filtered = prev.filter(
      item => !(item.userid === userid && item.car_id === carId)
    );

    localStorage.setItem("recentView", JSON.stringify(filtered));
    return filtered;
  });
  };
//

  return (
    <div className="Recent_car_list">

      <div className="Recent_Head">
          <Link to={'/'}><span style={{color:'rgb(160, 160, 160)'}}>홈</span></Link>
          <i class="bi bi-caret-right-fill"></i>
          <span>최근 본 차량</span>
      </div>

      <p>총&nbsp;<strong>{recentView.length}</strong>&nbsp;대</p>
      {recentView.length > 0?
      <ul className="Recent_ByDate">
        {recentView.slice(0,viewMore).map(item => (
          // 해당 차량 브랜드 searchcarlist로 넘기기 12.23 성중
          <div className="hihihihi">
            <div className="RecentDelBox">
                <button className="RecentDel"><i  onClick={() => removeRecentView(item.car_id)} className="bi bi-x"></i></button>
            </div>
            <li className="Recent_ByDate" key={item.id} >
            <div className="Recent_car_item" onClick={()=>goToSearchcarlist(item.model)}>
              <img className="Recent_logo" src={`/images/brands/${item.brand}.png`}/>
              <img
                src={`/images/cars/${item.car_img}`}
                alt={item.model}
                className="Recent_car_img" />
              <p className="Recent_car_p"> {item.model} <span className="Recent_car_span">{item.fuel_type}</span></p>
              <p className="RecentCar_viewDate">최근 본 날짜 : {item.viewDate.replaceAll('-','.')}</p>
            </div>
          </li>
          </div>
        ))}
      </ul>
      :
      <div className="noRecentCar">
        <span>최근 본 차량이 없습니다.</span>
      </div>
      }
      
      {/* 버튼 영역 8개보다 많으면 생기게 */}
      <div className="Recent_buttons">
        {viewMore < recentViews.length && (
          <button onClick={moreHandler} ><i className="bi bi-chevron-down"></i></button>
        )}
        {viewMore > 8 && (
          <button onClick={hiddenHandler}><i className="bi bi-chevron-up"></i></button>
        )}
      </div>

    </div>
  );
}
