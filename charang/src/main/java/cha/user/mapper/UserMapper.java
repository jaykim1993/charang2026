package cha.user.mapper;

import org.apache.ibatis.annotations.Mapper;

import cha.user.dto.UserDTO;


@Mapper
public interface UserMapper {
   /*   //ȸ        ߺ     
   public final static int userid_alreday_exit = 0;
   // ȸ               
   public final static int userid_success = 1;
   // ȸ               
   public final static int userid_fail = -1;
   */
   
   //ȸ        ߰ 
   public int insertUser(UserDTO udto);
   
   // α             DB    ִ       ̵   ߺ üũ
   public boolean isUser(String userId);
   
   //ȸ       
   public int modUser(UserDTO udto);
   
   //ȸ   Ż  
   public int delUser(String userId);
   
   // ѻ          ȸ
   public UserDTO oneUser(String userId);
   
   // ѻ    н        ȯ
   public String getPass(String userId);
   
   //ȸ    Ƶ     ߺ üũ
   public boolean existUserId(String userId);
   
}
