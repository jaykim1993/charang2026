package cha.inquiry.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import cha.inquiry.dto.InquiryDTO;

public interface InquiryService {
//	문의등록
	public void insertInquiry(InquiryDTO rdto);
	
//	관리자가 답변 남기면 답변내용(answer)채워서 업데이트
	public void updateAnswer(InquiryDTO rdto);
	
//	문의 전체목록
	public List<InquiryDTO> inquiryList();
	
//	문의 상세 - 답변 여부에 따라 삭제/수정 버튼 유무
	public InquiryDTO getInquiryDetail(int inquiryId);
	
//	문의 답글 추가
//	public void reWriteInsert(InquiryDTO rdto);
	
//	답글 작성시 부모글의 re_level 보다 큰 값들을 모두 1씩 증가
//	public void reSqUpdate(InquiryDTO rdto);
	
//  ======================= 페이징 =======================

//	전체 공지 개수
	public int getAllCount();

//	공지 전체 목록
	public List<InquiryDTO> getPageList(@Param("startRow") int startRow, @Param("pageSize") int pageSize);
}
