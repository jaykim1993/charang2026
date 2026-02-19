package cha.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cha.user.dto.UserDTO;
import cha.user.service.UserService;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class UserApiController {
	
	@Autowired
	UserService userservice;
	
	@GetMapping("/alluser")
	public List<UserDTO> getAllUserList(){
		System.out.println("회원 전체 출력 컨트롤러");
		return userservice.getAllUser();
	}
	
	//아이디 중복만 체크하는거
	@PostMapping("/checkid")
	public boolean checkId(@RequestBody UserDTO udto) {
	    System.out.println("받은 값: " + udto.getUserId());
	    boolean exist = userservice.existUserId(udto.getUserId());
	    return exist; 
	}
	
	//회원가입
	@PostMapping("/signup")
	public int signup(@RequestBody UserDTO udto) {
		System.out.println("�� ��Ʈ�ѷ� signup ��û��");
		return userservice.insertUser(udto);
	}
	
	//로그인
	@PostMapping("/login")
	public UserDTO login(@RequestBody UserDTO udto, HttpSession session) {
			System.out.println("api��Ʈ�ѷ� login ��û��");
			//loginUser = {no:~,id:~,pw:~,mail:~,phone:~ ,~~}
			UserDTO loginUser = userservice.loginConfirm(udto);
			if(loginUser != null) {
				session.setAttribute("loginUser", loginUser.getUserId());
			}
			//React�� JSON ��ȯ		
			return loginUser;
		}
	
	//로그아웃
	@GetMapping("/logout")
	public int logout(HttpSession session) {
			System.out.println("api��Ʈ�ѷ� logout ��û��");
			session.invalidate();
			return 1;
		}
	
	// 유저개인정보
	@GetMapping("/userinfo")
	public UserDTO myInfo(HttpSession session) {
			System.out.println("api��Ʈ�ѷ� myinfo ��û��");
			String loginId = (String) session.getAttribute("loginUser");
			if(loginId == null) {
				return null;
			}
			return userservice.oneUser(loginId);
		}
	
	
	//유저삭제
	@DeleteMapping("/delete")
	public int delete(HttpSession session) {
		String loginId = (String) session.getAttribute("loginUser");
		if(loginId == null) {
			return 0;
		}
		boolean result = userservice.delUser(loginId);
		if(result) {
			session.invalidate();
			return 1;
		}else {
			return 0;
		}
	}
	
	@PostMapping("/modify")
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

	
	
	

}
