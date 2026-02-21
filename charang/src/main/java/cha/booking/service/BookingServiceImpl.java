package cha.booking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cha.booking.dto.BookingDTO;
import cha.booking.mapper.BookingMapper;

@Service
public class BookingServiceImpl implements BookingService {
	
	@Autowired
	BookingMapper bookingmapper;
	
	@Override
	public List<BookingDTO> getAllBooking() {
		System.out.println("예약 서비스 : 전체 예약 출력 서비스");
		return bookingmapper.getAllBooking();
	}
	
	@Override
	public List<BookingDTO> getUserBooking(String userId) {
		System.out.println("예약 서비스 : 로그인 유저 예약 출력 서비스");
		return bookingmapper.getUserBooking(userId);
	}

	@Override
	public int insertBooking(BookingDTO bdto) {
		System.out.println("예약 서비스 : 예약 삽입 서비스");
		bookingmapper.insertBooking(bdto);
		return 1;
	}

	@Override
	public boolean deleteBooking(String bookingId) {
	    return bookingmapper.deleteBooking(bookingId) > 0;
	}





}
