import { useContext } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import './CustomerService.css'
import { AuthContext } from "../contexts/Authcontext"
import { useNavigate } from "react-router-dom"



export default function CustomerServiceFAQ(){
  //FAQ state 토글
    const [openIndex, setOpenIndex] = useState(null);
    //FAQ나올값
    const faqList = [
    {
        q: '차량대여는 모든 연령이 가능한가요?',
        a: '차랑차랑 렌터카 상품은 최소 만 21세 이상 대여가 가능해요'
    },
    {
        q: '타인이 대리 예약 할 수 있나요?',
        a: '타인 예약은 불가능해요. 예약 시 결제카드 소유주와 운전자, 결제자가 모두 동일해야 합니다.'
    },
    {
        q: '지점에 직접 연락해서 예약하는 것도 가능한가요?',
        a: `차랑차랑 렌터카 지점을 통해 직접 예약하시는것도 가능합니다.
        대여하고자 하는 지점으로 직접 연락하셔서 대여 기간과 차종을 말씀해주시고,
        회원 할인 등 적용되는 할인 프로그램을 선택하시어 예약 후 사용하시면 됩니다.`
    },
    {
        q: '차량 내부에서 흡연시 클리닝 비용이 청구되나요?',
        a: '차량 내부에서 흡연으로 인하여 차량 내 오염 또는 악취 발생시 실내 클리닝 비용이 청구됩니다.'
    },
    {
        q: '사고 발생 시에는 어떻게 해야 하나요?',
        a: '1599-9111로 전화 후 1번 사고접수를 선택해주세요.'
    }
]

return(
<>
<div className="CusFAQ">
    <h2 className="guideMainText">자주 찾는 질문</h2>
    {faqList.map((item, index) => (
        <div key={index}>
        <div onClick={() => 
            setOpenIndex(openIndex === index ? null : index)
        }>
            <span className="CusFAQSpan">Q. {item.q} 
                <i className={`bi bi-chevron-down ${openIndex === index ? 'active' : ''}`}></i>
            </span>
        </div>
        {openIndex === index && (
            <div className="togglediv">
            <p>A. {item.a}</p>
            </div>
        )}
        </div>
    ))}
</div>
</>
)

}