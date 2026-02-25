package cha.manager.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import cha.manager.dto.ManagerDTO;

@Mapper
public interface ManagerMapper {
	// 전체 예약 수 
	public int AllBookCarCount();
	// 전체 예약 + 예약 내 차량 데이터 조인 메서드
	public List<ManagerDTO> GetAllBookCar(
			@Param("startRow") int startRow, 
			@Param("pageSize") int pageSize
			);
	
	// 검색 예약 수
	public int AllSearchBookCarCount(
			@Param("searchType") String searchType, 
			@Param("searchKeyWord") String searchKeyWord
			);
	// 검색 페이징 메서드
	public List<ManagerDTO> GetAllSearchBookCar(
			@Param("startRow") int startRow, 
			@Param("pageSize") int pageSize,
			@Param("searchType") String searchType, 
			@Param("searchKeyWord") String searchKeyWord
			);
	
	
	
	
	
	
	// 개인 예약 + 예약 내 차량 데이터 조인 메서드
	public List<ManagerDTO> getOneBookCar(String userId);
	
	// 현재예약, 미래예약이 존재하지 않는 회원id 출력
	public List<String> selectIsRes();

	

}
