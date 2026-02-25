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
	
	@Override
	public List<ManagerDTO> GetAllSearchBookCar(int startRow, int pageSize, String searchType, String searchKeyWord) {
		
		return managermapper.GetAllSearchBookCar(startRow, pageSize, searchType, searchKeyWord);
	}



	@Override
	public int AllBookCarCount() {
		
		return managermapper.AllBookCarCount();
	}



	@Override
	public List<ManagerDTO> GetAllBookCar(int startRow, int pageSize) {
		
		return managermapper.GetAllBookCar(startRow, pageSize);
	}



	@Override
	public int AllSearchBookCarCount(String searchType, String searchKeyWord) {
		
		return managermapper.AllSearchBookCarCount(searchType, searchKeyWord);
	}



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
