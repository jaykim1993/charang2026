package cha;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{
	
//	@Override
//	public void addResourceHandlers(ResourceHandlerRegistry registry) {
//		registry.addResourceHandler("/images/**")
//		        .addResourceLocations("file:///C:/rentcar2026/charang/frontend/public/images/");
//	}
	
	/**
     * addResourceHandlers: 정적 리소스(이미지, CSS, JS 등)를 관리하는 메서드이다.
     * 외부의 물리적인 경로를 웹에서 사용하는 URL 주소로 매핑하는 설정을 담당한다.
     */
	
	// 이미지 업로드가 안되는 이슈때문에 아래처럼 코드르 수정한다.
	@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
 
       // React public 폴더 경로 (본인 프로젝트 경로에 맞게 수정)
       // registry.addResourceHandler("/img/**")
       //         .addResourceLocations("classpath:/static/img/","file:///C:/springPjt/greenspringot/com.green_MyBatis/frontend/public/img/");
   
		   registry.addResourceHandler("/images/**")
		    .addResourceLocations("classpath:/static/images/");
		
    }
	
	// F5누르면 오류뜨는 이슈때문에 반드시 작성한다.
	@Override
	public void addViewControllers(ViewControllerRegistry registry) {

		// 모든 계층의 경로를 index.html로 포워딩합니다. (가장 권장되는 방식)
	    registry.addViewController("/**/{path:[^\\.]*}")
	            .setViewName("forward:/index.html");
	
	}
}
