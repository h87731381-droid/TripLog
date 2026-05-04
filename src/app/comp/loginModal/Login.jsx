"use client";

import React, { useEffect, useState } from 'react'
import { FiX } from "react-icons/fi";
import style from './login.module.scss'
import { useSession, signIn } from "next-auth/react"



/* 이현주 - 로그인 팝업 */





function Login({ setShowLogin, showLogin }) {

  const { data: session } = useSession();

  const [renderLogin, setRenderLogin] = useState(false);

  const openLogin = () => {
    setRenderLogin(true);
    setShowLogin(true);
  };

  const closeLogin = () => {
    setShowLogin(false);
    setTimeout(() => {
      setRenderLogin(false);
    }, 300); // CSS transition 시간과 맞추기
  };


  useEffect(() => {
      localStorage.setItem("pathname", window.location.pathname);
  }, []);

 
  return (
    <div className={style.back}>
      <div className={style.backColor}>
        <div className={`${style.loginAll} ${closeLogin ? style.open : style.close}`}>

          {showLogin &&
            <button className={style.X} onClick={() => setShowLogin(false)}>
              <FiX />
            </button>
          }

          <div className={style.loginBox}>
            <b>TRIPLOG</b>
            <div className={style.loginContent}>
              <div className={style.loginText}>
                <p>간편 로그인</p>
                <span>가입되어 있지 않아도 가입+로그인을 한번에!</span>
              </div>
              <div className={style.loginButtons}>
                <button className={style.naver} onClick={() => {
                  const destination = localStorage.getItem("pathname") || "/";
                  signIn('naver', { callbackUrl: destination });
                }}>
                  <img src="/imgs/attrantions/simple-icons_naver.svg" alt="" />
                  <span>Naver</span>
                </button>

                <button className={style.google} onClick={() => {
                  const destination = localStorage.getItem("pathname") || "/";
                  signIn('google', { callbackUrl: destination });
                }}>
                  <img src="/imgs/attrantions/material-icon-theme_google.svg" alt="" />
                  <span>Google</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}


export default Login