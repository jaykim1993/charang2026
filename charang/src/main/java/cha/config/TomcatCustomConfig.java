//package cha.config;
//
//import org.springframework.boot.tomcat.servlet.TomcatServletWebServerFactory;
//import org.springframework.boot.web.server.WebServerFactoryCustomizer;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class TomcatCustomConfig {
//	@Bean
//    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> customizer() {
//        return factory -> factory.addConnectorCustomizers(connector -> {
//            // 1. 멀티파트 요청을 포함하여 총 파라미터 개수 제한을 200개로 확장
//            // 학생분의 필드 27개를 수용하기에 충분한 수치입니다.
//            connector.setMaxParameterCount(200);
//           
//            // 2. POST로 들어오는 데이터 크기 제한 해제
//            connector.setMaxPostSize(-1);
//        });
//    }
//}
