package cha.user.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class UserDTO {
	private String userId;
	private String userPw;
	private String name;
	private String mail;
	private String resistNum;
	private String phone;
	private String address;
	private String addressDetail;
	private int isKorean;
	private String license;
	private String licenseNum;
	 @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date regDate;
	 @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date modDate;
	
	
	
}
