import './MypageMyinfo.css'
import { useContext, useState ,useEffect} from "react"
import { AuthContext } from '../contexts/Authcontext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function MypageMyinfo(){
    const [userid,setUserid]=useState(null);
    const {logout,loginNeeded}=useContext(AuthContext);
    const navigate = useNavigate();

    //개인회원 정보 불러오기
    useEffect(()=>{
    axios.get('/api/userinfo')
    .then((res)=>{
        if(!res.data){
        loginNeeded();
        }else{
        setUserid(res.data);
        }
    })
    .catch((error)=>{
        console.log(error)
    })
    },[])

    if(!userid){
    return <div>로딩중 ....</div>
    }


    //회원 탈퇴하기 // 예약내역 가져올수 있으면 조건문 추가해야함  // 예약내역이 존재해서 탈퇴가 불가능하다~ 
    const deleteHandler=()=>{
        if(!window.confirm('정말 삭제하시겠습니까? 삭제된 데이터는 복구가 불가능합니다.')){
            return;
            }
            axios.delete('/api/delete')
            .then((res)=>{
            if(res.data === 1){
                alert('회원 탈퇴 처리 완료');
                logout();
                navigate("/");
            }else{
                alert('삭제 실패')
            }
            })
            .catch((error)=>{
            console.log(error)
            })
        }


    return(
        <div className="myinfo-Wrap">
            <div className="myinfo-header">
                {/* <h1 className="guideMainText">마이페이지</h1> */}
                <h2 className="guideMainText">내 정보</h2>
            </div>

            <table className="myinfo-context">
                <tbody className="myinfo-list">
                    <tr>
                        <td className="myinfo-label">아이디</td>
                        <td className="myinfo-value">{userid.userId}</td>
                    </tr>
                    <tr>
                        <td className="myinfo-label">이름</td>
                        <td className="myinfo-value">{userid.name}</td>
                    </tr>
                    <tr>
                        <td className="myinfo-label">이메일</td>
                        <td className="myinfo-value">{userid.mail}</td>
                    </tr>
                    <tr>
                        <td className="myinfo-label">주민번호</td>
                        <td className="myinfo-value">{userid.resistNum}</td>
                    </tr>
                    <tr>
                        <td className="myinfo-label">전화번호</td>
                        <td className="myinfo-value">{userid.phone}</td>
                    </tr>
                    <tr>
                        <td className="myinfo-label">주소</td>
                        <td className="myinfo-value">{userid.address} {userid.addressDetail}</td>
                    </tr>
                    <tr>
                        <td className="myinfo-label">국적</td>
                        <td className="myinfo-value">
                        {userid.isKorean == 0? "대한민국 국적" : "외국 국적"}
                        </td>
                    </tr>
                    <tr>
                        <td className="myinfo-label">운전면허번호</td>
                        <td className="myinfo-value">{userid.licenseNum}</td>
                    </tr>
                    <tr>
                        <td className="myinfo-label">운전면허종류</td>
                        <td className="myinfo-value">{userid.license}종 보통</td>
                    </tr>
                </tbody>
            </table>
            <div className="myinfo-btn-wrap">
                <button className="myinfo-btn" onClick={() => navigate('/mypage/modify')}>정보 수정</button>
                <button className='myinfo-btn' type='button' onClick={deleteHandler}>회원 탈퇴</button>
            </div>
        </div>
    )
}