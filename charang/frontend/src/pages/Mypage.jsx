import './Mypage.css'
import { Outlet } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../contexts/Authcontext";
import "./Mypage.css";

export default function Mypage(){
  const { username } = useContext(AuthContext); 

  
  // 예약차량 예외처리
  // if (!userid) return <p>로그인 후 이용해주세요.</p>;
  // if (!myBookings.length) return <p>예약내역이 없습니다.</p>;
  // 위에 방어코드 있으면 화면 전체 렌더오류 발생 헤더랑 푸터만남음
  // !myBookings.length 
//
  return(
    <div className="guideWrap">
      <div className="guideTop">
        <div><Link to={'/'} className="guideGoToHome">홈</Link></div>
        <span><i className="bi bi-caret-right-fill"></i></span>
        <div>마이페이지</div>
      </div> 
      <div className="guideFlex">
        <div className="guideLeft">
          <h2 className="guideSideText"><div className='loginColor'>{username}</div>님,</h2>
          <h2 className="guideSideText">안녕하세요!</h2>
          <Link to='myinfo'><span className='MyPageSideMenus'>내 정보</span></Link>
          <Link to='booked'><span className='MyPageSideMenus'>예약내역</span></Link>
          <Link to='recent'><span className='MyPageSideMenus'>최근 본 차량</span></Link>
          <Link to='inquiry'><span className='MyPageSideMenus'>1:1 문의내역</span></Link>
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