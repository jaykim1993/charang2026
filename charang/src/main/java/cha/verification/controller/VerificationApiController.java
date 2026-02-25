package cha.verification.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cha.user.service.UserService;
import cha.verification.service.VerificationService;

@RestController
@RequestMapping("/api")
public class VerificationApiController {
	
	
	 	@Autowired
	    private VerificationService verificationservice;

	    @Autowired
	    private UserService userservice;
	    
	 //인증번호 보내기
	@PostMapping("/findpw")
	 public ResponseEntity<?> sendCode(@RequestBody Map<String,String> req){
		
		boolean result = verificationservice.sendCode(
                req.get("userId"),
                req.get("name"),
                req.get("email")
        );
		if(result){
            return ResponseEntity.ok("인증번호 발송 완료");
        }else{
            return ResponseEntity.badRequest().body("회원 정보 불일치");
        }
    }
	
	// 인증번호체크
    @PostMapping("/checkcode")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String,String> req){

        boolean result = verificationservice.verifyCode(
                req.get("email"),
                req.get("code")
        );
        if(result){
            return ResponseEntity.ok("인증 성공");
        }else{
            return ResponseEntity.badRequest().body("인증 실패 또는 만료");
        }
    }

   
}
