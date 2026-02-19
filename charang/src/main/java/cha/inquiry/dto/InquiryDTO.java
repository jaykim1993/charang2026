package cha.inquiry.dto;

import java.util.Date;

public class InquiryDTO {
   private String inquiryId;
   private String userId;
   private String title;
   private String content;
   private String regDate;
   private Date modDate;
   private String answer;
   private String password;
   
   public String getInquiryId() {
      return inquiryId;
   }
   public void setInquiryId(String inquiryId) {
      this.inquiryId = inquiryId;
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
   public String getRegDate() {
      return regDate;
   }
   public void setRegDate(String regDate) {
      this.regDate = regDate;
   }
   public Date getModDate() {
      return modDate;
   }
   public void setModDate(Date modDate) {
      this.modDate = modDate;
   }
   public String getAnswer() {
      return answer;
   }
   public void setAnswer(String answer) {
      this.answer = answer;
   }
   public String getPassword() {
      return password;
   }
   public void setPassword(String password) {
      this.password = password;
   }
}
