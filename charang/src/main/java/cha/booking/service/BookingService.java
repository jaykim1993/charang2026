package cha.booking.service;

import java.util.List;

import cha.booking.dto.BookingDTO;


public interface BookingService {
	
	// 전체 예약 출력 메서드
	public List<BookingDTO> getAllBooking();
	
	// 로그인 회원 예약 출력 메서드 => ManagerController에서 예약+차량정보 조인된 메서드로 대체함
	public List<BookingDTO> getUserBooking(String userId);
	
	// 예약 추가 메서드
	public int insertBooking(BookingDTO bdto);
	
	// 예약 삭제 메서드
	public boolean deleteBooking(String bookingId);
	
}
