package cha.car.service;

import java.util.List;

<<<<<<< HEAD
import org.apache.ibatis.annotations.Param;

import cha.car.dto.CarDTO;

public interface CarService {
	
	// 차량 전체 출력 서비스
	public List<CarDTO> getAllCar();

	// 검색 차량 출력 서비스
//	public List<CarDTO> getSearchCar(String searchType, String searchKeyWord);

	// 차량 추가 서비스
	public boolean addCar(CarDTO cdto);

	// 차량 삭제 서비스
	public boolean delCar(List<Integer> carId);

	// 차량 전체 목록 개수
	public int getAllCount();
	
	//	차량 전체 목록 개수
	public List<CarDTO> getSearchCar(
			@Param("startRow") int startRow, 
			@Param("pageSize") int pageSize,
			@Param("searchType") String searchType, 
			@Param("searchKeyWord") String searchKeyWord
			);
=======
import cha.car.dto.CarDTO;

public interface CarService {
	// 차량 전체 출력 서비스
	public List<CarDTO> getAllCar();
>>>>>>> main
}
