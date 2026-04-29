"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuPin, LuPinOff } from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import Login from "../comp/loginModal/Login";
import { signOut, useSession } from "next-auth/react";

export default function Header() {

  const [pinned, setPinned] = useState(false); // 고정 여부 상태
  const pathname = usePathname();
  const [showLogin, setShowLogin] = useState(false);
  const [isLog, setIsLog] = useState(false);
  const { data: session } = useSession();
  console.log(session)


  useEffect(function () {
    if (session) {
      setIsLog(true)
      sessionStorage.setItem("session",JSON.stringify(session))
    }
    else {
      setIsLog(false)
      sessionStorage.removeItem("session")
    }
  }, [session])


  return (
    <>
      {
        !isLog ? (
          <header className={`menu-bar ${pinned ? "pinned" : "hover"}`}>
            <div className="menu">
              <div className="user">
                <div className="user-bnt">
                  <button className="userLink" onClick={() => setShowLogin(true)}>
                    로그인
                  </button>
                </div>
              </div>

              <nav>
                <button className="burger">☰</button>

                <div className="menu-list">
                  <Link href="/planner" className={pathname === '/planner' ? 'active' : ''}>여행일정</Link>
                  <Link href="/attrantions" className={pathname === '/attrantions' ? 'active' : ''}>추천관광지</Link>
                  <Link href="/budget" className={pathname === '/budget' ? 'active' : ''}>여행경비</Link>
                  <Link href="/checkList" className={pathname === '/checkList' ? 'active' : ''}>체크리스트</Link>
                  <Link href="/gallery_main" className={pathname === '/gallery' ? 'active' : ''}>갤러리</Link>
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
                <button className="burger">☰</button>

                <div className="menu-list">
                  <Link href="/planner" className={pathname === '/planner' ? 'active' : ''}>여행일정</Link>
                  <Link href="/attrantions" className={pathname === '/attrantions' ? 'active' : ''}>추천관광지</Link>
                  <Link href="/budget" className={pathname === '/budget' ? 'active' : ''}>여행경비</Link>
                  <Link href="/checkList" className={pathname === '/checkList' ? 'active' : ''}>체크리스트</Link>
                  <Link href="/gallery_main" className={pathname === '/gallery' ? 'active' : ''}>갤러리</Link>
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
        showLogin && <Login setShowLogin={setShowLogin} setIsLog={setIsLog} />
      }
    </>
  );
}

