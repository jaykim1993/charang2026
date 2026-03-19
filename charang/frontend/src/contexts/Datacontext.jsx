import { createContext, useEffect, useState } from "react"
import axios from "axios";
export const DataContext = createContext();

export default function DataProvider({children}){

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

  // 전체 회원목록 <==> 전체 예약목록 공유

  // 예약
    const [allBookCar, setAllBookCar] = useState([]);
  // 예약 전체
    const [allBookStatus, setAllBookStatus] = useState([]);
  // 회원
    const [user, setUser] = useState([]);

  // 검색어 리셋함수
  const searchResetHandler = () => {
    setSearchWordBook('');
    setUserSearchWord('');
  }

  // 예약 검색
  const [searchTypeBook, setSearchTypeBook] = useState('');
  const [searchWordBook, setSearchWordBook] = useState('');
  const [isBookLoading, setIsBookLoading] = useState(false); // 로딩 상태 추가

  // 전체 예약
    const bookFind = () => {
        // console.log("검색 타입:", searchTypeBook); 
        // console.log("검색 단어:", searchWordBook);
        setIsBookLoading(true);
        axios.get("/api/bookcarlist",{params:{searchType:searchTypeBook, searchWord:searchWordBook, page:pageNum}})
        .then((res)=>{
            if(res.data){
                setAllBookCar(res.data.list);
                setPaging(res.data.ph); // 페이징
                // console.log("예약+차량정보 : !!!! ", res.data.list);
            }
        })
        .catch((error)=>{
            console.log("예약정보 받기 서버 오류", error);
        })
        .finally(()=> setIsBookLoading(false));
    }

  // 회원 검색
  const [userSearchType, setUserSearchType] = useState('userId');
  const [userSearchWord, setUserSearchWord] = useState('');
  const [sortType, setSortType] = useState('userId');
  const [sort, setSort] = useState('asc');
  // console.log(sortType)
  // console.log(sort)
  const [isUserLoading, setIsUserLoading] = useState(false); // 로딩 상태 추가
  // 전체 회원
  // DataContext.js 내의 userFind 함수
  const userFind = (word = userSearchWord) => { // word 인자 추가
      setIsUserLoading(true);
      axios.get("/api/searchUser", {
          params: {
              searchType: userSearchType,
              searchWord: word, // ◀ 중요: 상태값이 아닌 인자로 받은 word를 사용
              page: pageNum,
              sortType: sortType,
              sort: sort
          }
      })
      .then((res) => {
          setUser(res.data.list);
          setPaging(res.data.ph);
      })
      .catch((error) => console.log("검색 에러: ", error))
      .finally(() => setIsUserLoading(false));
  }

    // 전체 예약 (관리자용)
    const bookStatusFind = () => {
        axios.get("/api/booklistStatus")
        .then((res)=>{
            if(res.data){
                setAllBookStatus(res.data);
                // console.log("관리자확인용 예약+차량정보 ", res.data);
            }
        })
        .catch((error)=>{
            console.log("예약정보 받기 서버 오류", error);
        })
    }

  // =============================================================================================================
  // 차량 전체 출력 
  const[car, setCar]=useState([]);

      useEffect(()=>{
        axios.get("/api/")
        .then((res)=>{
          // console.log("받아온 차량데이터", res.data);
          if(res.data){
            setCar(res.data);
          }
        })
        .catch((error)=>{
          console.log("받아온 차량에러", error)
        })
      },[])

      // 차량 전체 출력 함수 버전
      const allCar = () => {
        axios.get("/api/")
        .then((res)=>{
          // console.log("받아온 차량데이터", res.data);
          if(res.data){
            setCar(res.data);
          }
        })
        .catch((error)=>{
          console.log("받아온 차량에러", error)
        })
      }

  // 지점 전체 출력 
  // 111
  const[branch,setBranch]=useState([]);

      useEffect(()=>{
        axios.get("/api/branch")
        .then((res)=>{
          // console.log("받아온 지점데이터", res.data);
          if(res.data){
            setBranch(res.data);
          }
        })
        .catch((error)=>{
          console.log("받아온 지점에러", error)
        })
      },[])


  return(
    <>
      <DataContext.Provider 
      value={{
              car, 
              branch, 
              allCar,
              // 페이징
              pageNum, 
              setPageNum, 
              pagesHandler, 
              paging, 
              setPaging, 
              // 전체 예약
              allBookCar, 
              setAllBookCar, 
              // 회원 출력 변수
              user, 
              setUser, 
              setSortType,
              setSort,
              sortType,
              sort,
              // 예약 출력
              bookFind, 
              // 회원 출력
              userFind, 
              // 검색 - 회원
              userSearchType,
              setUserSearchType,
              setUserSearchWord,
              userSearchWord,
              // 검색 - 예약
              setSearchWordBook,
              searchTypeBook,
              setSearchTypeBook,
              searchWordBook, 
              searchResetHandler, // 검색 리셋 핸들러
              // 전체 예약 (관리자용)
              bookStatusFind, // 함수
              allBookStatus, // 변수

              // 로딩 보내기
              isUserLoading, // 유저
              isBookLoading // 예약
              }}>
        {children}
      </DataContext.Provider>
    </>
  )
}
