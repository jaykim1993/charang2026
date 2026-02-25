package cha.inquiry.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cha.inquiry.dto.InquiryDTO;
import cha.inquiry.mapper.InquiryMapper;

@Service
public class InquiryServiceImpl implements InquiryService {
	@Autowired
	InquiryMapper inquirymapper;

	@Override
	public void insertInquiry(InquiryDTO rdto) {
		System.out.println("InquiryServiceImpl - 문의등록");
		
		inquirymapper.insertInquiry(rdto);
	}

	@Override
	public void updateAnswer(InquiryDTO rdto) {
		System.out.println("InquiryServiceImpl - 문의 답변완료 업데이트");
		
		inquirymapper.updateAnswer(rdto);
	}

	@Override
	public List<InquiryDTO> inquiryList() {
		System.out.println("InquiryServiceImpl - 문의목록");
		
		return inquirymapper.inquiryList();
	}

	@Override
	public int getCountByUserId(String userId) {
		System.out.println("InquiryServiceImpl - 문의목록 - 로그인 유저");
		return inquirymapper.getCountByUserId(userId);
	}

	@Override
	public InquiryDTO getInquiryDetail(String inquiryId) {
		System.out.println("InquiryServiceImpl - 문의 상세");
		
		return inquirymapper.getInquiryDetail(inquiryId);
	}

	@Override
	public void updateInquiry(InquiryDTO idto) {
		System.out.println("InquiryServiceImpl - 문의 수정");
		
		inquirymapper.updateInquiry(idto);
	}

	@Override
	public int deleteInquiry(String inquiryId) {
		System.out.println("InquiryServiceImpl - 문의 삭제");
		
		return inquirymapper.deleteInquiry(inquiryId);
	}
	
//  ======================= 페이징 =======================

	@Override
	public int getAllCount() {
		return inquirymapper.getAllCount();
	}

	@Override
	public List<InquiryDTO> getPageList(int startRow, int pageSize, String userId) {
		return inquirymapper.getPageList(startRow, pageSize, userId);
	}
}
