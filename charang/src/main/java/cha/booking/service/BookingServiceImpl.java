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
	public int insertBooking(BookingDTO bdto) {
		int result = bookingmapper.insertBooking(bdto);
		return 1;
	}

	@Override
	public int deleteBooking(String bookingId) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int modBooking(BookingDTO bdto) {
		// TODO Auto-generated method stub
		return 0;
	}

}
