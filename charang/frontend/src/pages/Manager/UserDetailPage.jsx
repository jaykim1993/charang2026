import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/Authcontext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import './UserDetailPage.css';

export default function UserDetailPage(){

    const navigate = useNavigate();

    // params로 userId값 들고 넘어옴
    const {userId} = useParams();

    // 해당 userId 정보 담을 상태변수
    const [oneUser, setOneUser] = useState({});

    // 해당 userId 정보 불러오기
    useEffect(()=>{
        console.log("현재 useParams로 가져온 userId: ", userId);
        axios.get("/api/userinfo/"+userId)
        .then((res)=>{
            console.log("해당 id 데이터: ",res.data);
            setOneUser(res.data);
        })
        .catch((error)=>{
            console.log("해당 id 데이터 오류: ", error);
        })
    },[]);


   return (
        <div className="userMod">
            <div className="userMod_container">
                <div className="userMod_header">
                    <h2 className="userMod_title">회원 상세 정보</h2>
                    <div className="userMod_btnBox">
                        <button type="button" className="userMod_listBtn" onClick={() => navigate(-1)}>전체목록</button>
                    </div>
                </div>

                <table className="userMod_table">
                    <tbody className="userMod_table_body">
                        <tr className="userMod_tr">
                            <td className="userMod_td">회원아이디</td>
                            <th className="userMod_data">{oneUser.userId}</th>
                        </tr>
                        <tr className="userMod_tr">
                            <td className="userMod_td">회원이름</td>
                            <th className="userMod_data">{oneUser.name}</th>
                        </tr>
                        <tr className="userMod_tr">
                            <td className="userMod_td">휴대폰번호</td>
                            <th className="userMod_data">{oneUser.phone}</th>
                        </tr>
                        <tr className="userMod_tr">
                            <td className="userMod_td">이메일</td>
                            <th className="userMod_data">{oneUser.mail}</th>
                        </tr>
                        <tr className="userMod_tr">
                            <td className="userMod_td">주소</td>
                            <th className="userMod_data">{oneUser.address}</th>
                        </tr>
                        <tr className="userMod_tr">
                            <td className="userMod_td">상세주소</td>
                            <th className="userMod_data">{oneUser.addressDetail}</th>
                        </tr>
                        <tr className="userMod_tr">
                            <td className="userMod_td">면허종류</td>
                            <th className="userMod_data">{oneUser.license}</th>
                        </tr>
                        <tr className="userMod_tr">
                            <td className="userMod_td">면허번호</td>
                            <th className="userMod_data">{oneUser.licenseNum}</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}