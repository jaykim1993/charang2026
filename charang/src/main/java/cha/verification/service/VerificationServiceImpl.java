package cha.verification.service;

import cha.user.service.UserService;
import cha.verification.mapper.VerificationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class VerificationServiceImpl implements VerificationService {

    @Autowired
    private UserService userService;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private VerificationMapper verificationMapper;

    @Override
    public boolean sendCode(String userId, String name, String email) {

        boolean isEx = userService.findUserPw(userId, name, email);

        if (!isEx) {
            return false;
        }
        String code = String.format("%06d",
                new java.security.SecureRandom().nextInt(1000000));
        try {
        	//메일 내용 
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("(Green BackEnd Project) 비밀번호 재설정 인증번호");
            message.setText("차랑차랑 렌트카 비밀번호 확인 인증번호는 ["+code+"] 입니다. (3분 유효)");

            mailSender.send(message);

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

        verificationMapper.saveCode(email, code);
        return true;
    }
    
    @Override
    public boolean verifyCode(String email, String code) {

        int result = verificationMapper.verifyCode(email, code);
        if (result > 0) {
        	// 성공 시 인증번호 db 삭제
            verificationMapper.deleteCode(email);
            return true;
        }
        return false;
    }
    
    
}