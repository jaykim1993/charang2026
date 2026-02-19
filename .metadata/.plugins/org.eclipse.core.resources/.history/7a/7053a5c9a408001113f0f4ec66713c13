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
	
	@Override
	public List<CarDTO> getAllCar() {
		System.out.println("차 서비스 : 전체 차량 출력 서비스");
		return carmapper.getAllCar();
	}

}
