// react에서 자료 공유
import axios from "axios";
import { createContext, useState, useEffect} from "react";

// 공유할 데이터가 저장되는 저장소
export const AuthContext = createContext();

// Provider 함수 생성
export default function AuthProvider({children}){
    // 상태 저장 변수
    // 마이페이지, 예약 내 사용을 위해 입력된 모든 값을 저장함
    const[userid, setUserid]=useState(null);
    const[username, setUsername]=useState(null);

    // 컴포넌트 마운트 될 때 localStorage에서 사용자 정보 불러오기

    useEffect(() => {
    const saveUser = sessionStorage.getItem("userid");
    if (saveUser) {
        const userData = JSON.parse(saveUser);

    setUserid(userData.userId);
    setUsername(userData.name);
    }
    }, []);

    // 로그인 함수
      const loginsave = (userData) => {
        sessionStorage.setItem("userid",JSON.stringify(userData));
        setUserid(userData.userId);
        setUsername(userData.name);
    };

    // 로그아웃 함수
    const logout =()=>{
        //세션 스토리지 정보 삭제
        sessionStorage.removeItem("userid");
        alert("로그아웃 되었습니다. 메인페이지로 이동합니다.")
        //초기값 null
        setUserid(null);
        setUsername(null);
}

    // 로그인 및 회원가입 열기
     const [modal, setModal] = useState(null); // 값 : 'login' | 'joinA' | 'joinB' | 'joinC' | null

    // 미로그인 상태에서 로그인 필요한 페이지 링크 클릭 시 함수
    const loginNeeded =() => {
        alert('로그인 후 이용 가능합니다.')
        setModal('login')
    }

    // ================================================ 페이징 ====================================================
    // 서버에서 받은 ph
    const [paging, setPaging] = useState({}); 
    // 현재 페이지 번호 (기본값 1)
    const [pageNum, setPageNum] = useState(1); 

    // 페이지 이동 핸들러
    const pagesHandler = () => {
      const pageNumbers = [];
      // paging 가 있고, startPage와 endPage가 계산되었을 때만 작동
      if(paging.startPage && paging.endPage){
          for(let i = paging.startPage; i <= paging.endPage; i++){
              pageNumbers.push(i);
          }
      }
      // console.log("페이징 확인: ", pageNumbers);
      return pageNumbers;
    }
  // =============================================================================================================

    // 전체 회원 출력
    // const [allUser, setAllUser] = useState([]);

    // useEffect(()=>{
    //     axios.get("/api/alluser")
    //     .then((res)=>{
    //         // console.log("전체 회원 출력: ",res.data);
    //         if(res.data){
    //             setAllUser(res.data);
    //         }
    //     })
    //     .catch((error)=>{
    //         console.log("전체 회원 출력 에러: ",error);
    //     })
    // },[]);

    // 검색 회원 출력
    const [search, setSearch] = useState(null); // 검색어 담는 상태변수
    const [ user, setUser] = useState([]);

    const find = () => {
        axios.get("/api/searchUser",{params:{search:search,page:pageNum}})
        .then((res)=>{
            console.log("검색 회원: ",res.data);
            setPaging(res.data.ph); // 페이징
            setUser(res.data.list); // 검색 회원 가져온 데이터
        })
        .catch((error)=>{
            console.log("검색 회원 출력 에러: ",error);
        })
    }


    // 회원 수정

    // 회원 삭제
    const [delUser, setDelUser] = useState([]);
    // 체크된 회원의 id만 가져오는 핸들러
    const checkHandler = (e, userId) => {

        let delUserCopy = [...delUser];

        // 체크되어있으면 delUser배열에 넣기(true)
        if(e.target.checked){
            delUserCopy.push(userId);
            setDelUser(delUserCopy);
        }
        // 체크를 했다가 취소할 경우(false)
        else{
            delUserCopy = delUser.filter(id => id !== userId);
            setDelUser(delUserCopy);
        }
    }

    const delHandler = () => {
        axios.post("/api/userDelete",delUser)
        .then((res)=>{
            console.log("삭제 결과: ", res.data);
            if(res.data){
                alert("삭제되었습니다");
            }else{
                alert("다시 시도해주세요.");
            }
        })
        .catch((error)=>{
            console.log("받아온 삭제 결과 에러: ", error);
        })
    }
    


    // 공유할 변수, 함수 내보내기
    return(
        <AuthContext.Provider 
        value={{
            userid,
            username,
            loginsave, 
            logout,
            modal,
            setModal,
            loginNeeded,
            setSearch,
            find,
            search,
            user,
            // 페이징
            pagesHandler,
            paging,
            delHandler,
            checkHandler,
            setPageNum
            }}>
            {children}
        </AuthContext.Provider>
    )
}