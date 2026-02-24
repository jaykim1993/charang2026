package cha.user.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

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
	
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUserPw() {
		return userPw;
	}
	public void setUserPw(String userPw) {
		this.userPw = userPw;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getMail() {
		return mail;
	}
	public void setMail(String mail) {
		this.mail = mail;
	}
	public String getResistNum() {
		return resistNum;
	}
	public void setResistNum(String resistNum) {
		this.resistNum = resistNum;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getAddressDetail() {
		return addressDetail;
	}
	public void setAddressDetail(String addressDetail) {
		this.addressDetail = addressDetail;
	}
	public int getIsKorean() {
		return isKorean;
	}
	public void setIsKorean(int isKorean) {
		this.isKorean = isKorean;
	}
	public String getLicense() {
		return license;
	}
	public void setLicense(String license) {
		this.license = license;
	}
	public String getLicenseNum() {
		return licenseNum;
	}
	public void setLicenseNum(String licenseNum) {
		this.licenseNum = licenseNum;
	}
	public Date getRegDate() {
		return regDate;
	}
	public void setRegDate(Date regDate) {
		this.regDate = regDate;
	}
	public Date getModDate() {
		return modDate;
	}
	public void setModDate(Date modDate) {
		this.modDate = modDate;
	}
	
	
}
