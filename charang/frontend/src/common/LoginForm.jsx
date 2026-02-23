import './LoginForm.css';
import axios from 'axios';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/Authcontext';
import { useNavigate } from 'react-router-dom';
// import { Link, useNavigate } from 'react-router-dom';

export default function LoginForm({ onClose, onJoin }) {
    const [userid, setUserid] = useState('');
    const [userpw, setUserpw] = useState('');
    const {loginsave} = useContext(AuthContext);

    //로그인 아이디찾기 비밀번호찾기 스테이트
    const [formView,setFormView] = useState(1); //초기값 로그인화면



    const navigate = useNavigate();
    const login=(e)=>{
    e.preventDefault();
    if(userid === ''){
            alert("아이디를 입력하세요");
            return;
        }
        if(userpw === ''){
            alert("비밀번호를 입력하세요");
            return;
        }
    axios.post('/api/login',{userId:userid,userPw:userpw})
    .then((res)=>{
        if(res.data){
            onClose();
            alert(`${res.data.userId}님 환영합니다.`);
            loginsave({
            userId: res.data.userId,
            name: res.data.name
            });
           // 로그인 후 홈으로 이동 제거 26.02.21 성중
        }else{
            alert("아이디 또는 비밀번호를 확인하세요.");
            setUserpw('');
            setUserid('');
        }
})

}

    return (
        formView === 1?(
        <div className='loginOverlay' >
            <div className="loginWrap" >
                <button className="loginBtnX" onClick={onClose}>
                    <i className="bi bi-x"></i>
                </button>
                <h2 className='loginH'><div className='loginColor'>차랑차랑</div>에<br></br> 오신것을 환영합니다!</h2>
                <form onSubmit={login}>
                    <div className='loginContent'>
                        <ul className='loginUl'>
                            <li className='loginLiB'>
                                <label className='loginLabel'>
                                    아이디
                                    <input
                                        className='loginInput'
                                        type="text"
                                        placeholder="아이디"
                                        name="userid"
                                        value={userid}
                                        onChange={(e) => setUserid(e.target.value)}
                                    />
                                </label>
                            </li>

                            <li className='loginLiB'>
                                <label className='loginLabel'>
                                    비밀번호
                                    <input
                                        className='loginInput'
                                        type="password"
                                        placeholder="비밀번호"
                                        name="userpw"
                                        value={userpw}
                                        onChange={(e) => setUserpw(e.target.value)}
                                    />
                                </label>
                            </li>
                        </ul>
                        <div className='loginAccount'>
                                <button className='loginBtnSamll' type='button' onClick={()=>setFormView()}>아이디 찾기</button> | 
                                <button className='loginBtnSamll' type='button'>비밀번호 찾기</button> |  
                                <button className='loginBtnSamll' type='button' onClick={onJoin}>회원가입</button>
                        </div>
                    </div>
                    <div className="loginBtnWrap">
                        <button className='loginBtn' type="submit">로그인</button>
                    </div>
                </form>
            </div>
        </div>)
    :
    //여긴 아이디 찾기
        (<div className='loginOverlay' >
            <div className="loginWrap" >
                 <button className="loginBtnX" onClick={onClose}>
                    <i className="bi bi-x"></i>
                </button>
                <h2 className='loginH'><div className='loginColor'>아이디</div> 찾기</h2>
                <form onSubmit={login}>
                    <div className='loginContent'>
                        <ul className='loginUl'>
                            <li className='loginLiB'>
                                <label className='loginLabel'>
                                    이름
                                    <input
                                        className='loginInput'
                                        type="text"
                                        placeholder="이름"
                                        name="name"
                                        value={userid}
                                        onChange={(e) => setUserid(e.target.value)}
                                    />
                                </label>
                            </li>

                            <li className='loginLiB'>
                                <label className='loginLabel'>
                                    이메일
                                    <input
                                        className='loginInput'
                                        type="email"
                                        placeholder="이메일"
                                        name="userpw"
                                        value={userpw}
                                        onChange={(e) => setUserpw(e.target.value)}
                                    />
                                </label>
                            </li>
                        </ul>

                    </div>
                    <div className="loginBtnWrap">
                        <button className='loginBtn' type="submit">아이디찾기</button>
                    </div>
                </form>
            </div>
        </div>)
    );
}