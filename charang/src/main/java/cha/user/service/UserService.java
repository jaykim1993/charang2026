package cha.user.service;

import java.util.List;

import cha.user.dto.UserDTO;

public interface UserService {
   // 전체 회원 출력 메서드
	public List<UserDTO> getAllUser(int startRow, int pageSize);
   // 전체 회원 개수
   public int getAllCount();
   
   // 검색 회원 출력
   public List<UserDTO> getSearchUser(String search, int startRow, int pageSize);
   // 검색 회원 개수 
   public int getSearchCount(String search);
   
   //ȸ    Ƶ     ߺ üũ
   public boolean existUserId(String userId);
   
   //ȸ        ߰ 
   public int insertUser(UserDTO udto);
   
   // α             DB    ִ       ̵   ߺ üũ
   public boolean isUser(String userId);
   
   //ȸ       
   public boolean modUser(UserDTO udto);
   
   //ȸ   Ż  
   public boolean delUser(List<String> delIdList);
   
   // ѻ          ȸ
   public UserDTO oneUser(String userId);
   
   // ѻ    н        ȯ
   public String getPass(String userId);
   
   // α   
   public UserDTO loginConfirm(UserDTO udto);

}
