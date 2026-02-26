import { Outlet, NavLink } from "react-router-dom";
import './CustomerService.css'

export default function CustomerService() {
    const { userid } = useContext(AuthContext);

    //관리자일 경우 outlet으로 콘텐츠관리 X => 그냥 부모라우트 안타고 바로 콘텐츠 
    if(userid === 'admin'){
        return <Outlet/>;
    }



    return (
        <div className="guideWrap">
            <div className="guideFlex">
                <div className="guideLeft">
                    <NavLink to='/customerservice/inquiry/list'>
                        <span className='MyPageSideMenus'>문의하기</span>
                    </NavLink>
                    <NavLink to='FAQ'>
                        <span className='MyPageSideMenus'>자주 찾는 질문</span>
                    </NavLink>
                    <NavLink to='notice'>
                        <span className='MyPageSideMenus'>공지 사항</span>
                    </NavLink>
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