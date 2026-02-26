git switch mainpackage cha.manager.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cha.PageHandler;
import cha.manager.dto.ManagerDTO;
import cha.manager.service.ManagerService;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class ManagerApiController {
	
	@Autowired
	ManagerService managerservice;
	
	@GetMapping("/bookcarlist")
	public Map<String, Object> getAllBookCar(
			@RequestParam("searchType") String searchType,
		    @RequestParam("searchWord") String searchKeyWord,
//			1. 페이지 번호 - 1부터 시작이므로 초기값 1로 정의
			@RequestParam(value="page", defaultValue = "1") int page,
//			2. 페이지 사이즈 - 한 화면에 보여지는 게시글 개수를 5로 초기화
			@RequestParam(value = "pageSize", defaultValue = "10") int pageSize
			){
		System.out.println("매니져 컨트롤러 - 검색 예약 출력 컨트롤러");
		List<ManagerDTO> bookList;
		PageHandler ph;
		
		Map<String, Object> result = new HashMap<>();
		
		// 검색 O -> 검색 결과 존재 -> (검색 예약만 출력)
				if(searchType != null && !searchKeyWord.trim().isEmpty()) {
					int totalCnt = managerservice.AllSearchBookCarCount(searchType, searchKeyWord); // 검색 차량 개수
					ph = new PageHandler(totalCnt, page, pageSize);
					bookList = managerservice.GetAllSearchBookCar(ph.getStartRow(), pageSize, searchType, searchKeyWord);
				}
				// 검색 X -> 전체 예약 출력
				else {
					int totalCnt = managerservice.AllBookCarCount(); // 전체 차량 개수
					ph = new PageHandler(totalCnt, page, pageSize);
					bookList = managerservice.GetAllBookCar(ph.getStartRow(), pageSize);
				}
				result.put("list", bookList);
				result.put("ph", ph);
		return result;
	}
	
	// bookingId로 예약 하나 가져오기
	@GetMapping("/onebookcar/{bookingId}")
	public ManagerDTO onebookcarmanager(
			@PathVariable("bookingId") String bookingId
			){
		ManagerDTO result = managerservice.getoneBookManager(bookingId);
		return result;
	}
	
	
	// userId로 한명 예약 가져오기
	@GetMapping("/onebookcar")
	public List<ManagerDTO> oneBookCar(HttpSession session) {
	    String loginId = (String) session.getAttribute("loginUser");
	    if (loginId == null) {
	        return List.of();
	    }
	    return managerservice.getOneBookCar(loginId);
	}
	
	// 현재예약, 미래예약이 존재하지 않는 회원id 출력
	@GetMapping("/isReservation")
	public List<String> isReservation(){
		System.out.println("현재,미래 예약이 존재하는지 확인 컨트롤러");
		// 현재,미래예약이 존재하지 않는 id만 담을 배열
		List<String> result = new ArrayList<String>();
		result = managerservice.getIsRes();
		return result;
	}
	
}
