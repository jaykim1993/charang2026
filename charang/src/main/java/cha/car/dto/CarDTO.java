package cha.car.dto;

import java.sql.Date;
import java.time.LocalDateTime; // 변경

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class CarDTO {
   private int carId;
   private String carImg;  // 차 아이디
   private String brandLogo;
   private String brand;
   private String model;
   private String color;
   private String plateNumber;
   private int modelYear;
   private int seats;
   private String carSize;
   private String carType;
   private String fuelType;
   private int branchId;
   private int licenseType;
   private int driverMinAge;
   private String kmPer;
   private double priceValue;
   private int navigation;
   private int rearCamera;
   private int heatSeat;
   private int heatHandle;
   private int bluetooth;
   private int smartKey;
   private int sunRoof;
   @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
   private LocalDateTime regDate;
   @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
   private LocalDateTime modDate;
   private String name;
   
   
}
