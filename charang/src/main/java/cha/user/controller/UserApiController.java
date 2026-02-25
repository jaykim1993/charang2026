package cha.user.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
		System.out.println("�쉶�썝 �쟾泥� 異쒕젰 而⑦듃濡ㅻ윭");
		return userservice.getAllUser();
	}
	
	//�븘�씠�뵒 以묐났留� 泥댄겕�븯�뒗嫄�
	@PostMapping("/checkid")
	public boolean checkId(@RequestBody UserDTO udto) {
	    System.out.println("諛쏆� 媛�: " + udto.getUserId());
	    boolean exist = userservice.existUserId(udto.getUserId());
	    return exist; 
	}
	
	//�쉶�썝媛��엯
	@PostMapping("/signup")
	public int signup(@RequestBody UserDTO udto) {
		System.out.println("占쏙옙 占쏙옙트占싼뤄옙 signup 占쏙옙청占쏙옙");
		return userservice.insertUser(udto);
	}
	
	//濡쒓렇�씤
	@PostMapping("/login")
	public UserDTO login(@RequestBody UserDTO udto, HttpSession session) {
			System.out.println("api占쏙옙트占싼뤄옙 login 占쏙옙청占쏙옙");
			//loginUser = {no:~,id:~,pw:~,mail:~,phone:~ ,~~}
			UserDTO loginUser = userservice.loginConfirm(udto);
			if(loginUser != null) {
				session.setAttribute("loginUser", loginUser.getUserId());
			}
			//React占쏙옙 JSON 占쏙옙환		
			return loginUser;
		}
	
	//濡쒓렇�븘�썐
	@GetMapping("/logout")
	public int logout(HttpSession session) {
			System.out.println("api占쏙옙트占싼뤄옙 logout 占쏙옙청占쏙옙");
			session.invalidate();
			return 1;
		}
	
	//마이페이지 내정보
	@GetMapping("/userinfo")
	public UserDTO myInfo(HttpSession session) {
	    String loginId = (String) session.getAttribute("loginUser");
	    //로그인 안되어잇으면
	    if(loginId == null) {
	        return null;
	    }
	    //로그인되어잇으면
	    UserDTO user = userservice.oneUser(loginId);
	    if(user.getResistNum() != null && user.getResistNum().length() == 14){ // - 포함해서 14자리니까 앞+'-'+첫자리 이후 별표
	        String masked = user.getResistNum().substring(0, 8) + "******";
	        user.setResistNum(masked);
	    }
	    return user;
	}
	
	//�쑀���궘�젣
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
