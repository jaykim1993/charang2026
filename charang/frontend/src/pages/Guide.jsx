import './Guide.css'
import { NavLink, Outlet } from "react-router-dom"


export default function GuidePage() {

    return (
        <div className="guideWrap">
            <div className="guideFlex">
                <div className="guideLeft">
                    <NavLink to='branch'>
                        <span className='MyPageSideMenus'>지점/정비소</span>
                    </NavLink>
                    <NavLink to='inventory'>
                        <span className='MyPageSideMenus'>차량보유현황</span>
                    </NavLink>
                    <NavLink to='return'>
                        <span className='MyPageSideMenus'>차량반납안내</span>
                    </NavLink>
                    <NavLink to='rental'>
                        <span className='MyPageSideMenus'>차량대여안내</span>
                    </NavLink>
                    <NavLink to='pricing'>
                        <span className='MyPageSideMenus'>요금안내</span>
                    </NavLink>
                </div>
                <div className="guideRight">
                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}