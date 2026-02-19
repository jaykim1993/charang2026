package cha.user.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import cha.user.dto.UserDTO;

@Mapper
public interface UserMapper {

	// 전체 회원 출력
	List<UserDTO> selectAllUser();

}
