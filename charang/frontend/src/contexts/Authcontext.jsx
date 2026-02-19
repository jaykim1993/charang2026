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
    // const[userpw, setUserpw]=useState(null);
    const[username, setUsername]=useState(null);
    const[user_email, setUser_email]=useState(null);
    const[user_resistnum, setUser_resistnum]=useState(null);
    const[user_phonenum, setUser_phonenum]=useState(null);
    const[address, setAddress]=useState(null);
    const[address_detail, setAddress_detail]=useState(null);
    const[user_iskorean, setUser_iskorean]=useState(null);
    const[user_license, setUser_license]=useState(null);

    // 컴포넌트 마운트 될 때 localStorage에서 사용자 정보 불러오기
    useEffect(() => {
        const savedUserid = localStorage.getItem("userid");
        if (savedUserid) {
        setUserid(savedUserid);
        }
        const savedUsername = localStorage.getItem("username");
        if (savedUsername) {
        setUsername(savedUsername);
        }
        const savedUser_email = localStorage.getItem("user_email");
        if (savedUser_email) {
        setUser_email(savedUser_email);
        }
        const savedUser_resistnum = localStorage.getItem("user_resistnum");
        if (savedUser_resistnum) {
        setUser_resistnum(savedUser_resistnum);
        }
        const savedUser_phonenum = localStorage.getItem("user_phonenum");
        if (savedUser_phonenum) {
        setUser_phonenum(savedUser_phonenum);
        }
        const savedUser_address = localStorage.getItem("address");
        if (savedUser_address) {
        setAddress(savedUser_address);
        }
        const savedUser_address_detail = localStorage.getItem("address_detail");
        if (savedUser_address_detail) {
        setAddress_detail(savedUser_address_detail);
        }
        const savedUser_iskorean = localStorage.getItem("user_iskorean");
        if (savedUser_iskorean) {
        setUser_iskorean(savedUser_iskorean);
        }
        const savedUser_license = localStorage.getItem("user_license");
        if (savedUser_resistnum) {
        setUser_license(savedUser_license);
        }
    }, []);
    // 로그인 정보 저장 함수
      const loginsave = (userData) => {
        // userData 전체 중 userid, username 저장
        setUserid(userData.userid);
        setUsername(userData.username);
        setUser_email(userData.user_email);
        setUser_resistnum(userData.user_resistnum);
        setUser_phonenum(userData.user_phonenum);
        setAddress(userData.address);
        setAddress_detail(userData.address_detail);
        setUser_iskorean(userData.user_iskorean);
        setUser_license(userData.user_license);
        localStorage.setItem("userid", userData.userid);
        localStorage.setItem("username", userData.username);
        localStorage.setItem("user_email", userData.user_email);
        localStorage.setItem("user_resistnum", userData.user_resistnum);
        localStorage.setItem("user_phonenum", userData.user_phonenum);
        localStorage.setItem("address", userData.address);
        localStorage.setItem("address_detail", userData.address_detail);
        localStorage.setItem("user_iskorean", userData.user_iskorean);
        localStorage.setItem("user_license", userData.user_license);
        console.log("로그인 시도 값", userid, username, address_detail);
    };

    // 로그아웃 함수
    const logout = () => {
        setUserid(null);
        setUsername(null);
        setUser_email(null);
        setUser_resistnum(null);
        setUser_phonenum(null);
        setAddress(null);
        setAddress_detail(null);
        setUser_iskorean(null);
        setUser_license(null);
        localStorage.removeItem("userid");
        localStorage.removeItem("username");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_resistnum");
        localStorage.removeItem("user_phonenum");
        localStorage.removeItem("address");
        localStorage.removeItem("address_detail");
        localStorage.removeItem("user_iskorean");
        localStorage.removeItem("user_license");
    };

    // 로그인 및 회원가입 열기
     const [modal, setModal] = useState(null); // 값 : 'login' | 'joinA' | 'joinB' | 'joinC' | null

    // 미로그인 상태에서 로그인 필요한 페이지 링크 클릭 시 함수
    const loginNeeded =() => {
        alert('로그인 후 이용 가능합니다.')
        setModal('login')
    }

    // 전체 회원 출력
    const [allUser, setAllUser] = useState([]);

    useEffect(()=>{
        axios.get("/api/alluser")
        .then((res)=>{
            console.log("전체 회원 출력: ",res.data);
            if(res.data){
                setAllUser(res.data);
            }
        })
        .catch((error)=>{
            console.log("전체 회원 출력 에러: ",error);
        })
    },[]);

    // 검색 회원 출력
    const [search, setSearch] = useState(null);


    // 회원 수정

    // 회원 삭제

    


    // 공유할 변수, 함수 내보내기
    return(
        <AuthContext.Provider 
        value={{
            userid, 
            username, 
            user_email, 
            user_resistnum, 
            user_phonenum, 
            address, 
            address_detail, 
            user_iskorean, 
            user_license ,
            loginsave, 
            logout,
            modal,
            setModal,
            loginNeeded,
            allUser
            }}>
            {children}
        </AuthContext.Provider>
    )
}