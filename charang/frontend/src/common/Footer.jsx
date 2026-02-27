import './Footer.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from "react";
import { BookingContext } from "../contexts/Bookingcontext";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/Authcontext';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Footer(){

const { myRecentlist } = useContext(BookingContext);
const { userid } = useContext(AuthContext);
const navigate = useNavigate();
const recentViews = myRecentlist(userid);
const [totop,setTotop]=useState(false);
const [notice,setNotice]=useState([]);
const [noticeDetail,setNoticeDetail]=useState("");
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
        navigate('/mypage/recent');
    }

    //공지사항  전체목록에서 noticeId 제일 높은거(제일최신) 공지 찾아서 담기
    useEffect(() => {
      axios.get('/api/customerservice/notice')
    .then(res => {
      const noticeList = res.data.list;
      const latest = noticeList.reduce((max, current) =>
        current.noticeId > max.noticeId ? current : max
      );
      setNotice(latest);
      setNoticeDetail(`/customerservice/notice/Info/${latest.noticeId}`)

    })
    .catch(err => console.log(err));
    }, []);
    console.log("최신 공지",notice)
    console.log("최신공지배열",noticeDetail)

    


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
                            src={`/images/cars/${recentViews[0].carImg}`}
                            alt="최근 본 차량"
                            />
                        </button>
                    </div>
                )}
            </div>
            <div className='Footer'>
                    <ul className='footerNoticeBox'>
                      <li className='footerno1'> 
                        <i className="fa-solid fa-bullhorn"></i>공지사항
                      </li>
                        <li className='gotoRecentNotice' onClick={()=>navigate(noticeDetail)}>
                            {notice.title}({notice.regDate})
                        </li>
                        <li className='allNotice' onClick={()=>navigate("/customerservice/notice")}>
                          전체보기 <i className="bi bi-plus-lg"></i>
                        </li>
                    </ul>
                <div className='Footer_Top'>
                        <span className='footerSlogan'>가고 싶은 곳 어디든, 차랑차랑</span>
                        <img src='/charangcharang_logo_white.png' alt='차랑차랑 로고 이미지' />
                    {/* 푸터 섹션 */}
                    <div className='Footer_sec'>
                        {/* 좌측 - 회사정보 */}
                        <div className='F_info'>
                            <ul className='F_infoUl'>
                                <li className='F_infoLi01'>
                                    <Link to="/guide/branch" className='footerLink'>지점안내</Link>
                                    <Link to="/guide/inventory" className='footerLink'>차량보유현황</Link>
                                    <Link to="/guide/return" className='footerLink'>차량반납안내</Link>
                                    <Link to="/guide/rental" className='footerLink'>대여안내</Link>
                                    <Link to="/guide/pricing" className='footerLink'>요금안내</Link>
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
                                    </div>
                                </div>
                            </ul>
                        </div>

                        {/* 우측 - 고객센터 */}
                        <div className='F_support'>
                            <p>차랑차랑 고객센터</p>
                            <h4>910-1112</h4>
                            <hr className='F_hr'/>
                            <p>평일 : 09:00 ~ 18:00</p>
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