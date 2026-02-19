package cha.branch.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cha.branch.dto.BranchDTO;
import cha.branch.mapper.BranchMapper;

@Service
public class BranchServiceImpl implements BranchService {

	@Autowired
	BranchMapper branchmapper;
	
	@Override
	public List<BranchDTO> getAllBranch() {
		System.out.println("지점 서비스 : 전체 지점 출력 서비스");
		return branchmapper.getAllBranch();
	}

}
