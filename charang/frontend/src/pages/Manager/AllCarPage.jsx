import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../contexts/Datacontext";
import { useNavigate } from "react-router-dom";
import { useMemo } from 'react';

import './AllCarPage.css';
import axios, { all } from "axios";

export default function AllCarPage() {

    const { pageNum, setPageNum, pagesHandler, paging, setPaging, bookStatusFind, allBookStatus } = useContext(DataContext);

    // =============================================================================================

    // 이동 훅
    const navigate = useNavigate();

    //  검색 차량 출력(검색값 보내기) axios
    const [searchType, setSearchType] = useState('carName');
    const [searchWord, setSearchWord] = useState('');
    const [searchCar, setSearchCar] = useState([]);

    const carFind = () => {
        // http://api/searchcar/searchType=검색타입&&searchWord="검색단어"
        axios.get("/api/searchCar", { params: { searchType: searchType, searchWord: searchWord, page: pageNum } })
            .then((res) => {
                console.log("검색어: ", searchWord);
                console.log("확인", res.data.list);
                // 검색어가 존재
                if (!searchWord == '') {
                    setPageNum(1);
                }
                setPaging(res.data.ph); // 페이징
                setSearchCar(res.data.list); // 가져온 데이터
            })
            .catch((error) => {
                console.log("검색 차량 출력 에러: ", error);
            })
    }

    // =============================================================================================

    // 예약이 있는 차량인지 확인하는 함수(true:삭제가능, false:삭제불가)
    // 삭제하면 안 되는 차량 ID 배열 만들기

    console.log("전체 예약: ", allBookStatus);


    const upCommingCar = allBookStatus
        .filter(book => book.bookingStatus === "UPCOMING" || book.bookingStatus === "ONGOING")
        .map(book => book.carId);

    console.log("전체 예약: ", allBookStatus);
    console.log("삭제하면 안되는 차량", upCommingCar);
    console.log(`전체 예약수: ${allBookStatus.length}개 / 삭제불가 차량 수: ${upCommingCar.length}대`);

    // noRes 함수에서 사용
    const noRes = (carId) => {
        // 위에서 만든 '삭제 불가 명단'에 이 carId가 포함되어 있는지 확인
        return upCommingCar.includes(carId);
    }
    // =============================================================================================

    // 처음 실행할때 find실행하여 전체 출력
    useEffect(() => {
        carFind();
        bookStatusFind();
    }, [pageNum]);

    // =============================================================================================

    // 삭제 차량의 id를 담는 상태변수
    const [delCar, setDelCar] = useState([]);

    // 체크한 해당 차량의 carId만 가져오는 핸들러
    const checkHandler = (e, carId) => {

        let delCarCopy = [...delCar]; // 얕은 복사

        // 체크되었으면(true) 
        if (e.target.checked) {
            delCarCopy.push(carId);
            setDelCar(delCarCopy);
        }
        // 다시 체크를 취소할 경우(false)
        else {
            delCarCopy = delCar.filter(id => id !== carId); // 해당 carId를 제외한 나머지 carId만 배열에 넣기
            setDelCar(delCarCopy);
        }
    }

    // ※ 차량 id만 보내면 되기때문에, 객체배열 방식이 아닌 그냥 배열 방식으로 보내도 sql에서 알아서 변환해줌( ex) 1,5,45 )
    // 차량 삭제 핸들러
    const delHandler = () => {

        // 체크를 하지 않고 삭제버튼을 눌렀을 경우
        if (delCar.length == 0) {
            alert("삭제할 차량을 선택해주세요.");
            return;
        } else {
            const confirmCancel = window.confirm('선택 차량을 삭제하시겠습니까?');
            if (!confirmCancel) return;
            axios.delete("/api/delCar", { data: delCar })
                .then((res) => {
                    console.log("삭제 결과: ", res.data);
                    if (res.data) {
                        alert("삭제되었습니다.");
                        carFind();
                    } else {
                        alert("다시 시도해주세요.");
                    }
                })
                .catch((error) => {
                    console.log("받아온 삭제 결과 에러: ", error);
                })
        }
    }

    // =============================================================================================

    // 해당 차량 상세보기
    const detailHandler = (carId) => {
        navigate(`/manager/carDetail/${carId}`);
    }

    // placeholder 삼항연산자
    const placeholderWord = () => {
        if (searchType === "carName") {
            return "모델명을 검색하세요";
        } else {
            return "차량번호를 검색하세요";
        }
    }

    // =============================================================================================

    return (
        <div className="ManagerAllCar">
            <h1>전체 차량 목록</h1>

            <div className="mac_find">
                {/* 검색 타입 */}
                <select className="mac_type" name="searchType" onChange={(e) => setSearchType(e.target.value)}>
                    <option value="carName">모델명</option>
                    <option value="carNum">차량 번호</option>
                </select>
                {/* 검색 */}
                <input className="mac_word" type="text" name="searchWord" placeholder={placeholderWord()}
                    onChange={(e) => setSearchWord(e.target.value)} />
                <button className="acp_btn" type="button" onClick={carFind}>검색</button>
                <button className="acp_Regbtn" type="button" onClick={() => { navigate('/manager/carregister') }}>등록하기</button>
                <button className="acp_btn" onClick={delHandler}>삭제하기</button>
            </div>

            <table className="m_AllCar_table">
                <thead className="m_AllCar_th">
                    <tr className="m_AllCar_tr">
                        <th className="m_AllCar_tableNum">번호</th>
                        <th className="m_AllCar_tablecod">차량코드</th>
                        <th className="m_AllCar_tableCarImg">이미지</th>
                        <th className="m_AllCar_tableCar">브랜드</th>
                        <th className="m_AllCar_tableCar">모델명</th>
                        <th className="m_AllCar_tableCarNum">차량번호</th>
                        <th className="m_AllCar_tableRegDate">등록일자</th>
                        <th className="m_AllCar_tableDel">차량삭제</th>
                    </tr>
                </thead>
                <tbody className="m_AllCar_tb">
                    {searchCar && searchCar.length > 0 ?
                        searchCar.map((item, index) => {
                            const pageSize = paging?.pageSize || 10; // 페이지당 개수
                            const rowNumber = (pageNum - 1) * pageSize + index + 1;

                            return (
                                <tr className="m_AllCar_tr" key={index}>
                                    <td className="m_AllCar_tableNum" >{rowNumber}</td>
                                    <td className="m_AllCar_tableId" onClick={() => detailHandler(item.carId)}>{item.carId}</td>
                                    <td className="m_AllCar_tableCarImg" onClick={() => detailHandler(item.carId)}>
                                        <img src={`/images/cars/${item.carImg}`} alt={item.carImg} />
                                    </td>
                                    <td className="m_AllCar_tableBrand" onClick={() => detailHandler(item.carId)}>{item.brand}</td>
                                    <td className="m_AllCar_tableModel" onClick={() => detailHandler(item.carId)}>{item.model}</td>
                                    <td className="m_AllCar_tableCarNum" onClick={() => detailHandler(item.carId)}>{item.plateNumber}</td>
                                    <td className="m_AllCar_tableRegDate">{item.regDate}</td>
                                    <td className="m_AllCar_tableDel">
                                        {/* 체크한 차량의 carId만 값을 들고옴 */}
                                        {noRes(item.carId) ?
                                            <p>예약 중</p>
                                            :
                                            <input type="checkbox" name="delcheck"
                                                className="AllCar_del" onChange={(e) => { checkHandler(e, item.carId) }}></input>
                                        }
                                    </td>
                                </tr>
                            )
                        })
                        :
                        <tr className="m_AllCar_tr_none">
                            <td className="m_AllCar_td_none" colSpan={8}>
                                차량이 존재하지 않습니다.
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
            {/* 페이징 */}
            <div className="paging">
                {/* 이전 버튼 */}
                {/* 5페이지 넘어가야 화살표 나옴 */}
                {paging.prev && (
                    <button onClick={() => setPageNum(paging.startPage - 1)}>
                        <i className="bi bi-caret-left-fill"></i>
                    </button>
                )}

                {/* 페이지 번호들 */}
                {pagesHandler(paging).map(num => (
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

        </div>
    )
}