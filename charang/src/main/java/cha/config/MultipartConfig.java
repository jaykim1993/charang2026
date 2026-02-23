//package cha.config;
//
//import org.springframework.boot.servlet.MultipartConfigFactory;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import jakarta.servlet.MultipartConfigElement;
//
//@Configuration
//public class MultipartConfig {
//	@Bean
//    public MultipartConfigElement multipartConfigElement() {
//        MultipartConfigFactory factory = new MultipartConfigFactory();
//       
//        // 27개의 필드 전송을 허용하기 위해 개수 제한을 확 늘립니다.
//        factory.setFileCountLimit(100);
//       
//        // 용량 제한 에러를 방지하기 위해 함께 설정
//        // factory.setMaxFileSize(DataSize.ofMegabytes(10));
//       
//        return factory.createMultipartConfig();
//    }
//}
