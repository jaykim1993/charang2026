package cha.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cha.user.dto.UserDTO;
import cha.user.service.UserService;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class UserApiController {
   
   @Autowired
   UserService userservice;
   
   //ȸ      ̵   ߺ üũ
   @PostMapping("/checkid")
   public boolean checkId(@RequestBody UserDTO udto) {
       System.out.println("   ̵   ߺ Ȯ     û");
       boolean exist = userservice.existUserId(udto.getUserId());
       return exist; 
   }
   
   //ȸ        ޼   
   @PostMapping("/signup")
   public int signup(@RequestBody UserDTO udto) {
      System.out.println("     Ʈ ѷ  signup   û  ");
      return userservice.insertUser(udto);
   }
   
   // α     ޼   
   @PostMapping("/login")
   public UserDTO login(@RequestBody UserDTO udto, HttpSession session) {
         System.out.println("api  Ʈ ѷ  login   û  ");
         //loginUser = {no:~,id:~,pw:~,mail:~,phone:~ ,~~}
         UserDTO loginUser = userservice.loginConfirm(udto);
         if(loginUser != null) {
            session.setAttribute("loginUser", loginUser.getUserId());
         }
         //React   JSON   ȯ      
         return loginUser;
      }
   
   // α׾ƿ  
   @GetMapping("/logout")
   public int logout(HttpSession session) {
         System.out.println("api  Ʈ ѷ  logout   û  ");
         session.invalidate();
         return 1;
      }
   
   //  Ѹ         ȸ
   @GetMapping("/userinfo")
   public UserDTO myInfo(HttpSession session) {
         System.out.println("api  Ʈ ѷ  myinfo   û  ");
         String loginId = (String) session.getAttribute("loginUser");
         if(loginId == null) {
            return null;
         }
         return userservice.oneUser(loginId);
      }
   
   // Ѹ      
   @DeleteMapping("/delete")
   public int delete(HttpSession session) {
      String loginId = (String) session.getAttribute("loginUser");
      if(loginId == null) {
         return 0;
      }
      boolean result = userservice.delUser(loginId);
      if(result) {
         session.invalidate();
         return 1;
      }else {
         return 0;
      }
   }
   
   
   

}
