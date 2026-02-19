package cha.user.service;

import cha.user.dto.UserDTO;

public interface UserService {
   
   //ȸ    Ƶ     ߺ üũ
   public boolean existUserId(String userId);
   
   //ȸ        ߰ 
   public int insertUser(UserDTO udto);
   
   // α             DB    ִ       ̵   ߺ üũ
   public boolean isUser(String userId);
   
   //ȸ       
   public boolean modUser(UserDTO udto);
   
   //ȸ   Ż  
   public boolean delUser(String userId);
   
   // ѻ          ȸ
   public UserDTO oneUser(String userId);
   
   // ѻ    н        ȯ
   public String getPass(String userId);
   
   // α   
   public UserDTO loginConfirm(UserDTO udto);
}
