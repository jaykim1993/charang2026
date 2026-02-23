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
@RequestMapping("/api")
public class InquiryApiController {
	@Autowired
	InquiryService inquiryservice;
	
//	문의 등록 페이지
    @GetMapping("/customerservice/inquiry/write")
    public void insertInquiry(@RequestBody InquiryDTO idto) {
    	System.out.println("InquiryApiController - 문의등록 페이지로 이동");
    }
    
//	문의 등록 처리
    @PostMapping("/customerservice/inquiry/writePro")
    public String insertInquiryPro(@RequestBody InquiryDTO idto) {
    	System.out.println("InquiryApiController - 문의등록 처리");
    	
    	inquiryservice.insertInquiry(idto);
    	return "success";
    }
    
//  관리자 - 문의 목록 조회 (페이징)
    @GetMapping("/manager/inquiry/list")
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

//  관리자 - 문의 상세 조회
    @GetMapping("/manager/inquiry/list/info/{inquiryId}")
    public InquiryDTO getInquiryDetail(@PathVariable("inquiryId") String inquiryId) {
    	System.out.println("InquiryApiController - 문의상세");
    	
        return inquiryservice.getInquiryDetail(inquiryId);
    }
  
//  관리자 - 답변 등록 페이지 (기존 글 업데이트)
    @PutMapping("/manager/inquiry/answer/{inquiryId}")
    public void updateAnswer(@PathVariable("inquiryId") String inquiryId) {
    	System.out.println("InquiryApiController - 문의 업데이트 - 답변 페이지로 이동");
    }
    
//  관리자 - 답변 등록처리
    @PutMapping("/manager/inquiry/answerPro")
    public String updateAnswerPro(@RequestBody InquiryDTO idto, String inquiryId) {
    	System.out.println("InquiryApiController - 문의 업데이트 - 답변처리");
    	
    	inquiryservice.updateAnswer(idto, inquiryId);
    	return "success";
    }
}
