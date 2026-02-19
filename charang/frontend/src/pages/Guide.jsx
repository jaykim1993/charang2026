import { useState,useEffect } from "react"
import { useContext } from "react"
import { DataContext } from "../contexts/Datacontext"
import './Guide.css'
import { Link, Outlet } from "react-router-dom"


export default function GuidePage(){

    return(
            <div className="guideWrap">
                 <div className="guideTop">
                    {/* 수정 필요 */}
                    <div><Link to={'/'} className="guideGoToHome">홈</Link></div>
                    <span><i className="bi bi-caret-right-fill"></i></span>
                    <div>이용가이드</div>
                </div>
                <div className="guideFlex">
                    <div className="guideLeft">
                        <Link to='branch'><span className='MyPageSideMenus'>지점/정비소</span></Link>
                        <Link to='inventory'><span className='MyPageSideMenus'>차량보유현황</span></Link>
                        <Link to='return'><span className='MyPageSideMenus'>차량반납안내</span></Link>
                        <Link to='rental'><span className='MyPageSideMenus'>차량대여안내</span></Link>
                        <Link to='pricing'><span className='MyPageSideMenus'>요금안내</span></Link>
                    </div>
                    <div className="guideRight">
                            {/* <div className="guideSelectBar">
                                <button  className={`guideSelectButns ${showPage?'active':''}`} onClick={showGuideOne}>대여안내</button>
                                <button  className={`guideSelectButns ${!showPage?'active':''}`} onClick={showGuideTwo}>요금안내</button>
                            </div> */}
                        <div className="guideRight">
                            <main>
                                <Outlet />
                            </main>
                        </div>
                    </div>
                </div>
            </div>
    );
}