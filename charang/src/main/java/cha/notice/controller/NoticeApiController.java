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
//			1. 페이지 번호 - 1부터 시작이므로 초기값 1로 정의
			@RequestParam(value="page", defaultValue = "1") int page,
//			2. 페이지 사이즈 - 한 화면에 보여지는 게시글 개수를 5로 초기화
			@RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
		System.out.println("NoticeApiController - 공지사항 전체목록");
		
		int totalCnt = noticeservice.getAllCount();
		
//		PageHandler 클래스 접근하기 위해 인스턴스화
		PageHandler ph = new PageHandler(totalCnt, page, pageSize);
		
		List<NoticeDTO> noticeList = noticeservice.getPageList(ph.getStartRow(), pageSize);
		
		Map<String, Object> result = new HashMap<>();
		
        result.put("list", noticeList);
        result.put("ph", ph);
		System.out.println(result);
		return result;  // JSON 형태로 받아가야해서 
	}

//	공지사항 상세
//  @RequestParam() => /board/info?noticeId=5
//  @PathVariable() => /board/Info/5
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

//		세션에서 로그인 정보 꺼내기
//		UserDTO loginMember = (UserDTO) session.getAttribute("loginmember");

//		관리자 admin인지 확인
//		if(loginMember != null && "admin".equals(loginMember.getUserId())) {
		if("admin".equals(ndto.getUserId())) {
//			dto.setUserId(loginMember.getUserId());
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

//		NoticeDTO noticeNum = (NoticeDTO) session.getAttribute("noticeNum");
		ndto.setNoticeId(noticeId);

//		if (noticeNum != null && "admin".equals(noticeNum.getUserId())) {
//			return 
//		}

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
