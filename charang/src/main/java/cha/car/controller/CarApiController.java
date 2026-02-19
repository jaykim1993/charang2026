package cha.car.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cha.car.dto.CarDTO;
import cha.car.service.CarService;

@RestController
@RequestMapping("/api")
public class CarApiController {
	@Autowired
	CarService carservice;
	
	@GetMapping("/")
	public List<CarDTO> getAllCarList(){
		System.out.println("차 컨트롤러 - 차량 전체 출력 컨트롤러");
		return carservice.getAllCar();
	}
}
