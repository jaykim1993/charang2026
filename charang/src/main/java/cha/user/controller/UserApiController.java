package cha.user.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
import cha.user.dto.UserDTO;
import cha.user.service.UserService;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class UserApiController {
	
	@Autowired
	UserService userservice;
	
	// 검색 회원 출력
	@GetMapping("/searchUser")
	public Map<String, Object> getSearchUserList(
			@RequestParam(value="searchType", required=false) String searchType, // 검색 타입
			@RequestParam(value="searchWord", required=false) String searchWord, // 검색어
			@RequestParam( value="page", defaultValue = "1") int page, // 페이지 번호
			@RequestParam( value="pageSize", defaultValue = "10") int pageSize // 한 화면에 보여지는 user개수
			){
		System.out.println("검색한 회원 출력 컨트롤러");
		
		System.out.println(page);
		
		List<UserDTO> userList;
		PageHandler ph;
		
		Map<String, Object> result = new HashMap<>(); // userList, ph를 Map에 담아서 return할 예정
		
		// 검색어 존재 O
		if(searchType != null && !searchWord.trim().isEmpty()) {
			int totalCnt = userservice.getSearchCount(searchType, searchWord);
			ph = new PageHandler(totalCnt, page, pageSize); // 페이징 핸들러
			userList = userservice.getSearchUser(searchType, searchWord, ph.getStartRow(), pageSize); // 데이터
		}
		// 검색어 존재 X
		else {
			int totalCnt = userservice.getAllCount();
			ph = new PageHandler(totalCnt, page, pageSize); // 페이징 핸들러
			userList = userservice.getAllUser(ph.getStartRow(), pageSize);
		}
		result.put("list", userList);
		result.put("ph", ph);
		return result;
	}
	
	// 아이디 중복 체크
	@PostMapping("/checkid")
	public boolean checkId(@RequestBody UserDTO udto) {
	    System.out.println("아이디 중복 체크 컨트롤러: " + udto.getUserId());
	    boolean exist = userservice.existUserId(udto.getUserId());
	    return exist; 
	}
	
	// 회원가입
	@PostMapping("/signup")
	public int signup(@RequestBody UserDTO udto) {
		System.out.println("회원가입 컨트롤러");
		return userservice.insertUser(udto);
	}
	
	// 로그인
	@PostMapping("/login")
	public UserDTO login(@RequestBody UserDTO udto, HttpSession session) {
			System.out.println("회원 로그인 컨트롤러");
			//loginUser = {no:~,id:~,pw:~,mail:~,phone:~ ,~~}
			UserDTO loginUser = userservice.loginConfirm(udto);
			if(loginUser != null) {
				session.setAttribute("loginUser", loginUser.getUserId());
			}
			//React占쏙옙 JSON 占쏙옙환		
			return loginUser;
		}
	
	// 로그아웃
	@GetMapping("/logout")
	public int logout(HttpSession session) {
			System.out.println("로그아웃 컨트롤러");
			session.invalidate();
			return 1;
		}
	
	// 유저개인정보
	@GetMapping("/userinfo/{userId}")
	public UserDTO myInfo(
			HttpSession session,
			@PathVariable("userId") String userId
			) {
			System.out.println("유저 개인 정보 컨트롤러");
			String loginId = (String) session.getAttribute("loginUser");
			System.out.println("유저 개인: "+userId);
			
			if(loginId == null) {
				return null;
			}
			
			// 관리자일 경우
			if(loginId.equals("admin")) {
				return userservice.oneUser(userId);
			}
			// 개인 유저일 경우
			else {
				 UserDTO user = userservice.oneUser(loginId);
				if(user.getResistNum() != null && user.getResistNum().length() == 14){ // - 포함해서 14자리니까 앞+'-'+첫자리 이후 별표
					String masked = user.getResistNum().substring(0, 8) + "******";
					user.setResistNum(masked);
	    		}
	    		return user;
			}
	}
	
	// 회원 삭제
	@DeleteMapping("/delete")
	public int delete(
			HttpSession session,
			@RequestBody List<String> userId
			) {
		System.out.println("회원 삭제 컨트롤러");
		String loginId = (String) session.getAttribute("loginUser");
		if(loginId == null) {
			return 0;
		}
		
		// 삭제할 아이디를 담을 list 생성
		List<String> delIdList = new ArrayList<String>();
		
		// 관리자일 경우
		if(loginId.equals("admin")) {
			delIdList = userId; // 가져온 리스트배열 그대로 넣음
		}
		// 개인일 경우
		else {
			delIdList.add(loginId); // 본인 id만 넣음
		}
		
		boolean result = userservice.delUser(delIdList);
		
		if(result) {
			// 관리자가 아닐 경우에만 세션에서 삭제
			if (!loginId.equals("admin")) {
	            session.invalidate();
	        }
			return 1;
		}else {
			return 0;
		}
	}
	
	@PutMapping("/modify")
	public int modify(@RequestBody UserDTO udto, HttpSession session) {
	    String loginId = (String) session.getAttribute("loginUser");
	    if(loginId == null) return 0;
	    udto.setUserId(loginId);
	    boolean result = userservice.modUser(udto);
	    if(result) {
			return 1;
		}else {
			return 0;
		}
	}
	
	 @PostMapping("/findid")
	    public String findUserId(@RequestBody Map<String, String> request) {
	        String name = request.get("name");
	        String mail = request.get("mail");
	        String userId = userservice.findUserId(name, mail);
	        if (userId == null) {
	            return null;
	        }else if(userId.length() > 3) {
	        	return userId.substring(0, 3) + "*".repeat(userId.length() - 3);
	        }
	        return userId;
	    }
	 
	 // 3. 비밀번호 변경
	    @PutMapping("/resetpw")
	    public ResponseEntity<?> resetPassword(@RequestBody Map<String,String> req){

	        boolean result = userservice.updatePassword(
	                req.get("userId"),
	                req.get("newPw")
	        );
	        if(result){
	            return ResponseEntity.ok("비밀번호 변경 완료");
	        }else{
	            return ResponseEntity.badRequest().body("비밀번호 변경 실패");
	        }
	    }

}
