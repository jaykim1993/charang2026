package cha.car.service;

import java.util.List;


import cha.car.dto.CarDTO;

public interface CarService {
   
   // 차량 전체 출력 서비스
   public List<CarDTO> getAllCar();
   // 차량 전체 출력 페이징 포함된 서비스
   public List<CarDTO> getAllCarPage(int startRow, int pageSize, String sortType, String sort);
   
   //   검색 차량 출력 서비스
   public List<CarDTO> getSearchCar(
      int startRow, 
      int pageSize,
      String searchType, 
      String searchKeyWord, 
      String sortType, 
      String sort
      );

   // 차량 추가 서비스
   public boolean addCar(CarDTO cdto);

   // 차량 삭제 서비스
   public boolean delCar(List<Integer> carId);

   // 차량 전체 목록 개수 서비스
   public int getAllCount();

   // 검색 차량 개수 서비스
   public int getSearchCount(String searchType, String searchKeyWord);
   
   // 차량 상세보기 서비스
   public CarDTO getOneCar(int carId);
   
   // 차량 수정하기 서비스
   public int updateCar(CarDTO carData);
   
   // 인기순 출력
   public List<CarDTO> getPopular();

}
