import './Mypage.css'
import { Outlet } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../contexts/Authcontext";
import "./Mypage.css";

export default function Mypage() {
  const { username } = useContext(AuthContext);

  return (
    <div className="guideWrap">
      <div className="guideFlex">
        <div className="guideLeft">
          <h2 className="guideSideText"><div className='loginColor'>{username}</div>님,</h2>
          <h2 className="guideSideText">안녕하세요!</h2>
          <NavLink to='myinfo'><span className='MyPageSideMenus'>내정보</span></NavLink>
          <NavLink to='booked'><span className='MyPageSideMenus'>예약내역</span></NavLink>
          <NavLink to='recent'><span className='MyPageSideMenus'>최근본차량</span></NavLink>
          <NavLink to='inquiry'><span className='MyPageSideMenus'>문의내역</span></NavLink>
        </div>
        <div className="guideRight">
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}