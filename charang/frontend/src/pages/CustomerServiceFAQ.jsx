import { useState } from "react"
import './CustomerService.css'
import { Link } from "react-router-dom";

export default function CustomerServiceFAQ() {
  //FAQ state 토글
  const [openIndex, setOpenIndex] = useState(0);
  //FAQ나올값
  const faqList = [
    {
      q: '차량대여는 모든 연령이 가능한가요?',
      a: `차랑차랑 렌터카는 안전한 운행과 보험 규정에 따라
        만 21세 이상, 운전면허 취득 후 1년 이상 경과한 고객만 대여가 가능합니다.

        일부 고급 차량 및 수입 차량의 경우
        만 26세 이상 또는 면허 취득 3년 이상 조건이 추가로 적용될 수 있습니다.

        대여 전 반드시 면허 유효기간과 운전 경력을 확인해주시기 바랍니다.`
    },
    {
      q: '타인이 대리 예약 할 수 있나요?',
      a: `차량 대여는 예약자 본인만 가능합니다.

          예약 시 입력한 정보와 실제 방문 고객의 신분증,
          운전면허증, 결제 카드 명의가 모두 동일해야 하며,
          일치하지 않을 경우 차량 인수가 제한될 수 있습니다.

          부득이한 경우에는 예약 취소 후
          실제 운전자 명의로 다시 예약해주시기 바랍니다.`
    },
    {
      q: '지점에 직접 연락해서 예약하는 것도 가능한가요?',
      a: `네, 가능합니다.

원하시는 지점으로 직접 연락하셔서
대여 일정, 차종, 보험 선택 여부를 안내받은 뒤 예약하실 수 있습니다.

단, 온라인 예약 시 적용되는 일부 할인 혜택은
지점 예약과 상이할 수 있으니 참고 부탁드립니다.`
    },
    {
      q: '차량 내부에서 흡연시 클리닝 비용이 청구되나요?',
      a: `전 차량은 금연 차량으로 운영되고 있습니다.

차량 내부 흡연으로 인해 악취가 발생하거나
재, 담배꽁초, 실내 오염 등이 확인될 경우
전문 실내 클리닝 비용이 청구됩니다.

상황에 따라 최소 10만원에서 최대 30만원까지
청소 비용이 부과될 수 있으니 이용 시 유의해주시기 바랍니다.`
    },
    {
      q: '사고 발생 시에는 어떻게 해야 하나요?',
      a: `사고 발생 시에는 침착하게 아래 절차를 따라주시기 바랍니다.

1. 차량을 안전한 장소로 이동
2. 부상자 여부 확인 후 필요 시 119 신고
3. 1599-9111 고객센터로 즉시 사고 접수
4. 사고 현장 및 차량 손상 부위 사진 촬영
5. 상대 차량 정보 및 연락처 확보

임의로 합의하거나 현장을 이탈할 경우
보험 처리가 제한될 수 있으니 반드시 고객센터에 먼저 연락해주시기 바랍니다.`
    },
    {
      q: '차량 반납 시 연료는 어떻게 해야 하나요?',
      a: `차량은 대여 시 연료 상태와 동일하게 반납해주셔야 합니다.

연료가 부족한 상태로 반납할 경우
부족분에 대한 주유 비용과 함께 주유 대행 수수료가 추가 청구됩니다.

반납 전 인근 주유소에서 미리 주유 후 방문해주시길 권장드립니다.`
    },
    {
      q: '차량 반납 시간을 초과하면 어떻게 되나요?',
      a: `반납 시간이 초과될 경우 1시간 단위로 추가 요금이 부과됩니다.

3시간 이상 초과 시에는 1일 요금이 적용될 수 있으며,
사전 연락 없이 장시간 미반납 시
법적 조치가 진행될 수 있습니다.

부득이하게 연장이 필요한 경우
반드시 사전에 지점 또는 고객센터로 연락해주시기 바랍니다.`
    }
  ];

  return (
    <div className="CusFAQ">
      <h4>자주 찾는 질문 FAQ</h4>
      <div className="chat-container">
        {faqList.map((item, index) => (
          <div key={index} className="chat-row">
            {/* 질문 */}
            <div
              className="chat-bubble question"
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)}>
              <div className="chat-text">
                {item.q}
              </div>
            </div>
            {/* 답변 */}
            {openIndex === index && (
              <>
                <div className="chat-bubble answer">
                  {/* <img src="/images/customer/answer.png" alt="aswerlogo" className="Alogo" /> */}
                  <div className="chat-text2">
                    {item.a}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <p>
        더 궁금한 사항은 &nbsp;
      <Link to={'/customerservice/inquiry/list'}>
        문의하기
      </Link>
      를 이용해주세요.
      </p>
    </div>
  )

}