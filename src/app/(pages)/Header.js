"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuPin, LuPinOff } from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import Login from "../comp/loginModal/Login";
import { signOut, useSession } from "next-auth/react";
import { authStore } from "../store/authStore";

export default function Header() {
  const {showLogin,setShowLogin, saveSession, deleteSession} = authStore();
  
  const [pinned, setPinned] = useState(true); // 고정 여부 상태
  const [isOpen, setIsOpen] = useState(false); 
  const pathname = usePathname();
  
  const [isLog, setIsLog] = useState(false);
  const { data: session } = useSession();
  
  // 로그인 팝업 열릴 때 스크롤 방지
    useEffect(() => {
      if (showLogin) {
        document.body.style = "overflow:hidden;";
      } else {
        document.body.style = "overflow:visible;";
      }
    }, [showLogin]);

  // sessionStorage에 로그인 데이터 저장하기
  useEffect(function () {
    if (session) {
      setIsLog(true)
      saveSession(session);
    }
    else {
      setIsLog(false)
      deleteSession()
    }
  }, [session]);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <>
      {
        !isLog ? (
          <header className={`menu-bar ${pinned ? "pinned" : "hover"}`}>
            <div className="menu">
              <div className="user">
                <div className="user-bnt">
                  <button className="userLink" onClick={() => setShowLogin()}>
                    로그인
                  </button>
                </div>
              </div>

              <nav>
                <button className="burger" onClick={() => setIsOpen(!isOpen)}>☰</button>

                <div className={`menu-list ${isOpen ? "active" : ""}`}>
                  <Link href="/planner" className={pathname === '/planner' ? 'active' : ''}>여행일정</Link>
                  <Link href="/attrantions" className={pathname === '/attrantions' ? 'active' : ''}>추천관광지</Link>
                  <Link href="/budget" className={pathname === '/budget' ? 'active' : ''}>여행경비</Link>
                  <Link href="/checkList" className={pathname === '/checkList' ? 'active' : ''}>체크리스트</Link>
                  <Link href="/gallery" className={pathname === '/gallery' ? 'active' : ''}>갤러리</Link>
                </div>
              </nav>
            </div>

            <span className={`icon ${pinned ? "active" : ""}`} onClick={() => setPinned(!pinned)}>
              {pinned ? <LuPin /> : <LuPinOff />}
            </span>
          </header>
        ) : (
          <header className={`menu-bar ${pinned ? "pinned" : "hover"}`}>
            <div className="menu">

              <div className="user">
                <span className="user-name">{session.user.name}</span>
                <span className="comment">님, 나만의 여행 지도를 그려볼까요?✨</span>

                <div className="user-bnt">
                  <Link href="/before">나의 기록</Link>ㅣ
                  <button className="logout" onClick={() => { signOut() }}>로그아웃</button>
                </div>
              </div>
              <nav>
                <button className="burger" onClick={() => setIsOpen(!isOpen)}>☰</button>

                <div className={`menu-list ${isOpen ? "active" : ""}`}>
                  <Link href="/planner" className={pathname === '/planner' ? 'active' : ''}>여행일정</Link>
                  <Link href="/attrantions" className={pathname === '/attrantions' ? 'active' : ''}>추천관광지</Link>
                  <Link href="/budget" className={pathname === '/budget' ? 'active' : ''}>여행경비</Link>
                  <Link href="/checkList" className={pathname === '/checkList' ? 'active' : ''}>체크리스트</Link>
                  <Link href="/gallery" className={pathname === '/gallery' ? 'active' : ''}>갤러리</Link>
                </div>
              </nav>
            </div>
            <span className={`icon ${pinned ? "active" : ""}`} onClick={() => setPinned(!pinned)}>
              {pinned ? <LuPin /> : <LuPinOff />}
            </span>
          </header>
        )
      }

      {
        showLogin && <Login setShowLogin={setShowLogin} setIsLog={setIsLog} showLogin={showLogin} />
      }
    </>
  );
}

