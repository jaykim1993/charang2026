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
	public void updateAnswer(InquiryDTO rdto, String inquiryId) {
		System.out.println("InquiryServiceImpl - 문의 답변완료 업데이트");
		
		inquirymapper.updateAnswer(rdto, inquiryId);;
	}

	@Override
	public List<InquiryDTO> inquiryList() {
		System.out.println("InquiryServiceImpl - 문의목록");
		
		return inquirymapper.inquiryList();
	}

	@Override
	public InquiryDTO getInquiryDetail(String inquiryId) {
		System.out.println("InquiryServiceImpl - 문의 상세");
		
		return inquirymapper.getInquiryDetail(inquiryId);
	}

	@Override
	public int getAllCount() {
		return inquirymapper.getAllCount();
	}

	@Override
	public List<InquiryDTO> getPageList(int startRow, int pageSize) {
		return inquirymapper.getPageList(startRow, pageSize);
	}
}
