package cha.user.service;

import java.util.List;

import cha.user.dto.UserDTO;

public interface UserService {
   // 전체 회원 출력 메서드
   public List<UserDTO> getAllUser(int startRow, int pageSize, String sortType, String sort);
   // 전체 회원 개수
   public int getAllCount();
   
   // 검색 회원 출력
   public List<UserDTO> getSearchUser(String searchType, String searchWord, int startRow, int pageSize, String sortType, String sort);
   // 검색 회원 개수 
   public int getSearchCount(String searchType, String searchWord);
   
   // 아이디 중복체크
   public boolean existUserId(String userId);
   
   // 회원 가입
   public int insertUser(UserDTO udto);
   
   // 로그인할 계정이 DB에 있는지 아이디 중복체크
   public boolean isUser(String userId);
   
   // 회원 수정
   public boolean modUser(UserDTO udto);
   
   // 회원 탈퇴
   public boolean delUser(List<String> delIdList);
   
   // 회원 1명
   public UserDTO oneUser(String userId);
   
   // 비밀번호 반환
   public String getPass(String userId);
   
   // 로그인 정보확인
   public UserDTO loginConfirm(UserDTO udto);

   //회원 아이디, 메일 체크  아이디 찾기
   public String findUserId(String name, String mail);

   //회원 아이디, 이름, 메일 체크 비밀번호 찾기
   public boolean findUserPw(String userId,String name, String mail);
 
 //회원 비밀번호 재설정
 public boolean updatePassword(String userId, String newPw);
}


