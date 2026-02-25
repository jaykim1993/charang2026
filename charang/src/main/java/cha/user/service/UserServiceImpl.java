package cha.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import cha.user.dto.UserDTO;
import cha.user.mapper.UserMapper;

@Service
public class UserServiceImpl implements UserService {
   // �쟾泥� �쉶�썝 異쒕젰
	@Override
<<<<<<< HEAD
	public List<UserDTO> getAllUser(int startRow, int pageSize) {
		System.out.println("전체 회원 출력 서비스");
		return usermapper.selectAllUser(startRow, pageSize);
=======
	public List<UserDTO> getAllUser() {
		System.out.println("User serviceImpl 전체 회원 출력");
		return usermapper.selectAllUser();
>>>>>>> main
	}
	// 전체 회원 개수
   @Override
   public int getAllCount() {
	   System.out.println("전체 회원 개수 서비스");
		return usermapper.getAllCnt();
   }
	
	// 검색 회원 출력
   @Override
   public List<UserDTO> getSearchUser(String search,int startRow, int pageSize) {
	   System.out.println("검색 회원 출력 서비스");
	   return usermapper.getUserSearch(search,startRow,pageSize);
   }
   // 검색 회원 개수 
   @Override
   public int getSearchCount(String search) {
	   System.out.println("검색 회원 개수 서비스");
	   return usermapper.getUserSearchCount(search);
   }
   

   // 회        揷 
   public final static int user_duplicate = 0;
   // 회           
   public final static int user_success = 1;
   // 회           
   public final static int user_fail = -1;
   
   @Autowired
   UserMapper usermapper;
   
   @Autowired
   PasswordEncoder passwordEncoder;
   
   @Override
   public int insertUser(UserDTO udto) {
	   System.out.println("User serviceImpl 회원 추가 출력");
      boolean isUser = usermapper.isUser(udto.getUserId());
      if(isUser == false) {
         String encodepw = passwordEncoder.encode(udto.getUserPw());
         udto.setUserPw(encodepw);
         int result = usermapper.insertUser(udto);
         if(result > 0 ) {
            return user_success;
         }else {
            return user_fail;
         }
      }else {
         return user_duplicate;
      }
   }

   @Override
   public boolean isUser(String userId) {
       return usermapper.isUser(userId);
   }

   @Override
   public boolean modUser(UserDTO udto) {
       String dbPass = usermapper.getPass(udto.getUserId());
       if(dbPass == null) {
           return false;
       }
       if(passwordEncoder.matches(udto.getUserPw(), dbPass)) {
           return usermapper.modUser(udto) == 1;
       }
       return false;
   }
   
   @Override
<<<<<<< HEAD
   public boolean delUser(List<String> delIdList) {
      System.out.println("User      ȸ      /Ż  ");
      return usermapper.delUser(delIdList) == 1;
=======
   public boolean delUser(String userId) {
      System.out.println("User      회      /탈  ");
      return usermapper.delUser(userId) == 1;
>>>>>>> main
   }

   @Override
   public UserDTO oneUser(String userId) {
      System.out.println("User       祺    회     회");
      return usermapper.oneUser(userId);
   }

   @Override
   public String getPass(String userId) {
      System.out.println("User getPass 유저 비밀번호 반환 ");
      return usermapper.getPass(userId);
   }
   
   public UserDTO loginConfirm(UserDTO udto) {
      System.out.println("UserService loginConfirm() 로그인성공확인  ");
      UserDTO dbUser = usermapper.oneUser(udto.getUserId());
      if(dbUser != null && dbUser.getUserPw() != null) {
         if(passwordEncoder.matches(udto.getUserPw(), dbUser.getUserPw())) { //  호화 歐 
            return dbUser;
         }
      }
      return null;
   }

   @Override
   public boolean existUserId(String userId) {
      System.out.println("UserService existUserId() 유저존재확인  ");
       return usermapper.existUserId(userId);
   }


<<<<<<< HEAD
=======
   @Override
   public String findUserId(String name, String mail) {
	   System.out.println("UserService findUserId() 유저 아이디찾기  ");
       String dbUser = usermapper.findUserId(name, mail);
       if (dbUser == null) {
           return null;
       }
	   return dbUser;
   }

   @Override
   public boolean findUserPw(String userId, String name, String mail) {
	   System.out.println("MemberService findUserPw() 유저 비밀번호찾기  ");
	   return usermapper.findUserPw(userId, name, mail);
   }

   @Override
   public boolean updatePassword(String userId, String newPw) {
	   System.out.println("MemberService updatePassword() 유저 비밀번호찾기 / 비번변경  ");
	   String encodePw = passwordEncoder.encode(newPw);
	   return usermapper.updatePassword(userId, encodePw);
   }
   
   
   
>>>>>>> main
}
