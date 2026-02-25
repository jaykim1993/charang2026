package cha.booking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cha.booking.dto.BookingDTO;
import cha.booking.service.BookingService;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class BookingApiController {
	@Autowired
	BookingService bookingservice;
	
	@GetMapping("/booklist")
	public List<BookingDTO> getAllBookingList(){
		System.out.println("예약 컨트롤러 - 예약 전체 출력 컨트롤러");
		return bookingservice.getAllBooking();
	}
	
	@GetMapping("/userbooklist")
	public List<BookingDTO> getUserBookingList(HttpSession session){
		String loginId = (String) session.getAttribute("loginUser");
		return bookingservice.getUserBooking(loginId);
	}
	
	@PostMapping("/insertBook")
	public int insertBooking(@RequestBody BookingDTO bdto) {
		return bookingservice.insertBooking(bdto);
	}
	
	@DeleteMapping("/deleteBook")
	public boolean deleteBooking(@RequestParam("bookingId") String bookingId) {
		System.out.println("예약 컨트롤러 - 예약 삭제 컨트롤러(회원)");
		boolean result = bookingservice.deleteBooking(bookingId);
		return result;
	}
	
	@DeleteMapping("/deleteSelectBooks")
	public boolean deleteSelectedBookings(
			@RequestBody List<String> bookingId
			) {
		System.out.println("예약 컨트롤러 - 선택 예약 삭제 컨트롤러(관리자)");
		System.out.println(bookingId);
		boolean result = bookingservice.deleteSelectedBookings(bookingId);
		return result;
	}
}
