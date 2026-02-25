package cha.verification.dto;

import java.time.LocalDateTime;

public class VerificationDTO {
	 private String email;
	 private String code; 
	 private LocalDateTime expireTime;
	 
	 public String getEmail() {
		 return email;
	 }
	 public void setEmail(String email) {
		 this.email = email;
	 }
	 public String getCode() {
		 return code;
	 }
	 public void setCode(String code) {
		 this.code = code;
	 }
	 public LocalDateTime getExpireTime() {
		 return expireTime;
	 }
	 public void setExpireTime(LocalDateTime expireTime) {
		 this.expireTime = expireTime;
	 }
	 
	 
	 
	 
}
