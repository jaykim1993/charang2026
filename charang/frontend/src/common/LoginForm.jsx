import './LoginForm.css';
import axios from 'axios';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/Authcontext';
// import { Link, useNavigate } from 'react-router-dom';

export default function LoginForm({ onClose, onJoin }) {
    const [userid, setUserid] = useState('');
    const [userpw, setUserpw] = useState('');
    const {loginsave} = useContext(AuthContext);

    // 로그인 핸들러
    const login = async (e) => {
        e.preventDefault();

        if (!userid || !userpw) {
            alert('아이디와 비밀번호를 모두 입력하세요.');
            return;
        }

        try {
            const res = await axios.post(
                '/api/login.php',
                { userid, userpw }
            );

            if (res.data.status === 'success') {
                loginsave({
                    userid: res.data.userid,
                    username: res.data.username,
                    user_email:res.data.user_email,
                    user_resistnum:res.data.user_resistnum,
                    user_phonenum:res.data.user_phonenum,
                    address:res.data.address,
                    address_detail:res.data.address_detail,
                    user_iskorean:res.data.user_iskorean,
                    user_license:res.data.user_license,
                });

                alert(`${res.data.username}님, 환영합니다.`);
                onClose();
            } else {
                alert('아이디 또는 비밀번호가 일치하지 않습니다.');
                setUserpw('');
            }

        } catch (error) {
            console.error("에러", error);
            alert('서버 연결 오류');
        }
    };

    return (
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
                                        value={userpw}
                                        onChange={(e) => setUserpw(e.target.value)}
                                    />
                                </label>
                            </li>
                        </ul>
                        <div className='loginAccount'>
                                {/* <button className='loginBtnSamll' type='button'>아이디 찾기</button> | 
                                <button className='loginBtnSamll' type='button'>비밀번호 찾기</button> |  */}
                                <button className='loginBtnSamll' type='button' onClick={onJoin}>회원가입</button>
                        </div>
                    </div>
                    <div className="loginBtnWrap">
                        <button className='loginBtn' type="submit">로그인</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
