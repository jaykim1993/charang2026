package cha.user.service;

import java.util.List;

import cha.user.dto.UserDTO;

public interface UserService {
<<<<<<< HEAD
   // 전체 회원 출력 메서드
	public List<UserDTO> getAllUser(int startRow, int pageSize);
   // 전체 회원 개수
   public int getAllCount();
   
   // 검색 회원 출력
   public List<UserDTO> getSearchUser(String search, int startRow, int pageSize);
   // 검색 회원 개수 
   public int getSearchCount(String search);
=======
   // �쟾泥� �쉶�썝 異쒕젰 硫붿꽌�뱶
	public List<UserDTO> getAllUser();
>>>>>>> main
   
   //회    틉     揷 체크
   public boolean existUserId(String userId);
   
   //회        煞 
   public int insertUser(UserDTO udto);
   
   // 慣             DB    獵       絹   揷 체크
   public boolean isUser(String userId);
   
   //회       
   public boolean modUser(UserDTO udto);
   
<<<<<<< HEAD
   //ȸ   Ż  
   public boolean delUser(List<String> delIdList);
=======
   //회   탈  
   public boolean delUser(String userId);
>>>>>>> main
   
   // 綺          회
   public UserDTO oneUser(String userId);
   
   // 綺    戟        환
   public String getPass(String userId);
   
   // 慣   
   public UserDTO loginConfirm(UserDTO udto);
<<<<<<< HEAD

=======
   
// 2026/02/23 찬하 추가 
   
 //회원 아이디, 메일 체크  아이디 찾기
 public String findUserId(String name, String mail);

 //회원 아이디, 이름, 메일 체크 비밀번호 찾기
 public boolean findUserPw(String userId,String name, String mail);
 
 //회원 비밀번호 재설정
 public boolean updatePassword(String userId, String newPw);
>>>>>>> main
}


