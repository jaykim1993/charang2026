package cha.car.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import cha.car.dto.CarDTO;

@Mapper
public interface CarMapper {

	// 전체 차량 리스트 메서드
	public List<CarDTO> getAllCar();
	// 전체 차량 페이징 버전
	public List<CarDTO> AllCarPage(
			@Param("startRow") int startRow, 
			@Param("pageSize") int pageSize
			);
	
	// 차량 추가 메서드
	public int insertCar(CarDTO cdto);
	
	// 차량 수정 메서드
	
	// 차량 검색 메서드
//	public List<CarDTO> getSearchCarList(
//			@Param("searchType") String searchType, 
//			@Param("searchKeyWord") String searchKeyWord
//			);

	// 차량 삭제 메서드
	public int deleteCar(List<Integer> carId);
	
	//	차량 전체 목록 개수
	public List<CarDTO> getSearchCar(
			@Param("startRow") int startRow, 
			@Param("pageSize") int pageSize,
			@Param("searchType") String searchType, 
			@Param("searchKeyWord") String searchKeyWord
			);

	// 전체 차량 개수
	public int getAllCount();
	
	// 검색 차량 개수
	public int SearchCount(
			@Param("searchType") String searchType, 
			@Param("searchKeyWord") String searchKeyWord);
	
	// 차량 상세보기 
	public CarDTO oneCar(int carId);
	
	// 차량 수정하기
	public int modCar(CarDTO carData);
}
