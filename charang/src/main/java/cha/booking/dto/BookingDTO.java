package cha.booking.dto;

import lombok.Data;

@Data
public class BookingDTO {
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
	private String paymentMethod;
	
	
}
