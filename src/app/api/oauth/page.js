"use client"
import React from 'react'
import KakaoLogin from 'react-kakao-login'

function oauth() {
    const token = "9bba60168cef9ce618fd22bf6c08c01d";
    
    const handileSuccess = async (result) => {
      const accessToken = result.response.access_token;

      const res = await fetch("/api/kakao", {
        method: "POST",
        headers: {
          "Content-Type": "appilcation/json",
        },
        body: JSON.stringify({accessToken}),
      });
      const data = await res.json();

      console.log(data);
    };

  return (
    <KakaoLogin
        token={token}
        onSuccess={handileSuccess}
        onFail={console.error}
        onLogout={console.info}
        useLoginForm
    />
  )
}

export default oauth