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
	public List<ManagerDTO> getAllBookCar() {
		// TODO Auto-generated method stub
		return managermapper.getAllBookCar();
	}

	@Override
	public List<ManagerDTO> getOneBookCar(String userId) {
		// TODO Auto-generated method stub
		return managermapper.getOneBookCar(userId);
	}



	

	
	
}
