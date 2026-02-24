package cha.booking.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import cha.booking.dto.BookingDTO;

@Mapper
public interface BookingMapper {
	
	// 전체 예약 출력 메서드
	public List<BookingDTO> getAllBooking();
	
	// 로그인 회원 예약 출력 메서드
	public List<BookingDTO> getUserBooking(String userId);
	
	// 예약 추가 메서드
	public int insertBooking(BookingDTO bdto);
	
	// 예약 삭제 메서드(회원용)
	public int deleteBooking(String bookingId);
	
	// 선택 예약 다수 삭제 메서드(관리자용)
	public int deleteSelectedBookings(List<String> bookingId);
	
}
