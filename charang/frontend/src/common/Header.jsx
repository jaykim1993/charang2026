import './Header.css';
import { useContext, useState,useEffect } from 'react';
import { AuthContext } from '../contexts/Authcontext';
import { BookingContext } from "../contexts/Bookingcontext";
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import JoinFormA from '../pages/Join/JoinFormA';
import JoinFormB from '../pages/Join/JoinFormB';
import JoinFormC from '../pages/Join/JoinFormC';

export default function Header() {
    // login 관련 변수&함수 불러오기
    const{userid , username, logout} = useContext(AuthContext);
    // 예약내역 보기 함수 호출
      const { myBookings } = useContext(BookingContext); 

    // logout 핸들러 함수
    const logoutHandler = () => {
        logout();
        alert("로그아웃 되었습니다. 메인페이지로 이동합니다.");
    };

    // 로그인 & 회원가입 모달 상태 관리
    const { modal, setModal, loginNeeded } = useContext(AuthContext); // 값 : 'login' | 'joinA' | 'joinB' | 'joinC' | null
    const [joinData, setJoinData] = useState({ userid:'', userpw:'' });

    // 회원 가입 완료 직후 로그인 페이지 열기 함수
    const handleJoinComplete = () => {
        setModal('login'); // 로그인 모달 열기
    };

    // 사이드네비게이션 활성화 상태 변수 (초기값 false)
    const [isNavOpen, setIsNavOpen] = useState(false);

    // 사이드 메뉴 오픈 함수
    const openNav = () => {
        setIsNavOpen(true)
    };

    // 사이드 메뉴 닫기 함수
    const closeNav = () => {
        setIsNavOpen(false)
    };

    // 예약 차량 토글 보이기
    const [openUserBookedModal, setOpenUserBookedModal] = useState(false);
    const closeModal =() => {
        setOpenUserBookedModal(false)
    };



// const userID = "admin";

    return (
        <div className='headerWrap'>
            <header className="header">
                <div className='headerflex' >
                    <div>
                        <button 
                            className='headerBtnCate' 
                            onClick={isNavOpen ? closeNav : openNav}
                        >
                            <i className="bi bi-list"></i>
                        </button>

                    </div>
                    
                    <Link to="/">
                        <img className='headerLogo animate-logo' src='/charangcharang_logo_white.png'/>
                    </Link>
                    
                    <nav className="headerNavTop">
                        <Link to="/">
                            <button className='headerBtn' type='text'>
                                <i className="bi bi-house-door-fill"></i>
                            </button>
                        </Link>
                                {userid
                                ? userid == "admin"
                                ? (
                                    // 관리자일 때
                                    <>
                                    <div className='header-managerBtn-wrap'>
                                        <button className='headerBtn' type='text'>
                                            관리자 메뉴
                                        </button>
                                        <div className="header-manager-dropdown-menu">
                                            <Link to="/" className='item'>차량관리</Link>
                                            <Link to="/" className='item'>회원관리</Link>
                                            <Link to="/" className='item'>예약관리</Link>
                                            <Link to="/" className='item'>공지사항</Link>
                                            <Link to="/" className='item'>1:1 문의</Link>
                                        </div>
                                    </div>
                                    <Link to="/">
                                        <button className='headerBtn' type='text' onClick={logoutHandler}>
                                        로그아웃
                                        </button>
                                    </Link>
                                    </>
                                )
                                : (
                                    // 일반 로그인 사용자일 때
                                    <>
                                    <Link to={'/mypage/myinfo'}>
                                        <button className='headerBtn' type='text'>
                                        <strong>
                                            <div style={{color:'white', display:'inline-block'}}>{username}</div>
                                        </strong>님
                                        </button>
                                    </Link>
                                    <button
                                        className='headerBtn'
                                        onClick={() => setOpenUserBookedModal(!openUserBookedModal)}
                                        type='text'
                                    >
                                        예약내역
                                    </button>
                                    <Link to="/">
                                        <button className='headerBtn' type='text' onClick={logout}>
                                        로그아웃
                                        </button>
                                    </Link>
                                    </>
                                )
                                : (
                                // 로그인 안 한 상태
                                <>
                                    <button className='headerBtn' type='text' onClick={() => setModal('login')}>
                                    로그인
                                    </button>
                                    <button className='headerBtn' type='text' onClick={() => setModal('joinA')}>
                                    회원가입
                                    </button>
                                </>
                                )
                            }
                    </nav>
                </div>
                {/* 예약 내역 헤더 모달 */}
                {userid? 
                    <div className={`headerUserBookedModal ${openUserBookedModal? "open":""}`}>
                        <div className='headerModalH'>
                            <strong className='loginColor'>
                                {username}
                            </strong>님의 예약내역
                        </div>
                        <button className="headerModalBtnX" onClick={closeModal}>
                            <i className="bi bi-x"></i>
                        </button>
                        <div className='headerUserBookModalContext'>
                            {(myBookings.length)===0? 
                                    <p className='headermodalText'>예약내역이 없습니다.</p>
                                    : <>{myBookings.map(book => (
                                    <Link to={'/mypage/booked'} key={book.id}>
                                        <div className="headerModalInfo">
                                            <img
                                                style={{width:'80px', height:'60px'}}
                                                src={`/images/cars/${book.car?.car_img}`}
                                                alt={book.car?.model}
                                            />
                                            <div>
                                                <p className='headermodalText'>
                                                    {book.car.model}
                                                </p>
                                                <p className='headerModalDate'>
                                                    {book.startDate} ~ {book.endDate}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                            ))}</>}
                        </div>
                        <Link to={'/mypage/booked'}>
                            <button className='headerModalBtn'> 더보기 </button>
                        </Link>
                        <Link to={'/customerservice'} onClick={() => window.scrollTo(0,0)}>
                            <img className='headerModalImg' src='/images/bookedModal.jpg'/>
                        </Link>
                    </div>
                :
                    <></>
                }
                
            </header>



            {/* 로그인, 회원가입 모달 랜더링 */}
            {modal==='login' && 
                <LoginForm 
                    onClose={()=>setModal(null)}  
                    onJoin={() => setModal('joinA')} 
                />}
            {modal==='joinA' && 
                <JoinFormA 
                    onClose={()=>setModal(null)}
                    onNext={()=>setModal('joinB')} 
                />}
            {modal==='joinB' && 
                <JoinFormB 
                    onClose={()=>setModal(null)} 
                    onNext={(data)=>{setJoinData(data); setModal('joinC')}} 
                />}
            {modal === 'joinC' && 
                <JoinFormC
                    onClose={() => setModal(null)}
                    userid={joinData.userid}
                    userpw={joinData.userpw}
                    onComplete={handleJoinComplete} 
                />}



            {/* 사이드 네비 */}
            {isNavOpen && <div className='sideNavOverlay' onClick={closeNav}></div>}
            <nav className={`headerNavSide ${isNavOpen ? "on" : ""}`}>
                <button className="headerBtnX" onClick={closeNav}>
                    <i className="bi bi-x"></i>
                </button>
                <div className="headerNavContent">
                    <div className="headerNavAd">
                        <p className='headerNavH'>이달의 EVENT</p>
                        <div className='headerBannerImgWrap'>
                            <img className='headerBannerImg' src='/images/banner/sideNavAD.png' alt='sindNavAD' />
                        </div>
                        {/* → */}
                    </div>
                    <ul className="headerNavUl">
                        <p className='headerNavH'>차량 렌트</p>
                        <Link to={'/searchcarlist'}><li className='headerNavLi' onClick={() => window.scrollTo(0,0)}><div>예약하기</div> <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div></li><br /></Link>
                        {/* <li className='headerNavLi'><div>차량별 예약</div> <div className='headerNavpointer'>→</div></li><br /> */}
                        <p className='headerNavH'>고객 가이드</p>
                        <Link to={'/customerservice/inquiry'} style={{textDecoration:'none'}}><li className='headerNavLi' onClick={() => window.scrollTo(0,0)}><div>상담 안내</div> <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div></li><br /></Link>
                        <Link to={'/customerservice/FAQ'} style={{textDecoration:'none'}}><li className='headerNavLi' onClick={() => window.scrollTo(0,0)}><div>자주 찾는 질문</div> <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div></li><br /></Link>
                        <Link to={'/customerservice/notice'} style={{textDecoration:'none'}}><li className='headerNavLi' onClick={() => window.scrollTo(0,0)}><div>공지사항</div> <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div></li><br /></Link>
                        <p className='headerNavH'>이용 가이드</p>
                        <Link to={'/guide/branch'} style={{textDecoration:'none'}}><li className='headerNavLi' onClick={() => window.scrollTo(0,0)}><div>지점 안내</div> <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div></li><br /></Link>
                        <Link to={'/guide/inventory'} style={{textDecoration:'none'}}><li className='headerNavLi' onClick={() => window.scrollTo(0,0)}><div>차량 보유 현황</div> <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div></li><br /></Link>
                        <Link to={'/guide/return'} style={{textDecoration:'none'}}><li className='headerNavLi' onClick={() => window.scrollTo(0,0)}><div>차량 반납 안내</div> <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div></li><br /></Link>
                        <Link to={'/guide/rental'} style={{textDecoration:'none'}}><li className='headerNavLi' onClick={() => window.scrollTo(0,0)}><div>대여 안내</div> <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div></li><br /></Link>
                        <Link to={'/guide/pricing'} style={{textDecoration:'none'}}><li className='headerNavLi' onClick={() => window.scrollTo(0,0)}><div>요금 안내</div> <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div></li><br /></Link>
                        <p className='headerNavH'>마이페이지</p>
                        { userid? 
                            <Link to={'/mypage/myinfo'} style={{textDecoration:'none'}}>
                                <li className='headerNavLi' onClick={() => window.scrollTo(0,0)}>
                                    <div>내 정보</div> 
                                    <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div>
                                </li>
                                <br />
                            </Link>
                            :
                            <>
                                <li className='headerNavLi' onClick={loginNeeded}>
                                    <div>내 정보</div> 
                                    <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div>
                                </li>
                                <br />
                            </>
                        }
                        { userid?
                            <Link to={'/mypage/booked'} style={{textDecoration:'none'}}>
                                <li className='headerNavLi' onClick={() => window.scrollTo(0,0)}>
                                    <div>예약 내역</div> 
                                    <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div>
                                </li>
                                <br />
                            </Link>
                            :
                            <>
                                <li className='headerNavLi' onClick={loginNeeded}>
                                    <div>예약 내역</div> 
                                    <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div>
                                </li>
                                <br />
                            </>
                        }
                        { userid?
                            <Link to={'/recent'} style={{textDecoration:'none'}}>
                                <li className='headerNavLi' onClick={() => window.scrollTo(0,0)}>
                                    <div>최근 본 차량</div> 
                                    <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div>
                                </li>
                                <br />
                            </Link>
                            :
                            <>
                                <li className='headerNavLi' onClick={loginNeeded}>
                                    <div>최근 본 차량</div> 
                                    <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div>
                                </li>
                                <br />
                            </>
                        }   
                        { userid?
                            <Link to={'/mypage/inquiry'} style={{textDecoration:'none'}}>
                                <li className='headerNavLi' onClick={() => window.scrollTo(0,0)}>
                                    <div>1:1 문의 내역</div> 
                                    <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div>
                                </li>
                                <br />
                            </Link>
                            :
                            <>
                                <li className='headerNavLi' onClick={loginNeeded}>
                                    <div>1:1 문의 내역</div> 
                                    <div className='headerNavpointer'><i className="bi bi-chevron-right"></i></div>
                                </li>
                                <br />
                            </>
                        }      
                    </ul>
                </div>
            </nav>
        </div>
    );
}