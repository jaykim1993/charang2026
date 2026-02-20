package cha.manager.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import cha.manager.dto.ManagerDTO;

@Mapper
public interface ManagerMapper {
	
	// 전체 예약 + 예약 내 차량 데이터 조인 메서드
	public List<ManagerDTO> getAllBookCar();
	
	// 개인 예약 + 예약 내 차량 데이터 조인 메서드
	public List<ManagerDTO> getOneBookCar(String userId);

	

}
