// 아이디 (중복확인 필요)
// 비밀번호 (+비밀번호 재입력까지)
// 아이디 최대 15자
// 비밀번호 10~20자 내외
import './JoinForm.css';
import { useState } from 'react';
import axios from 'axios';


export default function JoinFormB({ onClose, onNext }) {

  const [userid, setUserid] = useState("");
  const [userpw, setUserpw] = useState("");
  const [userpwCheck, setUserpwCheck] = useState("");

  // DB 내 아이디 중복 체크
  const [isidChecked, setIsidChecked] = useState(false);
  const [ispwChecked, setIspwChecked] = useState(false);
  const checkId = async () => {
    if (!userid) return alert("아이디를 입력하세요.");

    try {
      // await 사용해서 Promise 완료 후 결과 받기
      const res = await axios.post('/api/join.php', {
        action: 'checkId',
        userid: userid  //  실제 입력값 전달
      });

      // 서버에서 { exists: true/false } 반환
      if (res.data.exists) {
        alert("중복된 아이디입니다.");
        setIsidChecked(false);
      } else {
        alert("사용 가능한 아이디입니다.");
        setIsidChecked(true);
      }

    } catch (err) {
      console.error(err);
      alert("오류 발생");
      setIsidChecked(false);
    }
  };

  // 비밀번호 확인 버튼 함수
  const checkpw =()=>{
    if(userpw == userpwCheck){
      setIspwChecked(true);
      alert("비밀번호 확인 완료")
    } else { 
      setIspwChecked(false);
      alert("입력하신 비밀번호가 다릅니다.")
      setUserpwCheck('')
    }
  }
  // 다음 버튼 함수
  const handleNext = () => {
    if (!userid || !userpw) return alert("아이디와 비밀번호를 모두 입력하세요.");
    if (userpw !== userpwCheck) return alert("비밀번호가 일치하지 않습니다.");
    if (!isidChecked) return alert("아이디 중복 확인이 필요합니다.");
    if (!ispwChecked) return alert("비밀번호 확인이 필요합니다.");
  
    // Header에서 받은 onNext 호출, userid/userpw 전달
    onNext({ userid, userpw });
  };
    return (
      <div className='joinOverlay' >
        <div className="joinWrap">
            <button className="joinBtnX" onClick={onClose}>
                <i className="bi bi-x"></i>
            </button>
            <h3 className='loginH'><span className='joinColorText'>아이디</span>와 <span className='joinColorText'>비밀번호</span>를 설정해주세요.</h3>
            <ul className='joinUlB'>
                <li className='joinLiB'>
                    <label className='joinLabelB'>
                        <div className='joinTextB'>아이디</div>
                        <div className='joinContentB'>
                          <input
                              className='joinInputB'
                              type="text"
                              placeholder="아이디"
                              value={userid}
                              onChange={(e)=>setUserid(e.target.value)}
                          />
                        </div>
                        <button
                        className='joinBtnB'
                        type='button' 
                        onClick={checkId}>
                          중복 확인
                        </button>
                    </label>
                </li>
                <li className='joinLiB'>
                    <label className='joinLabelB'>
                        <div className='joinTextB'>비밀번호</div>
                        <div className='joinContentB'>
                          <input
                            className='joinInputB'
                            type="password"
                            placeholder="비밀번호"
                            value={userpw}
                            onChange={(e)=>setUserpw(e.target.value)}
                          />
                        </div>
                    </label>
                </li>
                <li className='joinLiB'>
                    <label className='joinLabelB'>
                        <div className='joinTextB'>비밀번호 확인</div>
                        <div className='joinContentB'>
                          <input
                              className='joinInputB'
                              type="password"
                              placeholder="비밀번호 확인"
                              value={userpwCheck}
                              onChange={(e)=>setUserpwCheck(e.target.value)}
                          />
                        </div>
                        <button 
                        className='joinBtnB'
                        onClick={checkpw}>
                          비밀번호 확인
                        </button>
                    </label>
                </li>

            </ul>

            <div className="joinNextbtn">
                <button 
                className="joinFormNext" 
                type="submit" 
                 onClick={handleNext}>
                  다음
                </button>
            </div>
        </div>
      </div>
    );
}
