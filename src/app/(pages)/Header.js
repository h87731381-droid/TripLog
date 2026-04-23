"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuPin, LuPinOff } from "react-icons/lu";
import { usePathname } from "next/navigation";
import Login from "../comp/loginModal/Login";
import { signOut, useSession } from "next-auth/react";


export default function Header({ children }) {
  const [pinned, setPinned] = useState(false); // 고정 여부 상태
  const pathname = usePathname()

  const [showLogin, setShowLogin] = useState(false);
  const [isLog, setIsLog] = useState(false);


  const { data:session } = useSession();
  console.log(session)
  
  useEffect(function(){
    if (session) {
        setIsLog(true)
      //localStorage.setItem("session",JSON.stringify(session))
    }
    else{
      setIsLog(false)
    }
  },[session])
  

  // 로그인 팝업창 열릴 때 스크롤 방지
  useEffect(() => {
   

    if (showLogin) {
      document.body.style = "overflow:hidden;";
    } else {
      document.body.style = "overflow:visible;";
    }
  }, [showLogin]);

  return (
    <>

      {!isLog ? (
        <header className={`menu-bar ${pinned ? "pinned" : "hover"}`}>
          <div className="menu">
            <button className="userLink" onClick={() => setShowLogin(true)}>
              로그인
            </button>
            <nav>
              <Link href="/" className={pathname === '/pages' ? 'active' : ''}>여행일정</Link>
              <Link href="/attrantions" className={pathname === '/pages/attrantions' ? 'active' : ''}>추천관광지</Link>
              <Link href="/budget" className={pathname === '/pages/budget' ? 'active' : ''}>여행경비</Link>
              <Link href="/checkList" className={pathname === '/pages/checkList' ? 'active' : ''}>체크리스트</Link>
              <Link href="/gallery" className={pathname === '/pages/gallery' ? 'active' : ''}>갤러리</Link>
              <span className={`icon ${pinned ? "active" : ""}`} onClick={() => setPinned(!pinned)}>
                {pinned ? <LuPin /> : <LuPinOff />}
              </span>
            </nav>
          </div>
        </header>
      ) : (
        <header className={`menu-bar ${pinned ? "pinned" : "hover"}`}>
          <div className="menu">
            <div className="userHandle">
              <div className="userName">
                <span>{session.user.name}님! 다음여행까지 D-00일 남았어요</span>
              </div>
              <div className="userBtn">
                <button className="logout" onClick={()=>{signOut(); localStorage.removeItem('session')}}>
                  로그아웃
                </button>
                <button className="before">
                  지난여행
                </button>
              </div>
            </div>
            <nav>
              <Link href="/" className={pathname === '/pages' ? 'active' : ''}>여행일정</Link>
              <Link href="/attrantions" className={pathname === '/pages/attrantions' ? 'active' : ''}>추천관광지</Link>
              <Link href="/budget" className={pathname === '/pages/budget' ? 'active' : ''}>여행경비</Link>
              <Link href="/checkList" className={pathname === '/pages/checkList' ? 'active' : ''}>체크리스트</Link>
              <Link href="/gallery" className={pathname === '/pages/gallery' ? 'active' : ''}>갤러리</Link>
              <span className={`icon ${pinned ? "active" : ""}`} onClick={() => setPinned(!pinned)}>
                {pinned ? <LuPin /> : <LuPinOff />}
              </span>
            </nav>
          </div>
        </header>
      )}


      {
        showLogin && <Login setShowLogin={setShowLogin} setIsLog={setIsLog}/>
      }

    </>
  );
}

