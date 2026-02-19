package cha.branch.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cha.branch.dto.BranchDTO;
import cha.branch.service.BranchService;

@RestController
@RequestMapping("/api")
public class BranchApiController {
	@Autowired
	BranchService branchservice;
	
	@GetMapping("/branch")
	public List<BranchDTO> getAllBranch(){
		System.out.println("지점 컨트롤러 - 지점 전체 출력 컨트롤러");
		return branchservice.getAllBranch();
	}
}
