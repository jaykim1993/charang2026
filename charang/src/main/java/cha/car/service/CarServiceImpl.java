package cha.car.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cha.car.dto.CarDTO;
import cha.car.mapper.CarMapper;

@Service
public class CarServiceImpl implements CarService {
	@Autowired
	CarMapper carmapper;
	
	// 전체 차량 출력
	@Override
	public List<CarDTO> getAllCar() {
		System.out.println("차 서비스 : 전체 차량 출력 서비스");
		return carmapper.getAllCar();
	}
	// 전체 차량 출력 페이징 버전
	@Override
	public List<CarDTO> getAllCarPage(int startRow, int pageSize) {
		System.out.println("차 서비스 : 전체 차량 출력 서비스(페이징 버전)");
		return carmapper.AllCarPage(startRow, pageSize);
	}
	
//	@Override
//	public List<CarDTO> getSearchCar(int startRow, int pageSize) {
//		System.out.println("차 서비스 : 전체 차량 출력 서비스");
//		return carmapper.getSearchCar(startRow,pageSize);
//	}

	// 검색 차량 출력
//	@Override
//	public List<CarDTO> getSearchCar(String searchType, String searchKeyWord, int startRow, int pageSize) {
//		System.out.println("차 서비스 : 검색 차량 출력 서비스");
//		return carmapper.getSearchCar(searchType,searchKeyWord,startRow,pageSize);
//	}

	// 차량 추가 
	@Override
	public boolean addCar(CarDTO cdto) {
		System.out.println("차 서비스 : 차량 추가 서비스");
		int result = carmapper.insertCar(cdto);
		// 추가 성공
		if(result > 0) {
			return true;
		}
		// 추가 실패
		else {
			return false;
		}
	}

	// 차량 삭제
	@Override
	public boolean delCar(List<Integer> carId) {
		System.out.println("차 서비스 : 차량 삭제 서비스");
		int result = carmapper.deleteCar(carId);
		// 삭제 성공
		if(result > 0) {
			return true;
		}
		// 삭제 실패
		else {
			return false;
		}
	}

	// 차량 전체 목록 개수
	@Override
	public int getAllCount() {
		System.out.println("차 서비스 : 차량 목록 개수 서비스");
		return carmapper.getAllCount();
	}

	// 검색 차량 출력
	@Override
	public List<CarDTO> getSearchCar(int startRow, int pageSize, String searchType, String searchKeyWord) {
		System.out.println("차 서비스 : 검색 차량 출력 서비스");
		return carmapper.getSearchCar(startRow, pageSize, searchType, searchKeyWord);
	}

	// 검색 차량 개수 출력
	@Override
	public int getSearchCount(String searchType, String searchKeyWord) {
		System.out.println("차 서비스 : 검색 차량 개수 서비스");
		int result = carmapper.SearchCount(searchType,searchKeyWord);
		return result;
	}

}
