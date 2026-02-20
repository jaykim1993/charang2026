
import './App.css';
import GuidePage from './pages/Guide';
import Header from './common/Header';
import Home from './pages/Home';
import Searchcarlist from './pages/Searchcarlist';
import DetailPage from './pages/DetailPage';
import Recentcarlist from './pages/Recentcarlist';
import Reservation from './pages/Reservation'
import CustomerService from './pages/CustomerService';
import LocationPage from './pages/Location';
import Mypage from './pages/Mypage'
import MypageDetail from './pages/MypageDetail'
import MypageInquiry from './pages/MypageInquiry'
import MypageMyinfo from './pages/MypageMyinfo'
import MypageBooked from './pages/MypageBooked'
import AllCarPage from './pages/Manager/AllCarPage';
import AllReservationPage from './pages/Manager/AllReservationPage';
import CarRegPage from './pages/Manager/CarRegPage';
import AllUserPage from './pages/Manager/AllUserPage';


import AuthProvider from './contexts/Authcontext';
import CalendarProvider from './contexts/Calendarcontext';
import DataProvider from './contexts/Datacontext';
import BookingProvider from './contexts/Bookingcontext';

import Footer from './common/Footer';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerServiceInquiry from './pages/Inquiry/CustomerServiceInquiry';
import CustomerServiceFAQ from './pages/CustomerServiceFAQ';

import CustomerServiceNotice from './pages/Notice/CustomerServiceNotice';
import CustomerServiceNoticeInfo from './pages/Notice/CustomerServiceNoticeInfo';
import CustomerServiceNoticeWrite from './pages/Notice/CustomerServiceNoticeWrite';

import GuideBranch from './pages/GuideBranch';
import GuideInventory from './pages/GuideInventory';
import GuideReturn from './pages/GuideReturn';
import GuideRental from './pages/GuideRental';
import GuidePricing from './pages/GuidePricing';
import MypageModify from './pages/MypageModify';
// 폰트어썸
import 'bootstrap-icons/font/bootstrap-icons.css';
function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BookingProvider>
          <CalendarProvider>
            <BrowserRouter>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/searchcarlist" element={<Searchcarlist />} />
                <Route path="/detailpage/:id" element={<DetailPage />} />
                <Route path="/reservation" element={<Reservation/>}/>

                {/* 이용 가이드 */}
                <Route path="/guide" element={<GuidePage />}>                 
                  <Route path="branch" element={<GuideBranch/>} />            {/* 지점/정비소 */}
                  <Route path="inventory" element={<GuideInventory/>} />      {/* 차량보유현황 */}
                  <Route path="return" element={<GuideReturn/>} />            {/* 반납안내 */}
                  <Route path="rental" element={<GuideRental/>} />            {/* 대여안내 */}
                  <Route path="pricing" element={<GuidePricing/>} />          {/* 요금안내 */}
                </Route>

                {/* 고객 가이드 */}
                <Route path="/customerservice" element={<CustomerService />}>
                  <Route path="inquiry" element={<CustomerServiceInquiry/>} />{/* 1:1문의 */}
                  <Route path="FAQ" element={<CustomerServiceFAQ/>} />        {/* 자주 찾는 질문 */}
                  <Route path="notice" element={<CustomerServiceNotice/>} />  {/* 공지사항 */}
                  <Route path="/customerservice/notice/Info/:noticeId" element={<CustomerServiceNoticeInfo />} />  {/* 공지사항 상세*/}
                </Route>
                <Route path="/customerservice/notice/write" element={<CustomerServiceNoticeWrite />} />  {/* 공지사항 상세*/}
                
                <Route path="/location" element={<LocationPage />} />
                <Route path="/recent" element={<Recentcarlist />} />

                {/* 마이페이지 */}
                <Route path="/mypage" element={<Mypage />}>
                    <Route path="booked" element={<MypageBooked/>} />
                    <Route path="detail/:id" element={<MypageDetail />} />
                    <Route path="inquiry" element={<MypageInquiry />} />
                    <Route path="myinfo" element={<MypageMyinfo />} />
                    <Route path="modify" element={<MypageModify />} />
                </Route>

                <Route path="/manager/carlist" element={<AllCarPage/>}/>
                <Route path="/manager/reservationlist" element={<AllReservationPage/>}/>
                <Route path="/manager/carregister" element={<CarRegPage/>}/>
                <Route path="/manager/userlist" element={<AllUserPage/>}/>
              </Routes>
              <Footer />
            </BrowserRouter>
          </CalendarProvider>
        </BookingProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
