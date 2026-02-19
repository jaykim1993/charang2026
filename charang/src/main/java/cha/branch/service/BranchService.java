package cha.branch.service;

import java.util.List;

import cha.branch.dto.BranchDTO;

public interface BranchService {
		// 차량 전체 출력 서비스
	public List<BranchDTO> getAllBranch();
}
