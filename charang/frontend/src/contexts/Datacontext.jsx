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
  // 회원
    const [ user, setUser] = useState([]);

  // 검색
    const [searchType, setSearchType] = useState('');
    const [searchWord, setSearchWord] = useState('');

  // 전체 예약
    const bookFind = () => {
        console.log("검색 타입:", searchType); 
        console.log("검색 단어:", searchWord);
        axios.get("/api/bookcarlist",{params:{searchType:searchType, searchWord:searchWord, page:pageNum}})
        .then((res)=>{
            if(res.data){
                setPaging(res.data.ph);
                setAllBookCar(res.data.list);
                console.log("예약+차량정보 ", res.data.list);
            }
        })
        .catch((error)=>{
            console.log("예약정보 받기 서버 오류", error);
        })
    }

  // 전체 회원
  const userFind = () => {
        axios.get("/api/searchUser",{params:{searchType:'',searchWord:''}})
        .then((res)=>{
            console.log("검색 회원: ",res.data);
            setPaging(res.data.ph); // 페이징
            setUser(res.data.list); // 검색 회원 가져온 데이터
        })
        .catch((error)=>{
            console.log("검색 회원 출력 에러: ",error);
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
      value={{car, branch, pageNum, setPageNum, pagesHandler, paging, setPaging, 
              allBookCar, setAllBookCar, user, setUser, bookFind, userFind, setSearchType, setSearchWord}}>
        {children}
      </DataContext.Provider>
    </>
  )
}
