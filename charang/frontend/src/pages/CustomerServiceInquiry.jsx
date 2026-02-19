 // 로그인 상태 받아오기
import { useContext } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import './CustomerService.css'
import { AuthContext } from "../contexts/Authcontext"
import { useNavigate } from "react-router-dom"

export default function CustomerServiceInquiry(){
    
    // 로그인 페이지 열기 상태 받아오기(setModal) - 12.22 성중 추가
    const {userid, setModal, username}=useContext(AuthContext)
    console.log(userid)
    const isLogin = !!userid;
    console.log(isLogin)
  const today= new Date()
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const week = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const day = week[today.getDay()];
    const custoday = `${year}. ${month}. ${date} ${day}`;

    //날짜 따오기 
    function formatDate(date) {
        const d = new Date(date);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0"); // 월은 0~11
        const day = String(d.getDate()).padStart(2, "0");

        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const seconds = String(d.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} / ${hours}:${minutes}:${seconds}`;
        }
    
    // 1:1문의 로컬스토리지 남기기
    const [inquiries,setInquiries]=useState([]); //전체문의내역 배열

    const [inquiriesTitle,setInquiriesTitle]=useState(''); //문의 제목
    const [inquiriesContent,setInquiriesContent]=useState(''); //문의 본문
    const inquiriesHandler = () => {
    if (!inquiriesTitle || !inquiriesContent) return alert("모든 항목을 입력하세요");
        
    const newinquiries ={id:Date.now(),
                        userid:userid,
                        title:inquiriesTitle,
                        content:inquiriesContent,
                        whenCreate:formatDate(new Date())
    }
    //제이슨형태로 현재 빈 배열에있는걸 읽고 
    const prev = JSON.parse(localStorage.getItem("inquiries")) || [];

    const updatedInquiries = [newinquiries,...prev ];
        localStorage.setItem("inquiries", JSON.stringify(updatedInquiries));

    setInquiries(updatedInquiries);
    setInquiriesTitle('')
    setInquiriesContent('')
    alert('1:1문의 등록이 완료되었습니다.')
    }
return(
    <>
   {(isLogin?

        //로그인상태일때
        <div>
            <h3>1:1 문의</h3>
            <div className="modal1Content">
                <span >안녕하세요 <span className="modal1Contentspan">{username}</span>님</span>
                <p>무엇을 도와드릴까요?</p>
                <input className="modal1title" type="text" placeholder="제목을 입력하세요." onChange={(e)=>setInquiriesTitle(e.target.value)} value={inquiriesTitle}/>
                <textarea className="modal1content" type="text" placeholder="문의 내용을 입력하세요." onChange={(e)=>setInquiriesContent(e.target.value)} value={inquiriesContent}/>
            </div>
            <div className="submitinqu">
                <button onClick={inquiriesHandler} >등록하기</button>
            </div>
        </div>
        :
        //비로그인상태일때
        <div>
            <p className="havetologin">1:1문의는 로그인 이후에 이용할 수 있어요.</p>
            <div className="submitinqu">
                <button onClick={() => setModal('login')} >로그인하기</button>
            </div>
        </div>
    )}
    </>
)
}

