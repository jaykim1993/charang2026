package cha.manager.dto;

import java.sql.Date;
// 예약 + 차량 join 데이터
public class ManagerDTO {
	// 예약 테이블
	private String bookingId;
	private String userId;
	private int carId;
	private String bookedDate;
	private String startDate;
	private String startTime;
	private String endDate;
	private String endTime;
	private int carPrice;
	private int insurancePrice;
	private int totalPrice;
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
	
	
	public String getBookingId() {
		return bookingId;
	}
	public void setBookingId(String bookingId) {
		this.bookingId = bookingId;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public int getCarId() {
		return carId;
	}
	public void setCarId(int carId) {
		this.carId = carId;
	}
	public String getBookedDate() {
		return bookedDate;
	}
	public void setBookedDate(String bookedDate) {
		this.bookedDate = bookedDate;
	}
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public int getCarPrice() {
		return carPrice;
	}
	public void setCarPrice(int carPrice) {
		this.carPrice = carPrice;
	}
	public int getInsurancePrice() {
		return insurancePrice;
	}
	public void setInsurancePrice(int insurancePrice) {
		this.insurancePrice = insurancePrice;
	}
	public int getTotalPrice() {
		return totalPrice;
	}
	public void setTotalPrice(int totalPrice) {
		this.totalPrice = totalPrice;
	}
	public String getCarImg() {
		return carImg;
	}
	public void setCarImg(String carImg) {
		this.carImg = carImg;
	}
	public String getBrandLogo() {
		return brandLogo;
	}
	public void setBrandLogo(String brandLogo) {
		this.brandLogo = brandLogo;
	}
	public String getBrand() {
		return brand;
	}
	public void setBrand(String brand) {
		this.brand = brand;
	}
	public String getModel() {
		return model;
	}
	public void setModel(String model) {
		this.model = model;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getPlateNumber() {
		return plateNumber;
	}
	public void setPlateNumber(String plateNumber) {
		this.plateNumber = plateNumber;
	}
	public int getModelYear() {
		return modelYear;
	}
	public void setModelYear(int modelYear) {
		this.modelYear = modelYear;
	}
	public int getSeats() {
		return seats;
	}
	public void setSeats(int seats) {
		this.seats = seats;
	}
	public String getCarSize() {
		return carSize;
	}
	public void setCarSize(String carSize) {
		this.carSize = carSize;
	}
	public String getCarType() {
		return carType;
	}
	public void setCarType(String carType) {
		this.carType = carType;
	}
	public String getFuelType() {
		return fuelType;
	}
	public void setFuelType(String fuelType) {
		this.fuelType = fuelType;
	}
	public int getBranchId() {
		return branchId;
	}
	public void setBranchId(int branchId) {
		this.branchId = branchId;
	}
	public int getLicenseType() {
		return licenseType;
	}
	public void setLicenseType(int licenseType) {
		this.licenseType = licenseType;
	}
	public int getDriverMinAge() {
		return driverMinAge;
	}
	public void setDriverMinAge(int driverMinAge) {
		this.driverMinAge = driverMinAge;
	}
	public String getKmPer() {
		return kmPer;
	}
	public void setKmPer(String kmPer) {
		this.kmPer = kmPer;
	}
	public double getPriceValue() {
		return priceValue;
	}
	public void setPriceValue(double priceValue) {
		this.priceValue = priceValue;
	}
	public int getNavigation() {
		return navigation;
	}
	public void setNavigation(int navigation) {
		this.navigation = navigation;
	}
	public int getRearCamera() {
		return rearCamera;
	}
	public void setRearCamera(int rearCamera) {
		this.rearCamera = rearCamera;
	}
	public int getHeatSeat() {
		return heatSeat;
	}
	public void setHeatSeat(int heatSeat) {
		this.heatSeat = heatSeat;
	}
	public int getHeatHandle() {
		return heatHandle;
	}
	public void setHeatHandle(int heatHandle) {
		this.heatHandle = heatHandle;
	}
	public int getBluetooth() {
		return bluetooth;
	}
	public void setBluetooth(int bluetooth) {
		this.bluetooth = bluetooth;
	}
	public int getSmartKey() {
		return smartKey;
	}
	public void setSmartKey(int smartKey) {
		this.smartKey = smartKey;
	}
	public int getSunRoof() {
		return sunRoof;
	}
	public void setSunRoof(int sunRoof) {
		this.sunRoof = sunRoof;
	}
	public Date getRegDate() {
		return regDate;
	}
	public void setRegDate(Date regDate) {
		this.regDate = regDate;
	}
	public Date getModDate() {
		return modDate;
	}
	public void setModDate(Date modDate) {
		this.modDate = modDate;
	}
	public String getBookingStatus() {
		return bookingStatus;
	}
	public void setBookingStatus(String bookingStatus) {
		this.bookingStatus = bookingStatus;
	}
	
	
}
