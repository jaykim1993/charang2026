package cha.branch.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import cha.branch.dto.BranchDTO;

@Mapper
public interface BranchMapper {

	// 전체 지점 리스트 메서드
	public List<BranchDTO> getAllBranch();
}
