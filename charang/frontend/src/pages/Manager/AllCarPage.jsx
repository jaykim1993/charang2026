import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../contexts/Datacontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './AllCarPage.css';

export default function AllCarPage() {
    // DataContext에서 isLoading 추가로 가져오기
    const { 
        pageNum, setPageNum, pagesHandler, paging, setPaging, 
        bookStatusFind, allBookStatus, car, allCar, searchResetHandler,
        isLoading // 로딩 상태 추가
    } = useContext(DataContext);

    const navigate = useNavigate();

    // 로컬 상태들
    const [searchType, setSearchType] = useState('carName');
    const [searchWord, setSearchWord] = useState('');
    const [sortType, setSortType] = useState('carId');
    const [sort, setSort] = useState('desc');
    const [searchCar, setSearchCar] = useState([]);
    const [isCarLoading, setIsCarLoading] = useState(false);

    // 초기화 로직
    useEffect(() => {
        setPageNum(1);
        searchResetHandler();
    }, []);

    // 차량 검색 API 호출 함수
    const carFind = () => {
        setIsCarLoading(true);
        // DataProvider 내부에서 setIsLoading(true/false) 처리가 되어 있어야 합니다.
        axios.get("/api/searchCar", { 
            params: { searchType, searchWord, page: pageNum, sortType, sort } 
        })
        .then((res) => {
            setPaging(res.data.ph);
            setSearchCar(res.data.list);
        })
        .catch((error) => {
            console.log("검색 차량 출력 에러: ", error);
        })
        .finally(() => {
        setIsCarLoading(false); // 성공하든 실패하든 요청 끝나면 로딩 종료
        });
    }

    // 검색 핸들러
    const searchHandler = () => {
        setPageNum(1);
        carFind();
    }

    // 정렬 핸들러
    const sortHandler = (type) => {
        if (sortType === type) {
            setSort(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortType(type);
            setSort("desc"); // 새로운 타입 클릭 시 기본 desc
        }
        setPageNum(1);
    }

    // 예약 상태 확인 (삭제 불가 차량 리스트 생성)
    const upCommingCar = allBookStatus
        .filter(book => book.bookingStatus === "UPCOMING" || book.bookingStatus === "ONGOING")
        .map(book => book.carId);

    const noRes = (carId) => upCommingCar.includes(carId);

    // 데이터 감시 및 재호출
    useEffect(() => {
        carFind();
        bookStatusFind();
    }, [pageNum, sortType, sort]);

    // 삭제 관련 로직
    const [delCar, setDelCar] = useState([]);
    const checkHandler = (e, carId) => {
        if (e.target.checked) {
            setDelCar(prev => [...prev, carId]);
        } else {
            setDelCar(prev => prev.filter(id => id !== carId));
        }
    }

    const delHandler = () => {
        if (delCar.length === 0) {
            alert("삭제할 차량을 선택해주세요.");
            return;
        }
        const confirmCancel = window.confirm(`${delCar.length}개의 차량데이터를 삭제하시겠습니까?`);
        if (!confirmCancel) return;

        axios.delete("/api/delCar", { data: delCar })
            .then((res) => {
                if (res.data) {
                    alert(`${delCar.length}개의 차량데이터가 삭제되었습니다.`);
                    setDelCar([]);
                    carFind();
                    
                    // 로컬스토리지 동기화
                    const recentCars = localStorage.getItem("recentView"); 
                    if (recentCars) {
                        const parsedCars = JSON.parse(recentCars);
                        const updatedCars = parsedCars.filter(c => !delCar.includes(c.carId));
                        localStorage.setItem("recentView", JSON.stringify(updatedCars));
                    }
                    allCar();
                } else {
                    alert("다시 시도해주세요.");
                }
            })
            .catch((error) => console.log("삭제 에러: ", error));
    }

    const detailHandler = (carId) => navigate(`/manager/carDetail/${carId}`);

    const placeholderWord = () => {
        if (searchType === "carName") return "모델명을 검색하세요";
        if (searchType === "carNum") return "차량번호를 검색하세요";
        return "브랜드를 검색하세요";
    }
    
    useEffect(() => {
        if (searchWord === "") {
            setPageNum(1);
            carFind();
        }
    }, [searchWord]);

    const inputDelHandler = () => {
        setSearchWord("");
        setPageNum(1);
        setSortType("carId");  // 정렬 기준을 carId(기본값)로 리셋
        setSort("desc");       // 정렬 방향을 desc(내림차순)로 리셋
    }

    return (
        <div className="ManagerAllCar">
            <h1>전체 차량목록</h1>

            <div className="mac_find">
                <div className="MAC_search">
                    <select className="mac_type" onChange={(e) => setSearchType(e.target.value)}>
                        <option value="carName">모델명</option>
                        <option value="carNum">차량번호</option>
                        <option value="carBrand">브랜드</option>
                    </select>
                    <input className="mac_word" type="text" placeholder={placeholderWord()} value={searchWord}
                        onChange={(e) => setSearchWord(e.target.value)} />
                    {searchWord !== "" && <i className="bi bi-x-circle-fill" onClick={inputDelHandler}></i>}
                    <button className="acp_btn" onClick={searchHandler}>검색</button>
                </div>
                <div className="MAC_BTN">
                    <button className="acp_Regbtn" onClick={() => navigate('/manager/carregister')}>등록하기</button>
                    <button className="acp_btn" onClick={delHandler}>삭제하기</button>
                </div>
            </div>

            <table className="m_AllCar_table">
                <thead className="m_AllCar_th">
                    <tr className="m_AllCar_tr">
                        <th className="m_AllCar_tableNum">번호</th>
                        <th onClick={() => sortHandler("carId")} className="m_AllCar_tableTh">차량ID<i class="bi bi-chevron-down"></i></th>
                        <th className="m_AllCar_tableCarImg">이미지</th>
                        <th onClick={() => sortHandler("brand")} className="m_AllCar_tableTh">브랜드<i class="bi bi-chevron-down"></i></th>
                        <th onClick={() => sortHandler("model")} className="m_AllCar_tableTh">모델명<i class="bi bi-chevron-down"></i></th>
                        <th onClick={() => sortHandler("number")} className="m_AllCar_tableTh">차량번호<i class="bi bi-chevron-down"></i></th>
                        <th onClick={() => sortHandler("regDate")} className="m_AllCar_tableTh">등록일자<i class="bi bi-chevron-down"></i></th>
                        <th className="m_AllCar_tableDel">삭제<p>({delCar.length}/{car.length})</p></th>
                    </tr>
                </thead>

                {/* --- Step.2 로딩 상태 적용 --- */}
                {isCarLoading ? (
                    <tbody className="m_AllCar_tb">
                        <tr className="m_AllCar_tr_none">
                            <td colSpan={8} className="m_AllCar_td_none">
                                차량정보를 불러오는 중입니다...
                            </td>
                        </tr>
                    </tbody>
                ) : (
                    <tbody className="m_AllCar_tb">
                        {searchCar && searchCar.length > 0 ? (
                            searchCar.map((item, index) => {
                                const pageSize = paging?.pageSize || 10;
                                const rowNumber = (pageNum - 1) * pageSize + index + 1;
                                return (
                                    <tr className="m_AllCar_tr" key={item.carId || index}>
                                        <td className="m_AllCar_tableNum">{rowNumber}</td>
                                        <td className="m_AllCar_tableId" onClick={() => detailHandler(item.carId)}>{item.carId}</td>
                                        <td className="m_AllCar_tableCarImg" onClick={() => detailHandler(item.carId)}>
                                            <img src={`/images/cars/${item.carImg}`} alt={item.carImg} />
                                        </td>
                                        <td className="m_AllCar_tableBrand" onClick={() => detailHandler(item.carId)}>{item.brand}</td>
                                        <td className="m_AllCar_tableModel" onClick={() => detailHandler(item.carId)}>{item.model}</td>
                                        <td className="m_AllCar_tableCarNum" onClick={() => detailHandler(item.carId)}>{item.plateNumber}</td>
                                        <td className="m_AllCar_tableRegDate">{item.regDate}</td>
                                        <td className="m_AllCar_tableDel">
                                            {noRes(item.carId) ? <p>예약 중</p> :
                                                <input type="checkbox" checked={delCar.includes(item.carId)}
                                                    className="AllCar_del" onChange={(e) => checkHandler(e, item.carId)} />}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr className="m_AllCar_tr_none">
                                <td className="m_AllCar_td_none" colSpan={8}>차량이 존재하지 않습니다.</td>
                            </tr>
                        )}
                    </tbody>
                )}
            </table>

            <div className="paging">
                {paging.prev && (
                    <button onClick={() => setPageNum(paging.startPage - 1)}>
                        <i className="bi bi-caret-left-fill"></i>
                    </button>
                )}
                {pagesHandler(paging).map(num => (
                    <button key={num} className={pageNum === num ? "active" : ""} onClick={() => setPageNum(num)}>
                        {num}
                    </button>
                ))}
                {paging.next && (
                    <button onClick={() => setPageNum(paging.endPage + 1)}>
                        <i className="bi bi-caret-right-fill"></i>
                    </button>
                )}
            </div>
        </div>
    );
}