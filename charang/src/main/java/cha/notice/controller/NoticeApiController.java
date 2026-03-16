package cha.notice.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cha.PageHandler;
import cha.notice.dto.NoticeDTO;
import cha.notice.service.NoticeService;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/customerservice")
public class NoticeApiController {
	@Autowired
	NoticeService noticeservice;

//	전체 공지사항 목록 (페이징)
	 @GetMapping("/notice")
     public Map<String, Object> noticeList(
             @RequestParam(value="searchType", required=false) String searchType,
             @RequestParam(value="searchWord", required=false) String searchWord,
             @RequestParam(value="page", defaultValue="1") int page,
             @RequestParam(value="pageSize", defaultValue="10") int pageSize
     ){
         List<NoticeDTO> noticeList;
         PageHandler ph;
         Map<String, Object> result = new HashMap<>();
         int totalCnt;
         // 검색 O
         if(searchWord != null && !searchWord.trim().isEmpty()){
             totalCnt = noticeservice.AllSearchNoticeCount(searchType, searchWord);
             ph = new PageHandler(totalCnt, page, pageSize);
             noticeList = noticeservice.GetAllSearchNotice(
                     ph.getStartRow(),
                     pageSize,
                     searchType,
                     searchWord
             );
         }
         // 검색 X
         else{
             totalCnt = noticeservice.getAllCount();
             ph = new PageHandler(totalCnt, page, pageSize);
             noticeList = noticeservice.getPageList(
                     ph.getStartRow(),
                     pageSize
             );
         }
         result.put("list", noticeList);
         result.put("ph", ph);
         return result;
     }


//	공지사항 상세
	@GetMapping("/notice/Info/{noticeId}")
	public NoticeDTO noticeInfo(@PathVariable("noticeId") int noticeId) {
		System.out.println("NoticeApiController - 공지사항 상세페이지로 이동" + noticeId);

		// 조회수 1 증가시키고 데이터 들고오기
		noticeservice.updateReadCount(noticeId);
		return noticeservice.selectNoticeDetail(noticeId);
	}

//	공지사항 등록 (성공 시 1, 실패 시 0 반환)
	@GetMapping("/notice/manager/write")
	public int noticeWrite() {
		System.out.println("NoticeApiController - 공지사항 등록");
		
		return 0;
	}
//	공지사항 등록을 처리
	@PostMapping("/notice/manager/writePro")
	public int noticeWritePro(@RequestBody NoticeDTO ndto, HttpSession session) {
		System.out.println("NoticeApiController - 공지사항 등록 처리");
		if("admin".equals(ndto.getUserId())) {
			return noticeservice.insertNotice(ndto); // 성공 시 1 반환
		}

		return 0; // 권한 없거나 실패 시 0
	}
	
//	공지사항 수정 페이지로 이동
	@GetMapping("/notice/manager/modify")
	public String noticeModify() {
		System.out.println("NoticeApiController - 공지사항 수정페이지로 이동");
		
		return "";
	}

//	공지사항 수정 처리 (성공 시 1, 실패 시 0 반환)
	@PutMapping("/notice/manager/modify/{noticeId}")
	public int noticeModifyPro(@PathVariable("noticeId") int noticeId, 
			@RequestBody NoticeDTO ndto, HttpSession session) {
		System.out.println("NoticeApiController - 공지사항 수정처리");

		ndto.setNoticeId(noticeId);

		return noticeservice.updateNotice(ndto); // 성공 시 1 반환
	}

//	공지사항 삭제 (성공 시 1, 실패 시 0 반환)
	@DeleteMapping("/notice/manager/delete")
	public int noticeDelete(@RequestParam("noticeId") int noticeId) {
		System.out.println("NoticeApiController - 공지사항 삭제");
		
		int result = noticeservice.deleteNotice(noticeId);
		
		return result;
	}
}
