package cha.notice.dto;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
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
   
  
   
}
