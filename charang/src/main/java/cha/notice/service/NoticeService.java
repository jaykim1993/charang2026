package cha.notice.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import cha.notice.dto.NoticeDTO;

public interface NoticeService {
//	공지 목록
//	public List<NoticeDTO> getAllNoticeList();
	
//	공지 상세
	public NoticeDTO selectNoticeDetail(int noticeId);
	
//	조회수 증가
	public void updateReadCount(int noticeId);
	
//	글 등록
	public int insertNotice(NoticeDTO notice);
	
//	공지 수정
    public int updateNotice(NoticeDTO notice);
	
//	공지 삭제
    public int deleteNotice(int noticeId);
    
//  ======================= 페이징 =======================

//	전체 공지 개수
	public int getAllCount();

//	공지 전체 목록
	public List<NoticeDTO> getPageList(@Param("startRow") int startRow, @Param("pageSize") int pageSize);
}
