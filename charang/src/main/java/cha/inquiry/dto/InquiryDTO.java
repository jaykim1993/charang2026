package cha.inquiry.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class InquiryDTO {
   private String inquiryId;
   private String userId;
   private String title;
   private String content;
   @JsonFormat(pattern = "yyyy-MM-dd")
   private String regDate;
   @JsonFormat(pattern = "yyyy-MM-dd")
   private Date modDate;
   private String answer;
   private String password;
   private String name;
   
   
}
