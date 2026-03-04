package cha;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{
	
	
	/**
     * addResourceHandlers: 정적 리소스(이미지, CSS, JS 등)를 관리하는 메서드이다.
     * 외부의 물리적인 경로를 웹에서 사용하는 URL 주소로 매핑하는 설정을 담당한다.
     */
	
	// 이미지 업로드가 안되는 이슈때문에 아래처럼 코드르 수정했다.
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
	    String rootPath = System.getProperty("user.dir");
	    // 물리적 폴더 경로 (file: 프로토콜을 붙여야 외부 경로로 인식합니다)
	    String uploadPath = "file:" + rootPath + "/uploads/images/";

	    registry.addResourceHandler("/images/**")
	            .addResourceLocations(uploadPath, "classpath:/static/images/");
	}
	
	// F5누르면 오류뜨는 이슈때문에 반드시 작성한다.
	@Override
	public void addViewControllers(ViewControllerRegistry registry) {

		// 모든 계층의 경로를 index.html로 포워딩합니다. (가장 권장되는 방식)
	    registry.addViewController("/**/{path:[^\\.]*}")
	            .setViewName("forward:/index.html");
	
	}
}
