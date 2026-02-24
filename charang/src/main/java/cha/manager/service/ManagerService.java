package cha.manager.service;

import java.util.List;


import cha.manager.dto.ManagerDTO;

public interface ManagerService {
	
	// 전체 예약 수 
		public int AllBookCarCount();
		// 전체 예약 + 예약 내 차량 데이터 조인 메서드
		public List<ManagerDTO> GetAllBookCar(int startRow, int pageSize);
		// 검색 예약 수
		public int AllSearchBookCarCount(
				String searchType, 
				String searchKeyWord
				);
		// 검색 페이징 메서드
		public List<ManagerDTO> GetAllSearchBookCar(
				int startRow, 
				int pageSize,
				String searchType, 
				String searchKeyWord
				);
		
		
		
	// 개인 예약 + 예약 내 차량 데이터 조인 메서드
	public List<ManagerDTO> getOneBookCar(String userId);

}
