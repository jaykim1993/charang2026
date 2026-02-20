package cha.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import cha.user.dto.UserDTO;
import cha.user.mapper.UserMapper;

@Service
public class UserServiceImpl implements UserService {
   	// 전체 회원 출력
	@Override
	public List<UserDTO> getAllUser() {
		System.out.println("전체 회원 출력 서비스");
		return usermapper.selectAllUser();
	}

   // ȸ        ߺ 
   public final static int user_duplicate = 0;
   // ȸ           
   public final static int user_success = 1;
   // ȸ           
   public final static int user_fail = -1;
   
   @Autowired
   UserMapper usermapper;
   
   @Autowired
   PasswordEncoder passwordEncoder;
   
   @Override
   public int insertUser(UserDTO udto) {
      System.out.println("User      ȸ   ߰ ");
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
   public boolean delUser(String userId) {
      System.out.println("User      ȸ      /Ż  ");
      return usermapper.delUser(userId) == 1;
   }

   @Override
   public UserDTO oneUser(String userId) {
      System.out.println("User       Ѹ    ȸ     ȸ");
      return usermapper.oneUser(userId);
   }

   @Override
   public String getPass(String userId) {
      System.out.println("User      ȸ       й ȣ   ȯ ");
      return usermapper.getPass(userId);
   }
   
   public UserDTO loginConfirm(UserDTO udto) {
      System.out.println("MemberService loginConfirm() ޼ҵ  Ȯ  ");
      UserDTO dbUser = usermapper.oneUser(udto.getUserId());
      if(dbUser != null && dbUser.getUserPw() != null) {
         if(passwordEncoder.matches(udto.getUserPw(), dbUser.getUserPw())) { //  ȣȭ ϱ 
            return dbUser;
         }
      }
      return null;
   }

   @Override
   public boolean existUserId(String userId) {
      System.out.println("MemberService existUserId() ޼ҵ  Ȯ  ");
       return usermapper.existUserId(userId);
   }
}
