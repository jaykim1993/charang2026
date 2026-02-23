package cha.car.controller;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import cha.PageHandler;
import cha.car.dto.CarDTO;
import cha.car.service.CarService;

@RestController
@RequestMapping("/api")
public class CarApiController {
	@Autowired
	CarService carservice;
	
	// 전체 차량 출력 컨트롤러
	@GetMapping("/")
	public List<CarDTO> getAllCar(){
		System.out.println("차 컨트롤러 - 차량 전체 출력 컨트롤러");
		return carservice.getAllCar();
	}
	
//	@GetMapping("/")
//	public Map<String, Object> getAllCarList(
////			1. 페이지 번호 - 1부터 시작이므로 초기값 1로 정의
//			@RequestParam(value="page", defaultValue = "1") int page,
////			2. 페이지 사이즈 - 한 화면에 보여지는 게시글 개수를 5로 초기화
//			@RequestParam(value = "pageSize", defaultValue = "10") int pageSize
//			){
//		
//		System.out.println("차 컨트롤러 - 차량 전체 출력 컨트롤러");
//		
//		int totalCnt = carservice.getAllCount();
//		
////		PageHandler 클래스 접근하기 위해 인스턴스화
//		PageHandler ph = new PageHandler(totalCnt, page, pageSize);
//		
////		List<NoticeDTO> noticeList = noticeService.getPageList(totalCnt, pageSize);
//		List<CarDTO> carList = carservice.getSearchCar(ph.getStartRow(), pageSize);
//		
//		Map<String, Object> result = new HashMap<>();
//		
//        result.put("list", carList);
//        result.put("ph", ph);
//		System.out.println(result);
//		return result;  // JSON 형태로 받아가야해서 
//	}
	
	// 검색 차량 출력 컨트롤러
	@GetMapping("/searchCar")
	public Map<String, Object> getSearchCarList(
			@RequestParam("searchType") String searchType,
		    @RequestParam("searchWord") String searchKeyWord,
//			1. 페이지 번호 - 1부터 시작이므로 초기값 1로 정의
			@RequestParam(value="page", defaultValue = "1") int page,
//			2. 페이지 사이즈 - 한 화면에 보여지는 게시글 개수를 5로 초기화
			@RequestParam(value = "pageSize", defaultValue = "10") int pageSize
			){
		System.out.println("차 컨트롤러 - 검색 차량 출력 컨트롤러");
		
//		List<NoticeDTO> noticeList = noticeService.getPageList(totalCnt, pageSize);
		List<CarDTO> carList;
		PageHandler ph;
		
		Map<String, Object> result = new HashMap<>();
		
		// 검색 O -> 검색 결과 존재 -> (검색 차량만 출력)
		if(searchType != null && !searchKeyWord.trim().isEmpty()) {
			int totalCnt = carservice.getSearchCount(searchType, searchKeyWord); // 검색 차량 개수
			ph = new PageHandler(totalCnt, page, pageSize);
			carList = carservice.getSearchCar(ph.getStartRow(), pageSize, searchType, searchKeyWord);
		}
		// 검색 X -> 전체 차량 출력
		else {
			int totalCnt = carservice.getAllCount(); // 전체 차량 개수
			ph = new PageHandler(totalCnt, page, pageSize);
			carList = carservice.getAllCarPage(ph.getStartRow(), pageSize);
		}
		
		result.put("list", carList);
		result.put("ph", ph);
		return result;
	}
	
	// 차량 삭제 컨트롤러
	@PostMapping("/delCar")
	public boolean delCarList(
			@RequestBody List<Integer> carId
			) {
		System.out.println("차 컨트롤러 - 차량 삭제 컨트롤러");
		
		boolean result = carservice.delCar(carId);
		return result;
	}
	
	// 차량 추가 컨트롤러
	@PostMapping("/addCar")
	public int addCarList(
			// ★ 파일(이미지)와 dto를 동시에 받아야할 땐 FormData 사용, @RequestBody X 없애야함
			@ModelAttribute CarDTO cdto, // RequestBody는 post만 가능(dto로 값을 받을 때)
			// 이미지 받기(name이랑 동일해야함)
			@RequestParam(value="brandLogoImg",required=false) MultipartFile brandLogoImg,
			@RequestParam(value="carImgImg",required=false) MultipartFile carImgImg
			) throws IllegalStateException, IOException {
		
		System.out.println("차 컨트롤러 - 차량 추가 컨트롤러");
		
		// 01. 이미지 파일을 저장할 실제 하드디스크 위치 지정(webConfig에서 설정한 경로와 일치)
		String savePath = "C:/rentcar2026/charang/frontend/public/images/cars/";
		
		// 02. 해당 폴더가 존재하지 않을 경우 자동생성
		File saveDir = new File(savePath);
		if(!saveDir.exists()) {
			saveDir.mkdirs();
		}
		
		// 03. 이미지 업로드 처리
		// 예외처리?
		String fileName01 = "";
		String fileName02 = "";
		
		if(!brandLogoImg.isEmpty()) {
			// 사용자가 올린 파일명 가져옴
			String originalName = brandLogoImg.getOriginalFilename();
			
			// 파일명 중복해서 입력되지 않도록 UUID 클래스 이용
			fileName01 = UUID.randomUUID().toString().substring(0,4)+"_"+originalName;
			
			// 파일
			File file = new File(savePath+fileName01);
			
			// 서버에만 존재하던 파일이 실제 하드디스크에 생성됨
			brandLogoImg.transferTo(file); // 자동으로 throws IllegalStateException, IOException 생김
			
			// DB에 저장
			cdto.setBrandLogo(fileName01);
		}
		
		if(!carImgImg.isEmpty()) {
			// 사용자가 올린 파일명 가져옴
			String originalName = carImgImg.getOriginalFilename();
			
			// 파일명 중복해서 입력되지 않도록 UUID 클래스 이용
			fileName02 = UUID.randomUUID().toString().substring(0,4)+"_"+originalName;
			
			// 파일
			File file = new File(savePath+fileName02);
			
			// 서버에만 존재하던 파일이 실제 하드디스크에 생성됨
			carImgImg.transferTo(file); // 자동으로 throws IllegalStateException, IOException 생김
			
			// DB에 저장
			cdto.setCarImg(fileName02);
		}
		
		// 이미지까지 들어간 최종 cdto로 DB로 접근
		carservice.addCar(cdto);
		return 1;
		

	}
}
