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

  // 검색 onclick()
  //  검색 차량 출력(검색값 보내기)
  const [searchType, setSearchType] = useState('carName');
  const [searchWord, setSearchWord] = useState('');
  const [searchCar, setSearchCar] = useState([]);

  const find = () => {
    // console.log("검색 타입:", searchType); 
    // console.log("검색 단어:", searchWord);

    // http://api/searchcar/searchType=검색타입&&searchWord="검색단어"
      axios.get("/api/searchCar",{params:{searchType:searchType, searchWord:searchWord, page:pageNum}})
      .then((res)=>{
          console.log("확인" , res.data.list);
          setPaging(res.data.ph); // 페이징
          setSearchCar(res.data.list); // 가져온 데이터
      })
      .catch((error)=>{
        console.log("검색 차량 출력 에러: ", error);
      })
   }

  // 차량 등록 

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
      value={{car, branch, find, setSearchType, setSearchWord,
       searchCar, pageNum, setPageNum, pagesHandler, paging, setPaging}}>
        {children}
      </DataContext.Provider>
    </>
  )
}
