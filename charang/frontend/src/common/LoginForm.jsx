import './LoginForm.css';
import axios from 'axios';
import { useState ,useEffect} from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/Authcontext';
// import { Link, useNavigate } from 'react-router-dom';

export default function LoginForm({ onClose, onJoin }) {
    const [userid, setUserid] = useState('');
    const [userpw, setUserpw] = useState('');
    const [name, setName] = useState('');
    const [mail, setMail] = useState('');
    const [code, setCode] = useState('');
    const [resetpw, setResetpw] = useState('');
    const [resetpwCheck, setResetpwCheck] = useState('');
    const [DupPw, setDupPw] = useState(false);
    const {loginsave} = useContext(AuthContext);

    //로그인 아이디찾기 비밀번호찾기 스테이트
    const [formView,setFormView] = useState(1); //초기값 로그인화면

    //인증번호 시간 카운트 
    const [timeLeft, setTimeLeft] = useState(180);

    useEffect(() => {
        if(formView !== 5) return;
        setTimeLeft(180);
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    alert("유효시간이 만료되었습니다.");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [formView]);
  // 분:초 형식으로 변환
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

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
}).catch((error)=>{
    console.log(error)
});
}
    //찾은 아이디
    const [findedId,setFindedId]= useState("");
    const findId=(e)=>{
            e.preventDefault();
        
        axios.post('/api/findid',{name:name,mail:mail})
        .then((res)=>{
            console.log(res.data);
            if(res.data){
                setFindedId(res.data)
                setFormView(4)
            }else{
                alert("입력하신 정보가 올바른지 확인해주세요.")
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    //비밀번호 찾기 인증번호 발송
    const findPw=(e)=>{
        e.preventDefault();
        axios.post('/api/findpw',{userId:userid,name:name,email:mail})
        .then((res)=>{
            if(res.data){
                alert("인증번호가 메일로 발송되었습니다.")
                setFormView(5)
            }
        
        })
        .catch((error)=>{
            alert("입력하신 정보를 다시 확인해주세요.")
            console.log(error)
        })
    }

    //인증번호 비교
    const checkVerification=(e)=>{
        e.preventDefault();
        axios.post('/api/checkcode',{code:code,email:mail})
        .then((res)=>{
            if(res.data){
                alert("인증되었습니다.")
                setFormView(6)
            }
        })
        .catch((error)=>{
            alert("인증번호를 다시 확인해주세요")
            console.log(error)
        })
    }

    //비밀번호확인
    const checkpw =()=>{
    if(resetpw == resetpwCheck){
      setDupPw(true);
      alert("비밀번호 확인 완료")
      setCode('');
    } else { 
      setDupPw(false);
      alert("입력하신 비밀번호가 다릅니다.")
      setResetpwCheck('')
    }
  }

  //비밀번호 재설정하기
  const resetPassword=(e)=>{
    e.preventDefault();
    if(DupPw){ //비밀번호 중복체크가 됐으면 실행 
    axios.put("/api/resetpw",{userId:userid,newPw:resetpw})
    .then((res)=>{
        if(res.data){
            alert("비밀번호가 변경되었습니다.")
            setFormView(1)
            setpAlert(0)
            setResetpw("")
            setResetpwCheck("")
            setName("")
            setMail("")
        }
    })
    .catch((error)=>{
        console.log(error)
    })
    }else{
        alert("비밀번호 중복체크 필요")
    }
  }
  const [buffer, setBuffer] = useState(false);
  const [bufferText,setBufferText] = useState("잠시만 기다려주세요.")

  //인증번호 보낼때 버퍼링 걸어주기
  useEffect(() => {
  if (!buffer) return;
  let dotCount = 0;
  const interval = setInterval(() => {
    dotCount = dotCount >= 3 ? 0 : dotCount + 1;
    setBufferText("잠시만 기다려주세요" + ".".repeat(dotCount));
  }, 400); // 0.4초마다 변경
  const timeout = setTimeout(() => {
    clearInterval(interval);
    setBuffer(false); // 시간경과 후 후 버퍼 해제
  }, 3050);
  return () => {
    clearInterval(interval);
    clearTimeout(timeout);
  };
}, [buffer]);

  const buffering=()=>{
    setBuffer(true);
  }

    return (
        formView === 1?( //로그인폼@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        <div className='loginOverlay' >
            <div className="loginWrap" >
                <button className="loginBtnX" onClick={onClose}>
                    <i className="bi bi-x"></i>
                </button>
                <h2 className='loginH'><div className='loginColor'>차랑차랑</div>에<br></br> 오신것을 환영합니다!</h2>
                <form onSubmit={login} noValidate>
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
                                <button className='loginBtnSamll' type='button' onClick={() => (setFormView(2), setpAlert(1))}>아이디 찾기</button> | 
                                <button className='loginBtnSamll' type='button' onClick={() => (setFormView(3), setpAlert(1))}>비밀번호 찾기</button> |  
                                <button className='loginBtnSamll' type='button' onClick={onJoin}>회원가입</button>
                        </div>
                    </div>
                    <div className="loginBtnWrap">
                        <button className='loginBtn' type="submit">로그인</button>
                    </div>
                </form>
            </div>
        </div>)
    : formView === 2?
    //여긴 아이디 찾기@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        (<div className='loginOverlay' >
            <div className="loginWrap" >
                 <button className="loginBtnX" onClick={onClose}>
                    <i className="bi bi-x"></i>
                </button>
                <h2 className='loginH'><div className='loginColor'>아이디</div> 찾기</h2>
                <form onSubmit={findId}>
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
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
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
                                        name="mail"
                                        value={mail}
                                        onChange={(e) => setMail(e.target.value)}
                                    />
                                </label>
                            </li>
                        </ul>

                    </div>
                    <div className="loginBtnWrapDif">
                        <button className='loginBtnDif' type="button"  onClick={(e) => {e.preventDefault();e.stopPropagation();setFormView(1);}}>뒤로가기</button>
                        <button className='loginBtnDif' type="submit">아이디 조회하기</button>
                    </div>
                </form>
            </div>
        </div>)
        :  formView === 3?
        //여긴 비밀번호 찾기@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        (<>
        <div className='loginOverlay' >
            <div className="loginWrap" >
                 <button className="loginBtnX" onClick={onClose}>
                    <i className="bi bi-x"></i>
                </button>
                <h2 className='loginH'><div className='loginColor'>비밀번호</div> 찾기</h2>

                <form onSubmit={findPw}>
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
                                    이름
                                    <input
                                        className='loginInput'
                                        type="text"
                                        placeholder="이름"
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
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
                                        name="mail"
                                        value={mail}
                                        onChange={(e) => setMail(e.target.value)}
                                    />
                                </label>
                            </li>
                        </ul>
                    </div>
                    <div className="loginBtnWrapDif">
                        <button className='loginBtnDif' type="button"  onClick={(e) => {e.preventDefault();e.stopPropagation();setFormView(1);}}>뒤로가기</button>
                        <button className='loginBtnDif' type="submit" onClick={()=>buffering()}>인증번호 확인하기</button>
                    </div>
                </form>
            </div>
        </div>
        {buffer && (
        <div className='verOverlay'>
            <p>{bufferText}</p>
        </div>
        )}
        </>)
        : formView === 4?//아이디 조회결과@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
          (<div className='loginOverlay' >
            <div className="loginWrap" >
                 <button className="loginBtnX" onClick={onClose}>
                    <i className="bi bi-x"></i>
                </button>
                <h2 className='loginH'><div className='loginColor'>아이디</div> 찾기 조회결과</h2>
                <form>
                    <div className='loginContentDif'>
                        <p className='IDresultP'>조회된 회원님의 아이디는<span className='IDresultSpan'>{findedId}</span>입니다.</p>
                    </div>
                    <div className="loginBtnWrapDif">
                        <button className='loginBtnDif' type="button" onClick={() => (setFormView(3), setpAlert(1))}>비밀번호찾기</button>
                        <button className='loginBtnDif' type="button" onClick={() => (setFormView(1), setpAlert(0))}>로그인하기</button>
                    </div>
                </form>
            </div>
        </div>)
        : formView === 5?//비밀번호 인증번호 입력@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        (<div className='loginOverlay' >
            <div className="loginWrap" >
                 <button className="loginBtnX" onClick={onClose}>
                    <i className="bi bi-x"></i>
                </button>
                <h2 className='loginH'><div className='loginColor'>인증번호</div> 입력</h2>
                <form onSubmit={checkVerification}>
                    <div className='verInputBox'>
                        <input className='verificationInput' placeholder='인증번호를 입력하세요' type="text" maxLength={6} value={code} name='code' onChange={(e) => setCode(e.target.value)}/>
                        <span className='verTime'>남은 시간: {minutes}:{seconds.toString().padStart(2, "0")}</span>
                    </div>
                    <p className='verP'>이메일에서 인증번호를 확인해주세요.</p>
                    <div className="loginBtnWrap">
                        <button className='loginBtn' type="submit">완료</button>
                    </div>
                </form>
            </div>
        </div>)
        : // 비밀번호 재설정  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
         (<div className='loginOverlay' >
            <div className="loginWrap" >
                 <button className="loginBtnX" onClick={onClose}>
                    <i className="bi bi-x"></i>
                </button>
                <h2 className='loginH'><div className='loginColor'>비밀번호</div> 재설정</h2>
                <form onSubmit={resetPassword}>
                    <div className='verInputBox'>
                        <label className='joinLabelB'>
                        <div className='joinTextB'>비밀번호</div>
                        <div className='joinContentB'>
                          <input
                            className='joinInputB'
                            type="password"
                            placeholder="비밀번호"
                            value={resetpw}
                            name="resetpw"
                            onChange={(e)=>setResetpw(e.target.value)}
                          />
                        </div>
                    </label>
                    <label className='joinLabelB'>
                        <div className='joinTextB'>비밀번호 확인</div>
                        <div className='joinContentB'>
                          <input
                            className='joinInputB'
                            type="password"
                            placeholder="비밀번호 확인"
                            value={resetpwCheck}
                            name="resetpwCheck"
                            onChange={(e)=>setResetpwCheck(e.target.value)}
                          />
                        </div>
                        <button 
                        type='button'
                        className='joinBtnB'
                        onClick={checkpw}>
                          비밀번호 확인
                        </button>
                    </label>
                    </div>
                    <div className="loginBtnWrap">
                        <button className='loginBtn' type="submit" >비밀번호 변경하기</button>
                    </div>
                </form>
            </div>
        </div>)
    );
}