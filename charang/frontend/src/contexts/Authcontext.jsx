// react에서 자료 공유
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
            loginNeeded
            }}>
            {children}
        </AuthContext.Provider>
    )
}