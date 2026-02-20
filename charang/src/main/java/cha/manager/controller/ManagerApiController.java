package cha.manager.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cha.manager.dto.ManagerDTO;
import cha.manager.service.ManagerService;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class ManagerApiController {
	
	@Autowired
	ManagerService managerservice;
	
	@GetMapping("/bookcarlist")
	public List<ManagerDTO> getAllBookCar(){
		return managerservice.getAllBookCar();
	}
	
	@GetMapping("/onebookcar")
	public List<ManagerDTO> oneBookCar(HttpSession session) {
	    String loginId = (String) session.getAttribute("loginUser");
	    if (loginId == null) {
	        return List.of();
	    }
	    return managerservice.getOneBookCar(loginId);
	}
}
