package cha.verification.service;

public interface VerificationService {
	
	public boolean sendCode(String userId, String name, String mail);
	
	public boolean verifyCode(String email, String code);
}
