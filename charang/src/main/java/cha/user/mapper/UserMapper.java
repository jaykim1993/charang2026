package cha.user.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import cha.user.dto.UserDTO;


@Mapper
public interface UserMapper {

     // 전체 회원 출력
   public List<UserDTO> selectAllUser(
         @Param("startRow") int startRow,
         @Param("pageSize") int pageSize,
         @Param("sortType") String sortType, 
         @Param("sort") String sort
         );
   // 전체 회원 개수
   public int getAllCnt();
   
   // 검색 회원 출력
   public List<UserDTO> getUserSearch(
         @Param("searchType") String searchType, 
         @Param("searchWord") String searchWord,
         @Param("startRow") int startRow,
         @Param("pageSize") int pageSize,
         @Param("sortType") String sortType, 
         @Param("sort") String sort
         );
   // 검색 회원 개수
   public int getUserSearchCount(
         @Param("searchType") String searchType, 
         @Param("searchWord") String searchWord
         );
   
   // 회원가입
   public int insertUser(UserDTO udto);
   
   // 로그인할 계정이 DB에 있는지 아이디 중복체크
   public boolean isUser(String userId);
   
   // 회원 수정
   public int modUser(UserDTO udto);
   
   // 회원 탈퇴
   public int delUser(List<String> delIdList);
   
   // 회원 1명
   public UserDTO oneUser(String userId);
   
   // 비밀번호 반환
   public String getPass(String userId);
   
   // 아이디 중복체크
   public boolean existUserId(String userId);

   //회원 아이디, 메일 체크  아이디 찾기
   public String findUserId(@Param("name")String name, @Param("mail")String mail);
 
   //회원 아이디, 이름, 메일 체크 비밀번호 찾기  
   public boolean findUserPw(@Param("userId")String userId, @Param("name")String name, @Param("mail")String mail);
   
   //회원 비번찾기 재설정
   public boolean updatePassword(@Param("userId")String userId, @Param("newPw")String newPw);
   
}
