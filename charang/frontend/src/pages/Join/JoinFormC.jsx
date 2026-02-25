// 추가정보 입력(필수는 * 표시)
// 가입완료 버튼 (+자동로그인, 메인으로 넘어가기)
import './JoinForm.css';
import { useState } from 'react';
import axios from 'axios';
import DaumPostCode from 'react-daum-postcode';



export default function JoinFormC({ userid, userpw, onClose, onComplete }) {

    // 3. 이름: 홍길동
    const[username, setUserName] = useState("");
    // 4. 이메일: emailId @ emailDomain
    const [emailId, setEmailId] = useState("");
    const [emailDomain, setEmailDomain] = useState("naver.com");
    const user_email = `${emailId}@${emailDomain}`;

    // 5. 주민등록번호 (resistFront - resistBack)
    const [resistFront, setResistFront] = useState("");
    const [resistBack, setResistBack] = useState("");
    const user_resistnum = `${resistFront}-${resistBack}`;

    // 6. 전화번호 (PhoneFront - phoneMiddle - phoneBack)
    const [phoneFront, setPhoneFront] = useState("");
    const [phoneMiddle, setPhoneMiddle] = useState("");
    const [phoneBack, setPhoneBack] = useState("");
    const user_phonenum = `${phoneFront}-${phoneMiddle}-${phoneBack}`;

    // 7. 주소 (address)
    // 8. 상세주소 (address_detail)
    // DaumPostCode API 사용
    const [address, setAddress] = useState("");
    const [address_detail, setAddress_detail] = useState("");
    const [zipcode, setZipcode]=useState('');
    const [isOpen, setIsOpen] = useState(false);
    console.log(isOpen);

    const addresstHandler = (data) => {
        let arr =''
        if(data.userSelectedType === 'R'){
            arr = data.roadAddress; //도로명 주소
        }else{
            arr = data.jibunAddress; //지역명 주소
        }
        setZipcode(data.zonecode);
        setAddress(arr);
        setIsOpen(false);
    }  

    // 9. 내/외국인 체크박스
    const [user_iskorean, setUser_iskorean] = useState(0)
    
    // 10. 운전면허번호 (licenseFront - licenseBack)
    const [licenseFront, setLicenseFront] = useState("");
    const [licenseSecond, setLicenseSecond] = useState("");
    const [licenseThird, setLicenseThird] = useState("");
    const [licenseBack, setLicenseBack] = useState("");
    const user_license = `${licenseFront}-${licenseSecond}-${licenseThird}-${licenseBack}`;

    // 11. 운전면허종류
    const [license, setLicense] = useState("");

    // 데이터 DB에 추가
    const signup =()=>{
        axios.post('/api/signup',{ userId: userid, userPw: userpw,name: username, mail: user_email,resistNum: user_resistnum,
            phone: user_phonenum,address: address,addressDetail: address_detail,isKorean: user_iskorean,licenseNum: user_license,license:license})
        .then((res)=>{
            if(res.data === 1){
                alert("회원 가입을 환영합니다. 로그인 페이지로 이동합니다.");
                onClose();
                onComplete();     
                // 초기화
             setUserName('');
             setEmailId('');
             setEmailDomain('naver.com');
             setResistFront('');
             setResistBack('');
             setPhoneFront('');
             setPhoneMiddle('');
             setPhoneBack('');
             setAddress('');
             setAddress_detail('');
             setZipcode('');
             setLicenseFront('');
             setLicenseSecond('');
             setLicenseThird('');
             setLicenseBack('');
             setUser_iskorean(0);
             setLicense('');

            }else if(res.data === 0){
                alert("아이디가 이미 존재합니다.")
            }else{
                alert("회원가입 실패")
            }
        })
        .catch((error)=>{
            alert("중복된 값이 존재합니다.");
            console.log(error);
        })
    }


    return (
        <div className='joinOverlay' >
            <div className="joinWrap">
                <button className="joinBtnX" onClick={onClose}>
                    <i className="bi bi-x"></i>
                </button>
                <h2 className='loginH'><span className='joinColorText'>추가정보</span>를 입력해주세요.</h2>
                <ul className='joinUlC'>
                    <li className='joinLiB'>
                        <label className='joinLabelB'>
                            <div className='joinTextC'>* 이름</div>
                            <div className="joinContentC">
                                <input className='joinInputName'
                                    type="text"
                                    placeholder="이름 입력"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                        </label>
                    </li>
                    <li className='joinLiB'>
                        <label className='joinLabelB'>
                            <div className='joinTextC'>* 이메일</div>
                            <div className="joinContentC">
                                <input className='joinInputEmail'
                                    type="text"
                                    placeholder="이메일 계정 입력"
                                    value={emailId}
                                    onChange={(e) => setEmailId(e.target.value)}
                                />
                                @
                                <select className='joinSelectEmail'
                                    value={emailDomain}
                                    onChange={(e) => setEmailDomain(e.target.value)}
                                >
                                    <option value="naver.com">naver.com</option>
                                    <option value="gmail.com">gmail.com</option>
                                    <option value="daum.net">daum.net</option>
                                </select>
                            </div>
                        </label>
                    </li>
                    <li className='joinLiB'>
                        <label className='joinLabelB'>
                            <div className='joinTextC'>* 주민등록번호</div>
                            <div className="joinContentC">
                                <input className='joinInputResi'
                                    type="text"
                                    maxLength="6"
                                    placeholder="생년월일 입력"
                                    value={resistFront}
                                    onChange={(e) => setResistFront(e.target.value)}
                                />
                                -
                                <input className='joinInputResi'
                                    type="password"
                                    maxLength="7"
                                    placeholder="*******"
                                    value={resistBack}
                                    onChange={(e) => setResistBack(e.target.value)}
                                />
                            </div>
                        </label>
                    </li>
                    <li className='joinLiB'>
                        <label className='joinLabelB'>
                            <div className='joinTextC'>* 전화번호</div>
                            <div className="joinContentC">
                                <input className='joinInput4'
                                    type="text"
                                    maxLength="3"
                                    value={phoneFront}
                                    placeholder='010'
                                    onChange={(e) => setPhoneFront(e.target.value)}
                                />
                                -
                                <input className='joinInput4'
                                    type="text"
                                    maxLength="4"
                                    value={phoneMiddle}
                                    onChange={(e) => setPhoneMiddle(e.target.value)}
                                />
                                -
                                <input className='joinInput4'
                                    type="text"
                                    maxLength="4"
                                    value={phoneBack}
                                    onChange={(e) => setPhoneBack(e.target.value)}
                                />
                            </div>
                        </label>
                    </li>
                    <li className='joinLiB'>
                        <label className='joinLabelB'>
                            <div className='joinTextCC'>주소</div>
                            <div className='joinContentC'>
                                <button className='joinbtnC'
                                    type='button' 
                                    id='userAddSearch' 
                                    onClick={()=>setIsOpen(true)}>
                                        우편번호 검색
                                </button>
                        
                                <input  className='joinInputAdd'
                                    type='text' 
                                    value={zipcode} 
                                    placeholder='우편번호' 
                                    readOnly 
                                    name='post' 
                                    id='post'/>
                        
                                <div className="joinContentC">
                                    <input  className='joinInputLong'
                                    type='text' 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                    placeholder='도로명 주소' 
                                    name='address' 
                                    id='address'/>
                                </div>
                                <input  className='joinInputLong'
                                type='text' 
                                value={address_detail} 
                                onChange={(e) => setAddress_detail(e.target.value)} 
                                placeholder='상세주소' 
                                name='address_detail' 
                                id='address_detial'
                                />
                            </div>
                        </label>
                         {isOpen && (
                            <div
                                className="joinCOverlay" 
                            >
                                <div
                                className="addressWrap"
                                onClick={(e) => e.stopPropagation()} 
                                >
                                    <button
                                        className="joinBtnXx"
                                        type="button"
                                        onClick={() => setIsOpen(false)} 
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                    <h2 className="loginH">주소 검색</h2>
                                    <DaumPostCode
                                        style={{ height: '550px' }} 
                                        onComplete={addresstHandler} 
                                        height="100%" 
                                    />
                                </div>
                            </div>
                        )}
                    </li>
                    <li className='joinLiB'>
                        
                        <label className='joinLabelB'>
                            <div className='joinTextCC'>국적</div>
                            국내국적자
                            <input
                            type="radio"
                            name="user_iskorean"
                            value="0"
                            onChange={(e) => setUser_iskorean(Number(e.target.value))}
                            />
                        </label>
                        <label className='joinLabelB'>
                            해외국적자
                            <input
                            type="radio"
                            name="user_iskorean"
                            value="1"
                            onChange={(e) => setUser_iskorean(Number(e.target.value))}
                            />
                        </label>
                    </li>
                    <li className='joinLiB'>
                        <label className='joinLabelB'>
                            <div className='joinTextCC'>운전면허번호</div>
                            <div className="joinContentC">
                                <input className='joinInputC'
                                    type="text"
                                    maxLength="2"
                                    placeholder=""
                                    value={licenseFront}
                                    onChange={(e) => setLicenseFront(e.target.value)}
                                />
                                -
                                <input className='joinInputC'
                                    type="text"
                                    maxLength="2"
                                    placeholder=""
                                    value={licenseSecond}
                                    onChange={(e) => setLicenseSecond(e.target.value)}
                                />
                                -
                                <input className='joinInputCC'
                                    type="text"
                                    maxLength="6"
                                    placeholder=""
                                    value={licenseThird}
                                    onChange={(e) => setLicenseThird(e.target.value)}
                                />
                                -
                                <input className='joinInputC'
                                    type="text"
                                    maxLength="2"
                                    placeholder=""
                                    value={licenseBack}
                                    onChange={(e) => setLicenseBack(e.target.value)}
                                />
                            </div>
                        </label>
                    </li>
                    <li className='joinLiB'>
                        
                        <label className='joinLabelB'>
                            <div className='joinTextCC'>면허 종류</div>
                            1종
                            <input
                            type="radio"
                            name="license"
                            value="1"
                            onChange={(e) => setLicense(e.target.value)}
                            />
                        </label>

                        <label className='joinLabelB'>
                            2종
                            <input
                            type="radio"
                            name="license"
                            value="2"
                            onChange={(e) => setLicense(e.target.value)}
                            />
                        </label>
                    </li>
                </ul>
                <div className="joinNextbtn">
                    <button
                        type="button"
                        className="joinFormNext"
                        onClick={signup}
                    >
                        회원가입
                    </button>
                </div>
            </div>
        </div>
    );
}

