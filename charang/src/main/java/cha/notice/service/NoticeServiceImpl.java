package cha.notice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cha.notice.dto.NoticeDTO;
import cha.notice.mapper.NoticeMapper;

@Service
public class NoticeServiceImpl implements NoticeService {
	@Autowired
	NoticeMapper noticemapper;

//	@Override
//	public List<NoticeDTO> getAllNoticeList() {
//		System.out.println("NoticeServiceImpl - 공지 목록");
//		
//		return noticemapper.getAllNoticeList();
//	}

	@Override
	public NoticeDTO selectNoticeDetail(int noticeId) {
		System.out.println("NoticeServiceImpl - 공지 상세");
		
		return noticemapper.selectNoticeDetail(noticeId);
	}

	@Override
	public void updateReadCount(int noticeId) {
		System.out.println("NoticeServiceImpl - 조회수 증가");
		
		noticemapper.updateReadCount(noticeId);
	}

	@Override
	public int insertNotice(NoticeDTO notice) {
		System.out.println("NoticeServiceImpl - 공지 등록");
		
		return noticemapper.insertNotice(notice);
	}

	@Override
	public int updateNotice(NoticeDTO notice) {
		System.out.println("NoticeServiceImpl - 공지 수정");
		
		return noticemapper.updateNotice(notice);
	}

	@Override
	public int deleteNotice(int noticeId) {
		System.out.println("NoticeServiceImpl - 공지 삭제");
		
		return noticemapper.deleteNotice(noticeId);
	}
	
//  ======================= 페이징 =======================

	@Override
	public int getAllCount() {
		return noticemapper.getAllCount();
	}

	@Override
	public List<NoticeDTO> getPageList(int startRow, int pageSize) {
		return noticemapper.getPageList(startRow, pageSize);
	}
}
