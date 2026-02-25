import './MypageMyinfo.css'
import { useContext, useState ,useEffect} from "react"
import { AuthContext } from '../contexts/Authcontext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BookingContext } from '../contexts/Bookingcontext';

export default function MypageMyinfo(){
    const [userid,setUserid]=useState(null);
    const [unregiOverlay,setUnregiOverlay]=useState(false);
    const [unregiInput,setUnregiInput]=useState('');
    const {logout,loginNeeded}=useContext(AuthContext);
    const {myBooking}=useContext(BookingContext);
    const navigate = useNavigate();

    //회원탈퇴핸들러
    const unregistHandler=()=>{

    }

    //개인회원 정보 불러오기
    useEffect(()=>{
    axios.get(`/api/userinfo/${userid}`,{userId:userid})
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


    //회원 탈퇴하기
   const deleteHandler = (e) => {
    e.preventDefault();
    if (myBooking.length > 0) {
        alert("예약 내역이 존재해 탈퇴가 불가능합니다.");
        return;
    }
    if (unregiInput !== `${userid.name}탈퇴`) {
        alert("입력 문구가 올바르지 않습니다.");
        return;
    }
    axios.delete('/api/delete',{data:[]})
        .then((res) => {
            if (res.data === 1) {
                alert('탈퇴가 완료되었습니다.');
                logout();
                navigate("/");
            } else {
                alert('회원 탈퇴 실패.');
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

    return(
        <>
        {unregiOverlay &&
        <div className='unreOverlay'>
            <div className='loginOverlay' >
            <div className="loginWrap" >
                 <button className="loginBtnX" onClick={()=>setUnregiOverlay(false)}>
                    <i className="bi bi-x"></i>
                </button>
                <h2 className='loginH'><div className='loginColor'>회원 탈퇴</div> 확인</h2>
                <form onSubmit={deleteHandler}>
                    <div className='verInputBox'>
                        <input className='loginInputDif' type='text' placeholder="회원이름 + '탈퇴'를 입력하세요 (예: 홍길동탈퇴) 공백제외"
                         value={unregiInput} onChange={(e) => setUnregiInput(e.target.value)}
                        />
                    </div>
                    <div>
                        <p className='verPDif'>회원 탈퇴를 희망하신다면 체크박스와 회원이름+탈퇴를 입력해주세요.</p>
                        <p className='verPDif'>회원명:홍길동 → 홍길동탈퇴</p>
                        <p className='verPDif'>차량 예약 내역이 존재하면 탈퇴가 불가능합니다.</p>
                    </div>
                    <div className='verPDif2box' >
                        <p className='verPDif2'>탈퇴 시 모든 데이터는 복구할 수 없습니다.</p>
                        <p className='verPDif2'>정말 진행하시겠습니까?</p>
                    </div>
                    <div className="loginBtnWrapDif">
                        <button className='loginBtnDif' type="button" onClick={()=>setUnregiOverlay(false)}>취소하기</button>
                        <button className='loginBtnDif' type="submit">탈퇴하기</button>
                    </div>
                </form>
            </div>
        </div>
        </div>
        }
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
                <button className='myinfo-btn' type='button' onClick={()=>setUnregiOverlay(true)}>회원 탈퇴</button>
            </div>
        </div>
        </>
    )
}