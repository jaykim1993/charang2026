package cha.booking.service;

import java.util.List;

import cha.booking.dto.BookingDTO;


public interface BookingService {
	
	// 전체 예약 출력 메서드
	public List<BookingDTO> getAllBooking();
	
	// 예약 추가 메서드
	public int insertBooking(BookingDTO bdto);
	
	// 예약 삭제 메서드
	public boolean deleteBooking(String bookingId);
	
}
