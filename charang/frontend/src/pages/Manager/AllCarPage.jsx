import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../contexts/Datacontext";

import './AllCarPage.css';
import axios from "axios";

export default function AllCarPage(){

    const {car, find, setSearchType, setSearchWord, searchCar, pageNum, setPageNum, pagesHandler, paging} = useContext(DataContext);

    // 처음 실행할때 find실행하여 전체 출력
    useEffect(()=>{
        find();
    },[]);


    useEffect(()=>{
        find();
    },[pageNum]);

    useEffect(() => {
        console.log("paging 상태가 변경됨!! : ", paging);
    }, [paging]); // paging 값이 바뀔 때마다 실행됨

    // 삭제 차량의 id를 담는 상태변수
    const [delCar, setDelCar] = useState([]);

    // 체크한 해당 차량의 carId만 가져오는 핸들러
    const checkHandler = (e, carId) => {

        const delCarCopy = [...delCar]; // 얕은 복사

    //해연씨 여기 오류요 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //     // 체크되었으면(true) 
    //     if(e.target.checked){
    //         delCarCopy.push(carId);
    //         setDelCar(delCarCopy);
    //     }
    //     // 다시 체크를 취소할 경우(false)
    //     else{
    //         delCarCopy = delCar.filter(id => id !== carId); // 해당 carId를 제외한 나머지 carId만 배열에 넣기
    //         setDelCar(delCarCopy);
    //     }
    //해연씨 여기 오류요 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
     }

    // ※ 차량 id만 보내면 되기때문에, 객체배열 방식이 아닌 그냥 배열 방식으로 보내도 sql에서 알아서 변환해줌( ex) 1,5,45 )
    // 차량 삭제 핸들러
    const delHandler = () => {

        // 체크를 하지 않고 삭제버튼을 눌렀을 경우
        if(delCar.length == 0){
            alert("삭제할 차량을 선택해주세요.");
            return;
        }else{
            axios.post("/api/delCar",delCar)
            .then((res)=>{
                console.log("삭제 결과: ", res.data);
                if(res.data){
                    alert("삭제되었습니다.");
                }else{
                    alert("다시 시도해주세요.");
                }
            })
            .catch((error)=>{
                console.log("받아온 삭제 결과 에러: ", error);
            })
        }
    }

    return(
        <div className="ManagerAllCar">
            <h1>전체 차량 목록</h1>

            {/* 검색 타입 */}
            <select name="searchType" onChange={(e)=> setSearchType(e.target.value)}>
                <option value="carName">차량 이름</option>
                <option value="carNum">차량 번호</option>
            </select>
            {/* 검색 */}
            <input type="text" name="searchWord" onChange={(e)=> setSearchWord(e.target.value)}/>
            <button type="button" onClick={find}>검색</button>

            <table className="m_AllCar_table">
                <thead className="m_AllCar_th">
                    <tr className="m_AllCar_tr">
                        <th className="m_AllCar_tableNum">번호</th>
                        <th className="m_AllCar_tableCarImg">이미지</th>
                        <th className="m_AllCar_tableCar">차량</th>
                        <th className="m_AllCar_tableCarNum">차량 번호</th>
                        <th className="m_AllCar_tableRegDate">등록일자</th>
                        <th className="m_AllCar_tableDel">삭제</th>
                    </tr>
                </thead>
                <tbody className="m_AllCar_tb">
                    {searchCar && searchCar.length > 0 ?
                        searchCar.map((item,index)=>(
                            <tr className="m_AllCar_tr" key={index}>
                                <td className="m_AllCar_tableNum">{item.carId}</td>
                                <td className="m_AllCar_tableCarImg">
                                    <img src={`/images/cars/${item.carImg}`} alt={item.carImg}/>
                                </td>
                                <td className="m_AllCar_tableCar">{item.brand} / {item.model}</td>
                                <td className="m_AllCar_tableCarNum">{item.plateNumber}</td>
                                <td className="m_AllCar_tableRegDate">{item.regDate}</td>
                                <td className="m_AllCar_tableDel">
                                    {/* 체크한 차량의 carId만 값을 들고옴 */}
                                    <input type="checkbox" name="delcheck" 
                                    className="AllCar_del" onChange={(e)=>{checkHandler(e, item.carId)}}></input>
                                </td>
                            </tr>
                        ))
                    :
                        <tr className="m_AllCar_tr_none" colspan={6}>
                            <td className="m_AllCar_td_none">
                                차량이 존재하지 않습니다.
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
             {/* 페이징 */}
                <div className="notice_paging">
                    {/* 이전 버튼 */}
                    {/* 5페이지 넘어가야 화살표 나옴 */}
                    {paging.prev && (
                        <button onClick={() => setPageNum(paging.startPage - 1)}>
                            <i className="bi bi-caret-left-fill"></i>
                        </button>
                    )}

                    {/* 페이지 번호들 */}
                    {pagesHandler().map(num => (
                        <button key={num} className={pageNum === num ? "active" : ""} onClick={() => setPageNum(num)}>
                            {num}
                        </button>
                    ))}

                    {/* 다음 버튼 */}
                    {paging.next && (
                        <button onClick={() => setPageNum(paging.endPage + 1)}>
                            <i className="bi bi-caret-right-fill"></i>
                        </button>
                    )}
                </div>
            <div className="btn_part">
                <button className="del_btn" onClick={delHandler}>삭제하기</button>
            </div>
        </div>
    )
}