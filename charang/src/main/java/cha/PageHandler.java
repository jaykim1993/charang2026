package cha;

public class PageHandler {
//	1. 기본 변수
	private int totalCnt; // 전체 게시글 개수
	private int pageNum; // 현재 페이지 번호
	private int pageSize; // 한 페이지에 보여줄 레코드(= 행) 개수
	private int pageBlock = 3;  // 한 화면의 페이지 묶음 (1~3)
	
//	2. DB 조회용 변수
	private int startRow; // DB 시작위치
//	┖> 예) Limit 1(startRow), 5(pageSize) : 1부터 시작해서 5개만 출력
	private int endRow; // 가져올 게시글 개수 = pageSize 
	
//	3. pageBlock 부분 : [1][2][3]▶  ◀[4][5][6]
	private int totalPage;  // 전체 페이지 수 : 6
	private int startPage; // 블록 페이지의 시작 번호 : [1]
	private int endPage; // 블록페이지의 마지막 번호 : [6]
	
	private boolean prev;  // 이전 버튼 : ◀
	private boolean next;  // 다음 버튼 : ▶
	
//	생성자
	public PageHandler(int totalCnt, int pageNum, int pageSize) {
		this.totalCnt = totalCnt;
		this.pageNum = pageNum;
		this.pageSize = pageSize;
		
//		계산함수 호출
		calcPaging();
	}
	
//	페이지 계산 함수
	public void calcPaging() {
//		전체 페이지 수 : totlaPage
//		[1][2][3]▶  ◀[4][5][6]
//		게시글의 개수 계속 증가/감소
//		예) 한 페이지에 5개, 게시글 11개 일 경우 - 블록 3개 필요
//		나누었을 때 소수자리수까지 반올림이 되어야 페이지 정상 생성됨
//		Math.ceil : 소수점을 무조건 반올림하여 정수 출력
		totalPage = (int)Math.ceil(totalCnt / (double)pageSize);
//		예) 11/5 = 2.2 <- int 사용할 경우 2가 되므로 double 로 형변환
		
//		DB 에서 조회하는 범위
//		1페이지 - 0부터 5 개 : 0 ~ 4
//		2페이지 - 5부터 5개 : 5 ~ 9
//		3페이지 - 10부터 5개 : 10 ~ 14
//		배열에 들어가니까 인덱스번호 0 으로 시작하는거임!
//		예) pageNum = 1 일 때 현재 페이지 번호 : (1-1) * 1 = 0
//		 0	 5	9
//		 1	 6	10
//		 2	 7	11
//		 3	 8	12
//		 4	 9	13
//		[1]	[2]	[3] ▶
		startRow = (pageNum - 1) * pageSize;
		endRow = pageSize;
		
//		페이지 시작/끝
//		[1][2][3]▶  ◀[4][5][6]
//		pageNum 이 1, 2, 3 일 때 모두 startPage = 1 이어야함
//		예) pageNum = 1 ~, pageBlock = 3
//		1 - 1 = 0 -> int(0 / 3) = 0 -> 0 * 3 = 0 -> 0 + 1 = 1
//		2 - 1 = 1 -> int(1 / 3) = 0 -> 0 * 3 = 0 -> 0 + 1 = 1
//		3 - 1 = 2 -> int(2 / 3) = 0 -> 0 * 3 = 0 -> 0 + 1 = 1
//		4 - 1 = 3 -> int(3 / 3) = 1 -> 1 * 3 = 3 -> 3 + 1 = 4
		startPage = ((pageNum - 1) / pageBlock) * pageBlock + 1;
		// [1][2][3] => 끝펭지는 3 
		endPage = startPage + (pageBlock - 1); // 1+(5-1) => 5, 6+(5-1) => 10
		// pageBlock = 5; => [1][2][3][4][5], [6][7][8][9][10]
		//endPage = startPage + 2; // 1+2 =>3 , 4+2=>6
		
//		만약 실제 페이지는 [1] ~ [8] : totalPage 까지 출력되어야 한다면
//		위의 계산식만으로는 [1] ~ [9] 까지 무조건 출력된다.
//		이런 경우 가장 마지막 페이지를 강제로 endPage에 total 페이지를 담는다.
		// 레코드 25 => totalPge= 5 , [1][2][3], [4][5][6]
		if(endPage > totalPage) {
			endPage = totalPage; // => endPage = 5
		}
		
//		이전 버튼 : ◀ / 다음 버튼 : ▶
//		버튼의 여부를 묻기
//		이전 게시글이 존재하면 이전 ◀ 생성
		prev = startPage > 1;  // prev = startPage 가 1보다 크면 true : 버튼 생김
//		다음 게시글이 존재하면 다음 ▶ 생성
		next = endPage < totalPage;
//		예) endPage = 8, totalPage = 8 일 때 false : 버튼 안생김
//		┖> 3 < 5 = true / 3 > 5 = false
	}

	public int getTotalCnt() {
		return totalCnt;
	}

	public void setTotalCnt(int totalCnt) {
		this.totalCnt = totalCnt;
	}

	public int getPageNum() {
		return pageNum;
	}

	public void setPageNum(int pageNum) {
		this.pageNum = pageNum;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public int getPageBlock() {
		return pageBlock;
	}

	public void setPageBlock(int pageBlock) {
		this.pageBlock = pageBlock;
	}

	public int getStartRow() {
		return startRow;
	}

	public void setStartRow(int startRow) {
		this.startRow = startRow;
	}

	public int getEndRow() {
		return endRow;
	}

	public void setEndRow(int endRow) {
		this.endRow = endRow;
	}

	public int getTotalPage() {
		return totalPage;
	}

	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}

	public int getStartPage() {
		return startPage;
	}

	public void setStartPage(int startPage) {
		this.startPage = startPage;
	}

	public int getEndPage() {
		return endPage;
	}

	public void setEndPage(int endPage) {
		this.endPage = endPage;
	}

	public boolean isPrev() {
		return prev;
	}

	public void setPrev(boolean prev) {
		this.prev = prev;
	}

	public boolean isNext() {
		return next;
	}

	public void setNext(boolean next) {
		this.next = next;
	}
}
