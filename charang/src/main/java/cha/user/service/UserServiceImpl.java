package cha.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cha.user.dto.UserDTO;
import cha.user.mapper.UserMapper;

@Service
public class UserServiceImpl implements UserService{
	
	@Autowired
	UserMapper usermapper;

	// 전체 회원 출력
	@Override
	public List<UserDTO> getAllUser() {
		System.out.println("전체 회원 출력 서비스");
		return usermapper.selectAllUser();
	}
	
}
