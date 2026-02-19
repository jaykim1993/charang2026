package cha.notice.dto;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class NoticeDTO {

   private int noticeId;
   private String userId;
   private String title;
   private String content;
   @JsonFormat(pattern = "yyyy-MM-dd")
   private Date regDate;
   @JsonFormat(pattern = "yyyy-MM-dd")
   private Date modDate;
   private int readCount;
   
   public int getNoticeId() {
	return noticeId;
   }
   public void setNoticeId(int noticeId) {
	this.noticeId = noticeId;
   }
   public String getUserId() {
	return userId;
   }
   public void setUserId(String userId) {
	this.userId = userId;
   }
   public String getTitle() {
	return title;
   }
   public void setTitle(String title) {
	this.title = title;
   }
   public String getContent() {
	return content;
   }
   public void setContent(String content) {
	this.content = content;
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
   public int getReadCount() {
	return readCount;
   }
   public void setReadCount(int readCount) {
	this.readCount = readCount;
   }
   
}
