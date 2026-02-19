import './Footer.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from "react";
import { BookingContext } from "../contexts/Bookingcontext";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/Authcontext';

export default function Footer(){

const { myRecentlist } = useContext(BookingContext);
const { userid } = useContext(AuthContext);
const navigate = useNavigate();
const recentViews = myRecentlist(userid);

const [totop,setTotop]=useState(false);

const [moverecentcar,setMoverecentcar]=useState(false);

//1000이상 스크롤하면 위로가기 버튼 생성
useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1000) {
        setTotop(true);
      } else {
        setTotop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

// 1000이상 가면 최근본차량 바로가기 이미지 위로 밀리게
useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 1000) {
      setMoverecentcar(true);
    } else {
      setMoverecentcar(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

    const gotoRecentsideBtn=()=>{
        navigate('/recent');
    }



    return(

        <div className='FooterContainer' style={{userSelect:'none'}}>
            {totop?
            <div className="FooterScrollToTop">
                <button type="button" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}><i className="bi bi-arrow-up-short"></i></button>
            </div>:null
            }
            <div className="FooterShowRecent" style={{bottom:`${moverecentcar?`150px`:`80px`}`}}>
                 {recentViews?.length > 0 && (
                    <div className="recentWrapper">
                        <div className="recentTooltip">최근 본 차량</div>
                        <button type="button" onClick={gotoRecentsideBtn}>
                            <img
                            src={`/images/cars/${recentViews[0].car_img}`}
                            alt="최근 본 차량"
                            />
                        </button>
                    </div>
                )}
            </div>
            <div className='Footer'>
                <div className='Footer_Top'>
                    <img src='/charangcharang_logo_white.png' alt='차랑차랑 로고 이미지' />
                    {/* 푸터 섹션 */}
                    <div className='Footer_sec'>
                        {/* 좌측 - 회사정보 */}
                        <div className='F_info'>
                            <ul className='F_infoUl'>
                                <li className='F_infoLi01'>
                                    <p>회사소개</p>
                                    <p>서비스 이용약관</p>
                                    <p><strong>개인정보처리방침</strong></p>
                                    <p>이메인무단수집거부</p>
                                    <p>비지니스</p>
                                    <p>금융소비자보호</p>
                                    <p>웹사이트제작 2조</p>
                                </li>
                                <div className='F_infoLi02flex'>
                                    <div className='F_infoLi02'>
                                        <p><strong>차랑차랑㈜</strong> | 서울 마포구 신촌로 104 4층</p>
                                        <p>대표이사 <strong>정해연</strong> | 차빌려조</p>
                                        <p>대표번호 1234-5678</p>
                                    </div>
                                    <div className='F_infoLi02'>
                                        <p>사업자등록번호 214-87-79183</p>
                                        <p>통신판매업신고번호 제2010-경기안양-420호</p>
                                        <p>이메일 charangcharang@green.com</p>
                                    </div>
                                    <div className='F_infoLi02'>
                                        <p>평일 09:00 ~ 18:00 (주말·공휴일 휴무)</p>
                                        <p>24시간 온라인 예약 가능</p>
                                    </div>
                                </div>
                            </ul>
                        </div>

                        {/* 우측 - 고객센터 */}
                        <div className='F_support'>
                            <p>차랑차랑 고객센터</p>
                            <h4>910-1112</h4>
                            <hr className='F_hr'/>
                            <p>평일 : 09 ~ 18 시</p>
                            <p>사고/정비/긴급출동 24시간 접수 가능</p>
                        </div>
                    </div>
                </div>
                {/* copyright */}
                <div className='F_copyright'>
                    <p>Copyright© 2025 차랑차랑 All rights Reserved</p>
                </div>
            </div>
        </div>
    )
}