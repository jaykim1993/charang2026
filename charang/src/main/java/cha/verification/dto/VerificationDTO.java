package cha.verification.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class VerificationDTO {
	 private String email;
	 private String code; 
	 private LocalDateTime expireTime;

	 
}
