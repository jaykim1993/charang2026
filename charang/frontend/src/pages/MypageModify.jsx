import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DaumPostCode from "react-daum-postcode";
import "./MypageModify.css";
import { useNavigate } from "react-router-dom";

export default function MypageModify() {
    const navigate=useNavigate();
    const [phoneFront, setPhoneFront] = useState("");
    const [phoneMiddle, setPhoneMiddle] = useState("");
    const [phoneBack, setPhoneBack] = useState("");

  const [user, setUser] = useState({
    name: "",
    mail: "",
    phone: "",
    address: "",
    addressDetail: "",
    userPw: ""
  });

  const [zipcode, setZipcode] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // 내 정보 불러오기 ~~>
useEffect(() => {
  axios.get("/api/userinfo")
    .then(res => {
      if(res.data){
        setUser(res.data);
        const phoneArr = (res.data.phone || "").split("-");

        setPhoneFront(phoneArr[0] || "");
        setPhoneMiddle(phoneArr[1] || "");
        setPhoneBack(phoneArr[2] || "");
      }
    });
}, []);
  //
  // 입력 변경
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  // 주소 선택
  const addresstHandler = (data) => {
    let addr = data.userSelectedType === "R"
      ? data.roadAddress
      : data.jibunAddress;

    setZipcode(data.zonecode);
    setUser(prev => ({
      ...prev,
      address: addr
    }));

    setIsOpen(false);
  };

  // 수정
  const handleSubmit = (e) => {
    e.preventDefault();
        const updatedUser = {
        ...user,
        phone: `${phoneFront}-${phoneMiddle}-${phoneBack}`
        };
    axios.put("/api/modify", updatedUser)
      .then(res => {
        if(res.data === 1){
          alert("회원정보 수정 완료");
          navigate(-1);
        }else{
          alert("비밀번호를 확인해주세요.");
        }
      })
      .catch(err => {
        console.log(err);
        alert("서버 오류");
      });
  };

  return (
    <>
    <h2 className="guideMainText">개인정보 수정</h2>
     <div className="mypagemodify">
    <div className="mypage-card">
       

      <form onSubmit={handleSubmit} className="mypage-form">

        {/* 이름 */}
        <div className="field">
          <label className="field-label">이름</label>
          <input
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="이름"
          />
        </div>

        {/* 이메일 */}
        <div className="field">
          <label className="field-label">이메일</label>
          <input
            name="mail"
            value={user.mail}
            onChange={handleChange}
            placeholder="이메일"
          />
        </div>

        {/* 전화번호 */}
        <div className="field">
          <label className="field-label">전화번호</label>
          <div className="phone-row">
            <input
              className="phone-input"
              type="text"
              maxLength="3"
              value={phoneFront}
              placeholder="010"
              onChange={(e) => setPhoneFront(e.target.value)}
            />
            <span className="phone-dash">-</span>
            <input
              className="phone-input"
              type="text"
              maxLength="4"
              value={phoneMiddle}
              placeholder="1234"
              onChange={(e) => setPhoneMiddle(e.target.value)}
            />
            <span className="phone-dash">-</span>
            <input
              className="phone-input"
              type="text"
              maxLength="4"
              value={phoneBack}
              placeholder="5678"
              onChange={(e) => setPhoneBack(e.target.value)}
            />
          </div>
        </div>

        {/* 주소 */}
        <div className="field">
          <label className="field-label">주소</label>

          <div className="addr-top">
            <button
              type="button"
              className="joinbtnC"
              onClick={() => setIsOpen(true)}
            >
              우편번호 검색
            </button>

            <input
              type="text"
              value={zipcode}
              placeholder="우편번호"
              readOnly
            />
          </div>

          <input
            type="text"
            name="address"
            value={user.address}
            placeholder="기본주소"
            readOnly
          />

          <input
            type="text"
            name="addressDetail"
            value={user.addressDetail}
            onChange={handleChange}
            placeholder="상세주소"
          />
        </div>

        {/* 다음주소 모달 (기능 그대로) */}
        {isOpen && (
          <div className="joinCOverlay" onClick={() => setIsOpen(false)}>
            <div className="addressWrap" onClick={(e) => e.stopPropagation()}>
              <div className="addr-modal-head">
                <span className="addr-modal-title">주소 검색</span>
                <button
                  type="button"
                  className="addr-close"
                  onClick={() => setIsOpen(false)}
                >
                  ×
                </button>
              </div>

              <DaumPostCode
                style={{ height: "550px", width: "100%" }}
                onComplete={addresstHandler}
              />
            </div>
          </div>
        )}

        {/* 현재 비밀번호 */}
        <div className="field">
          <label className="field-label">비밀번호 확인</label>
          <input
            type="password"
            name="userPw"
            onChange={handleChange}
            placeholder="현재 비밀번호 입력"
          />
        </div>

        {/* 버튼 영역 */}
        <div className="btn-area">
          <Link to="/mypage/myinfo" className="mypage-btn secondary">
            마이페이지로 이동
          </Link>

          <button type="submit" className="mypage-btn primary">
            수정하기
          </button>
        </div>

      </form>
    </div>
  </div>
  </>
  );
  
}
