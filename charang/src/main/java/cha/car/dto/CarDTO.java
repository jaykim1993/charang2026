package cha.car.dto;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

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
	 @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date regDate;
	 @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date modDate;
	private String name;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getCarId() {
		return carId;
	}
	public void setCarId(int carId) {
		this.carId = carId;
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
}
