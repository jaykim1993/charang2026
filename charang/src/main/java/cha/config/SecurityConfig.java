package cha.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration  // 이 클래스는 환경설정한다. 는 뜻
@EnableWebSecurity  // 우리가 지정한 암호화를 웹어플리케이션에 적용한다. 는 뜻
public class SecurityConfig {
	@Bean  // IoC 스프링 컨테이너에 Bean 객체로 등록한다
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();  // 예) 1234 -> rejwurgfd 처럼 문자열 암호화 시켜줌
	}
	
//	기본적으로 동작하는 기능을 꺼야하기 때문에 disable로 비활성화 시킴
	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
		.cors(cors-> cors.disable())
		.csrf(csrf-> csrf.disable());
		
		http
		.formLogin(login-> login.disable());
		
		return http.build();
	}
}
