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


  const moreHandler = () => {
    setViewMore(prev => prev + 6);
  };

  const hiddenHandler = () => {
    setViewMore(6); // 기본 8개로 접기
  };


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
    setRecentView(myRecentlist(userid));
  }, [userid, myRecentlist]);

  const removeRecentView = (carId) => {
    const raw = localStorage.getItem("recentView");
    if (!raw) return;

    const parsed = JSON.parse(raw);

    const filtered = parsed.filter(
      item => !(item.userid === userid && item.carId === carId)
    );

    localStorage.setItem("recentView", JSON.stringify(filtered));
    setRecentView(myRecentlist(userid));
  };

  return (
    <>
      <div className="myinfo-header">
        <h4>최근 본 차량</h4>
      </div>
      <div className="Recent_car_list">
        <p>총&nbsp;<strong>{recentView.length}</strong>&nbsp;대</p>
        {recentView.length > 0 ?
          <ul className="Recent_ByDate">
            {recentView.slice(0, viewMore).map(item => (
              // 해당 차량 브랜드 searchcarlist로 넘기기 12.23 성중
              <div className="hihihihi" key={item.carId}>
                <div className="RecentDelBox">
                  <button className="RecentDel"><i onClick={() => removeRecentView(item.carId)} className="bi bi-x"></i></button>
                </div>
                <li className="Recent_ByDate"  >
                  <div className="Recent_car_item" onClick={() => goToSearchcarlist(item.model)}>
                    <img className="Recent_logo" src={`/images/brands/${item.brandLogo}`} />
                    <img
                      src={`/images/cars/${item.carImg}`}
                      alt={item.model}
                      className="Recent_car_img" />
                    <p className="Recent_car_p"> {item.model} <span className="Recent_car_span">{item.fuelType}</span></p>
                    <p className="RecentCar_viewDate">최근 본 날짜 : {new Date(item.viewed_at).toLocaleDateString('ko-KR')}</p>
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
          {viewMore < recentView.length && (
            <button onClick={moreHandler}>
              <i className="bi bi-chevron-down"></i>
            </button>
          )}
          {viewMore > 6 && (
            <button onClick={hiddenHandler}>
              <i className="bi bi-chevron-up"></i>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
