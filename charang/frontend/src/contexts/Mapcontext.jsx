
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// MapContainer = 맵을 불러오는 상자 
// TileLayer 하단 설명 참고
// Marker 마커 좌표 설정시 마커 생성
// Popup 마커 클릭시 텍스트 출력
import 'leaflet/dist/leaflet.css';

export default function MyMap() {
  // 여러 좌표를 배열로 관리  각 데이터에있는 주소 위도,경도 검색 후 삽입
  const positions = [
    {id:1, lat: 37.446842, lng: 126.454047, name: "인천공항점" },
    {id:2, lat: 37.56517, lng: 126.803013, name: "김포공항점" },
    {id:3, lat: 37.570097, lng: 127.064886, name: "서울동부점" },
    {id:4, lat: 37.493788, lng: 127.012596, name: "서울남부점" },
    {id:5, lat: 37.653579, lng: 127.058793, name: "서울북부점" },
  ];
  return (
    <MapContainer center={[37.56517, 126.773023]} zoom={10} style={{ height: "600px", width: "600px" }}> 
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />
      {/* positions 배열을 map으로 돌면서 여러 Marker 렌더링 */}
      {positions.map((spot) => (
        <Marker key={spot.id} position={[spot.lat, spot.lng]}>
          <Popup>{spot.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
// TileLayer
// 지도는 실제로 하나의 큰 이미지가 아니라 작은 사각형 이미지 타일(Tile)들을 이어 붙여서 보여주는 구조임.
// Leaflet에서 TileLayer 컴포넌트를 사용하면 이런 타일 이미지들을 불러와 화면에 지도처럼 렌더링함

// center={[위도,경도]}
// 이 위도경도가 처음에 맵이 출력되는 맵의 초기값이됨. 마킹과는 별개로 맵을 뿌리는 시작 화면의 위치를 잡음.
// 현재 세팅값은 김포공항에서 살짝 조정해서 줌레벨 10일때 전체 지점을 보여줄 수 있는 좌표로 설정해뒀음.

// Leaflet이 자동으로 현재 화면과 줌 레벨에 맞는 타일 이미지를 {x},{y},{z} 좌표로 요청
// z는 줌레벨, x좌표 y좌표 로 변환되어 요청
// minZoom은 축소 최대값 제한 걸어둔거 

// -------------------------------------
// .leaflet-control-zoom 의 클래스명을 css 에서 만지면
// 확대/축소 버튼의 위치 수정 가능 /버튼의 색이나 다른건 잘 안됨 안찾아봄
//  ex).leaflet-control-zoom {
//  top: 10px;  /* 위쪽 여백 */
//  left: 530px; /* 오른쪽 여백 */
//  background-color: rgba(255, 255, 255, 0.8); /* 배경색 투명도 조절 */
//  border-radius: 8px; /* 둥근 테두리 */
// }