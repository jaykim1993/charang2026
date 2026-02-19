// 이용약관 & 개인정보 수집 동의 페이지
// 체크박스로 전체 동의 후 다음으로 넘어감
// 각각의 체크박스를 통제하는 모두 동의 체크박스
import './JoinForm.css';
import { useState } from 'react';

export default function JoinFormA({ onClose, onNext }) {


    // 약관 펼치기/접기
    const [openA, setOpenA] = useState(false);
    const [openB, setOpenB] = useState(false);

    // 체크박스 상태
    const [agreeA, setAgreeA] = useState(false); // 이용약관 동의
    const [agreeB, setAgreeB] = useState(false); // 개인정보 수집 동의
    const [agreeAll, setAgreeAll] = useState(false); // 전체 동의

    // 전체 동의 클릭 시
    const handleAgreeAll = (checked) => {
        setAgreeAll(checked);
        setAgreeA(checked);
        setAgreeB(checked);
    };

    // 개별 체크 시 전체 동의 자동 업데이트
    const handleAgreeA = (checked) => {
        setAgreeA(checked);
        if (!checked) setAgreeAll(false);
        else if (checked && agreeB) setAgreeAll(true);
    };

    const handleAgreeB = (checked) => {
        setAgreeB(checked);
        if (!checked) setAgreeAll(false);
        else if (checked && agreeA) setAgreeAll(true);
    };

    // 다음 페이지 이동 조건
    const handleNext = () => {
        if (!agreeA || !agreeB) {
            alert("약관에 모두 동의해야 다음 단계로 진행할 수 있습니다.");
            return;
        }
        // Header에서 받은 onNext 호출
        onNext();
    };
    return (
        <div className='joinOverlay'>
            <div className="joinWrap">
                <button className="joinBtnX" onClick={onClose}>
                    <i className="bi bi-x"></i>
                </button>
                <h3 className='loginH'><span className='joinColorText'>이용약관</span>과 <span className='joinColorText'>고객정보수집</span>에 동의합니다.</h3>
                    <div className='joinAContentWrap'>
                        {/* 이용약관 동의 창 */}
                        <div className="joinContent">
                            <div>
                                <h4 className="joinTosH3">이용약관</h4>
                                <button className="joinAListbtn" onClick={() => setOpenA(!openA)}>
                                    {openA ? <i className="bi bi-caret-up"></i> : <i className="bi bi-caret-down"></i>}
                                </button>
                                <label className='joinLabel'>
                                    <input
                                        className='joinCheck'
                                        type="checkbox"
                                        checked={agreeA}
                                        onChange={(e) => handleAgreeA(e.target.checked)}
                                    />
                                    이용약관에 동의합니다.
                                </label>
                            </div>
                                <div className={`joinTos ${openA ? "open" : ""}`}>
                                    <p className="joinTosH">렌터카 이용약관</p>
                                    <p>
                                        본 약관은 렌터카 서비스 이용에 필요한 기본적인 규정을 포함합니다.
                                        차량 대여 시 고객은 아래 내용을 충분히 확인하고 동의해야 합니다.
                                    </p>

                                    <p className="joinTosH">1. 차량 예약 및 결제</p>
                                    <ul className="joinContentA">
                                        <li>차량 예약은 온라인 또는 오프라인으로 가능합니다.</li>
                                        <li>결제는 신용/체크카드, 계좌이체 등 다양한 방식으로 진행할 수 있습니다.</li>
                                    </ul>

                                    <p className="joinTosH">2. 운전자 조건</p>
                                    <ul className="joinContentA">
                                        <li>운전자는 만 21세 이상이어야 합니다.</li>
                                        <li>운전면허 취득 후 1년 이상 경과해야 합니다.</li>
                                    </ul>

                                    <p className="joinTosH">3. 차량 인수 및 반납</p>
                                    <ul className="joinContentA">
                                        <li>차량 인수 시 외관 및 내부 손상 여부를 반드시 확인해야 합니다.</li>
                                        <li>인수 후 발생한 손상은 고객 책임으로 처리될 수 있습니다.</li>
                                    </ul>

                                    <p className="joinTosH">4. 사고 및 고장</p>
                                    <ul className="joinContentA">
                                        <li>사고 또는 고장 발생 시 즉시 고객센터로 연락해야 합니다.</li>
                                        <li>보고가 지연되면 보험 적용이 제한될 수 있습니다.</li>
                                    </ul>

                                    <p className="joinTosH">5. 금지 행위</p>
                                    <ul className="joinContentA">
                                        <li>음주 운전</li>
                                        <li>무단 대여 또는 대리운전</li>
                                        <li>법규 위반 및 위험 운전 행위</li>
                                        <li>차량의 임의 개조 또는 구조 변경</li>
                                    </ul>

                                    <p className="joinTosH">6. 추가 비용 발생</p>
                                    <ul className="joinContentA">
                                        <li>연료 미충전 시 연료 비용이 부과됩니다.</li>
                                        <li>지정 시간 초과 반납 시 추가 요금이 발생합니다.</li>
                                        <li>차량 손상 발생 시 손상 정도에 따라 추가 비용이 청구될 수 있습니다.</li>
                                    </ul>
                                </div>
                        </div>
                        

                        {/* 개인정보 수집 창 */}
                        <div className="joinContent">
                            <div>
                                <h4 className="joinTosH3">고객 정보 수집 및 이용 동의</h4>
                                <button className="joinAListbtn" onClick={() => setOpenB(!openB)}>
                                    {openB ? <i className="bi bi-caret-up"></i> : <i className="bi bi-caret-down"></i>}
                                </button>
                                <label className='joinLabel'>
                                    <input
                                        className='joinCheck'
                                        type="checkbox"
                                        checked={agreeB}
                                        onChange={(e) => handleAgreeB(e.target.checked)}
                                    />
                                    개인정보 수집 및 이용에 동의합니다.
                                </label>
                            </div>
                            <div className={`joinTos ${openB ? "open" : ""}`}>
                                    <p className="joinTosH">제1조 수집 목적</p>
                                    <p>
                                        (주)차랑차랑은 원활한 렌터카 서비스 제공을 위해 최소한의 고객 정보를 수집하며,
                                        해당 정보는 아래의 목적에 한해 이용됩니다.
                                    </p>
                                    <ul className="joinContentA">
                                        <li>회원 가입 및 본인 확인</li>
                                        <li>차량 예약 및 대여 서비스 제공</li>
                                        <li>고객 상담 및 민원 처리</li>
                                        <li>서비스 관련 고지 및 안내</li>
                                    </ul>

                                    <p className="joinTosH">제2조 수집 항목</p>
                                    <p>회사는 아래의 정보를 필수 또는 선택 항목으로 수집할 수 있습니다.</p>
                                    <ul className="joinContentA">
                                        <li>필수 정보: 이름, 아이디, 비밀번호, 이메일, 전화번호, 생년월일, 운전면허 정보</li>
                                        <li>선택 정보: 주소, 마케팅 수신 동의 여부</li>
                                    </ul>

                                    <p className="joinTosH">제3조 보유 및 이용 기간</p>
                                    <p>
                                        고객 정보는 가입 시점부터 회원 탈퇴 후 5일까지 보유하며,
                                        법령에 따라 보관이 필요할 경우 해당 기간 동안 별도 저장됩니다.
                                    </p>

                                    <p className="joinTosH">제4조 제3자 제공</p>
                                    <p>회사는 원칙적으로 고객 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 아래의 경우는 예외로 합니다.</p>
                                    <ul className="joinContentA">
                                        <li>법령에 따른 요청 또는 수사기관의 적법한 절차에 따른 요청</li>
                                        <li>보험 사고 처리를 위해 보험사 또는 관련 기관에 제공이 필요한 경우</li>
                                    </ul>

                                    <p className="joinTosH">제5조 정보 파기 절차</p>
                                    <p>
                                        보유 기간이 경과하거나 처리 목적이 달성된 경우 정보는 즉시 파기됩니다.
                                        전자 파일은 복구 불가능한 방식으로 삭제합니다.
                                    </p>

                                    <p className="joinTosH">제6조 고객 권리</p>
                                    <ul className="joinContentA">
                                        <li>개인정보 열람/정정/삭제 요청 가능</li>
                                        <li>수집 및 이용에 대한 동의 철회 가능</li>
                                        <li>동의 거부 시 일부 서비스 이용이 제한될 수 있음</li>
                                    </ul>

                                    <p className="joinTosH">제7조 기타</p>
                                    <p>
                                        본 약관에 명시되지 않은 사항은 개인정보 보호법 및 관련 법령을 따릅니다.
                                    </p>
                            </div>
                        </div>
                    </div>

                {/* 전체 동의 버튼 */}
                <div className="joinAllAgree">
                    <label className='joinLabelAll'>
                        <input
                            className='joinCheckAll'
                            type="checkbox"
                            checked={agreeAll}
                            onChange={(e) => handleAgreeAll(e.target.checked)}
                        />
                        모두 동의합니다.
                    </label>
                </div>

                {/* 다음 페이지 버튼 */}
                <div className="joinNextbtn">
                    <button 
                    className="joinFormNext" 
                    onClick={handleNext}>
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
}
