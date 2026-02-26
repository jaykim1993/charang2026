import { useContext, useState, useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/Authcontext';
import { BookingContext } from '../contexts/Bookingcontext';
import axios from 'axios';

import './MypageMyinfo.css'

export default function MypageMyinfo() {
    const [userid, setUserid] = useState(null);
    const [unregiOverlay, setUnregiOverlay] = useState(false);
    const [unregiInput, setUnregiInput] = useState('');
    const { logout, loginNeeded } = useContext(AuthContext);
    const { myBooking } = useContext(BookingContext);
    const navigate = useNavigate();

    //개인회원 정보 불러오기
    useEffect(() => {
        axios.get(`/api/userinfo/${userid}`, { userId: userid })
            .then((res) => {
                if (!res.data) {
                    loginNeeded();
                } else {
                    setUserid(res.data);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    if (!userid) {
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
        axios.delete('/api/delete', { data: [] })
            .then((res) => {
                if (res.data === 1) {
                    alert('회원 탈퇴 처리 완료');
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

    return (
        <div className="myinfo-Wrap">
            <div className="myInfoBtn">
                <h4>내 정보</h4>
                <button className="myinfo-btn1" onClick={() => navigate('/mypage/modify')}>
                    정보 수정
                </button>
            </div>
            <table>
                <tbody className="myinfo-list">
                    <tr>
                        <th>아이디</th>
                        <td>{userid.userId}</td>
                    </tr>
                    <tr>
                        <th>이름</th>
                        <td>{userid.name}</td>
                    </tr>
                    <tr>
                        <th>이메일</th>
                        <td>{userid.mail}</td>
                    </tr>
                    <tr>
                        <th>주민번호</th>
                        <td>{userid.resistNum}</td>
                    </tr>
                    <tr>
                        <th>전화번호</th>
                        <td>{userid.phone}</td>
                    </tr>
                    <tr>
                        <th>주소</th>
                        <td>{userid.address} ({userid.addressDetail})</td>
                    </tr>
                    <tr>
                        <th>국적</th>
                        <td>
                            {userid.isKorean == 0 ? "대한민국 국적" : "외국 국적"}
                        </td>
                    </tr>
                    <tr>
                        <th>운전면허번호</th>
                        <td>{userid.licenseNum}</td>
                    </tr>
                    <tr>
                        <th>운전면허종류</th>
                        <td>{userid.license}종 보통</td>
                    </tr>
                    <tr>
                        <th>가입일</th>
                        <td>{userid.regDate.slice(0,10)}</td>
                    </tr>
                </tbody>
            </table>
            <button className='myinfo-btn2' type='button' onClick={() => setUnregiOverlay(true)}>
                회원 탈퇴하기
            </button>
            {unregiOverlay &&
                <div className='unreOverlay'>
                    <div className='loginOverlay' >
                        <div className="loginWrap" >
                            <button className="loginBtnX" onClick={() => setUnregiOverlay(false)}>
                                <i className="bi bi-x"></i>
                            </button>
                            <h2 className='loginH'><div className='loginColor'>회원 탈퇴</div> 확인</h2>
                            <form onSubmit={deleteHandler}>
                                <div className='verInputBox'>
                                    <input className='loginInputDif' type='text' placeholder="회원이름 + '탈퇴'를 입력하세요 (예: 홍길동탈퇴) 공백제외"
                                        value={unregiInput} onChange={(e) => setUnregiInput(e.target.value)} />
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
                                    <button className='loginBtnDif' type="button" onClick={() => setUnregiOverlay(false)}>취소하기</button>
                                    <button className='loginBtnDif' type="submit">탈퇴하기</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}