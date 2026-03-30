package cha.manager.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cha.manager.dto.ManagerDTO;
import cha.manager.mapper.ManagerMapper;

@Service
public class ManergerServiceImpl implements ManagerService{
	
	@Autowired
	ManagerMapper managermapper;

	// 검색 페이징 메서드
	@Override
	public List<ManagerDTO> GetAllSearchBookCar(int startRow, int pageSize, String searchType, String searchKeyWord, String sortType, String sort ) {
		
		return managermapper.GetAllSearchBookCar(startRow, pageSize, searchType, searchKeyWord, sortType, sort);
	}


	// 전체 예약 수 
	@Override
	public int AllBookCarCount() {
		
		return managermapper.AllBookCarCount();
	}


	// 전체 예약 + 예약 내 차량 데이터 조인 메서드
	@Override
	public List<ManagerDTO> GetAllBookCar(int startRow, int pageSize, String sortType, String sort) {
		
		return managermapper.GetAllBookCar(startRow, pageSize, sortType, sort);
	}


	// 검색 예약 수
	@Override
	public int AllSearchBookCarCount(String searchType, String searchKeyWord) {
		
		return managermapper.AllSearchBookCarCount(searchType, searchKeyWord);
	}

	// 예약 아이디로 예약(차량조인) 하나 조회하기
	@Override
	public ManagerDTO getoneBookManager(String bookingId) {
		
		return managermapper.getoneBookManager(bookingId);
	}

	// 개인 예약 + 예약 내 차량 데이터 조인 메서드
	@Override
	public List<ManagerDTO> getOneBookCar(String userId) {
		
		return managermapper.getOneBookCar(userId);
	}


	// 현재예약, 미래예약이 존재하지 않는 회원id 출력
	@Override
	public List<String> getIsRes() {
		System.out.println("현재예약, 미래예약이 존재하지 않는 회원id 출력");
		return managermapper.selectIsRes();
	}
	
}
