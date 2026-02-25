package cha.inquiry.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import cha.inquiry.dto.InquiryDTO;

public interface InquiryService {
//	문의등록
	public void insertInquiry(InquiryDTO rdto);
	
//	관리자가 답변 남기면 답변내용(answer)채워서 업데이트
	public void updateAnswer(InquiryDTO idto);
	
//	문의 전체목록
	public List<InquiryDTO> inquiryList();
	
	public int getCountByUserId(String userId);
	
//	문의 상세 - 답변 여부에 따라 삭제/수정 버튼 유무
	public InquiryDTO getInquiryDetail(String inquiryId);
	
//	문의 수정
	public void updateInquiry(InquiryDTO idto);
	
//	문의 삭제
	public int deleteInquiry(String inquiryId);
	
//  ======================= 페이징 =======================

//	전체 공지 개수
	public int getAllCount();

//	공지 전체 목록
	public List<InquiryDTO> getPageList(
			@Param("startRow") int startRow, 
			@Param("pageSize") int pageSize, 
			@Param("userId") String userId);
}
