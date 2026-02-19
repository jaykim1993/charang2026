import { useState } from "react"
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom"
import './CustomerService.css'
import { useContext } from "react"
import { AuthContext } from "../contexts/Authcontext"
import { useNavigate } from "react-router-dom"

export default function CustomerService(){
    return(
        <>
        <div className="guideWrap">
            <div className="guideTop">
                <div><Link to={'/'} className="guideGoToHome">홈</Link></div>
                <span><i className="bi bi-caret-right-fill"></i></span>
                <div>고객 가이드</div>
            </div> 
            <div className="guideFlex">
                <div className="guideLeft">
                <Link to='inquiry'><span className='MyPageSideMenus'>상담 안내</span></Link>
                <Link to='FAQ'><span className='MyPageSideMenus'>자주 찾는 질문</span></Link>
                <Link to='notice'><span className='MyPageSideMenus'>공지 사항</span></Link>
                </div>
                <div className="guideRight">
                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
        </>
    )
}