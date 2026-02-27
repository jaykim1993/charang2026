package cha.manager.dto;

import java.sql.Date;

import lombok.Data;
// 예약 + 차량 join 데이터

@Data
public class ManagerDTO {
	// 예약 테이블
	private String bookingId;
	private String userId;
	private String name;
	private int carId;
	private String bookedDate;
	private String startDate;
	private String startTime;
	private String endDate;
	private String endTime;
	private int carPrice;
	private int insurancePrice;
	private int totalPrice;
	private String paymentMethod;
	// 차량 테이블
	private String carImg; 
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
	private Date regDate;
	private Date modDate;
	// 개인 예약 미래 / 진행중 / 과거 넣기 위한 변수 선언
	private String bookingStatus;
	
	
	
	
}
