package cha.inquiry.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cha.PageHandler;
import cha.inquiry.dto.InquiryDTO;
import cha.inquiry.service.InquiryService;

@RestController
@RequestMapping("/api/customerservice")
public class InquiryApiController {
	@Autowired
	InquiryService inquiryservice;
	
//	문의 등록
    @PostMapping("/inquiry/write")
    public String insertInquiry(@RequestBody InquiryDTO rdto) {
    	inquiryservice.insertInquiry(rdto);
        return "success";
    }

    // 문의 목록 조회 (페이징)
    @GetMapping("/inquiry")
    public Map<String, Object> inquiryList(
//			1. 페이지 번호 - 1부터 시작이므로 초기값 1로 정의
			@RequestParam(value="page", defaultValue = "1") int page,
//			2. 페이지 사이즈 - 한 화면에 보여지는 게시글 개수를 5로 초기화
			@RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    	System.out.println("InquiryApiController - 문의 전체목록");
    	
//    	전체 문의 개수 조회
        int totalCnt = inquiryservice.getAllCount();
        
        PageHandler ph = new PageHandler(totalCnt, page, pageSize);
        
//      페이징된 목록 조회
        List<InquiryDTO> inquiryList = inquiryservice.getPageList(ph.getStartRow(), pageSize);
        
        Map<String, Object> result = new HashMap<>();
        result.put("list", inquiryList);
        result.put("ph", ph); // 리액트의 paging 상태로 들어갈 데이터
        
        System.out.println("Inquiry List Result: " + result);
        return result;
    }

//  문의 상세 조회
    @GetMapping("/inquiry/{inquiryId}")
    public InquiryDTO getInquiryDetail(@PathVariable("inquiryId") int inquiryId) {
        return inquiryservice.getInquiryDetail(inquiryId);
    }
  
//  관리자 답변 등록 (기존 글 업데이트)
    @PutMapping("/inquiry/answer")
    public String updateAnswer(@RequestBody InquiryDTO rdto) {
    	inquiryservice.updateAnswer(rdto);
        return "success";
    }
}
