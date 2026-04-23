"use client";

import React, { useEffect, useState } from 'react'
import { FiX } from "react-icons/fi";
import style from './login.module.scss'
import { useSession, signIn, signOut } from "next-auth/react"

function Login({setShowLogin,showLogin,setIsLog}) {

  const { data:session } = useSession();
 
  /* if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
 */
  return (
    <div className={style.back}>
      <div className={style.backColor}>
        <div className={style.loginAll}>

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
                <button className={style.kakao} onClick={() => signIn('kakao')}>
                  <img src="/imgs/attrantions/ri_kakao-talk-fill.svg" alt="" />
                  <span>Kakao</span>
                </button>
                <button className={style.google} onClick={() => signIn('google')}>
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