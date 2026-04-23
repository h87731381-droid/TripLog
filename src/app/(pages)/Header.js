"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuPin, LuPinOff } from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const TEMP_USER_ID = "temp-user-123"; // 로그인 테스트 

  const [pinned, setPinned] = useState(false); // 고정 여부 상태
  const pathname = usePathname()
  const router = useRouter();


  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // 로그인테스트
        const logoutMark = localStorage.getItem("로그아웃");
        if (!logoutMark && TEMP_USER_ID) {
          setUser({ id: TEMP_USER_ID, name: "여행자" });
        }

        /* 로그인작업 완료 후 ㄱ
        const res = await fetch("/api/auth/ㅇㅇ"); // 정보호출 api
        if (res.ok) {
          const data = await res.json();
          setUser(data); 
        }
        */
      } 
      catch (error) { console.error("로그인 체크 실패:", error); } 
      finally { setLoading(false); }
    };
    checkLoginStatus();
  }, []);

  // 로그아웃 테스트
  const handleLogout = () => { 
    localStorage.setItem("로그아웃", "true");    
    setUser(null); 
    router.push("/"); 
  };
  const handleLogin = () => {
    localStorage.removeItem("로그아웃"); 
    setUser({ id: TEMP_USER_ID, name: "여행자" });
  };

  /* 로그인작업 완료 후 ㄱ
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null); 
        router.push("/"); 
      }
    } 
    catch (error) { alert("로그아웃 실패"); }
  };
  */

  if (loading) return null;

  return (
    <header className={`menu-bar ${pinned ? "pinned" : "hover"}`}>
        <div className="menu">
          {user ? (
            <div className="user">
              <span className="user-name">{user.name}</span>
              <span className="comment">님, 나만의 여행 지도를 그려볼까요?✨</span>

              <div className="user-bnt">
                <Link href="/pages/before">나의 기록</Link>ㅣ
                <button className="logout" onClick={handleLogout}>로그아웃</button>
              </div>
            </div>
          ) : (
            //<Link href="/login" className="login">로그인</Link>
            <button className="login" onClick={handleLogin} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            로그인
            </button>
          )}
          <nav>
            <button className="burger">☰</button>
            
            <div className="menu-list">
              <Link href="/pages" className={pathname === '/pages' ? 'active' : ''}>여행일정</Link>
              <Link href="/pages/attrantions" className={pathname === '/pages/attrantions' ? 'active' : ''}>추천관광지</Link>
              <Link href="/pages/budget" className={pathname === '/pages/budget' ? 'active' : ''}>여행경비</Link>
              <Link href="/pages/checkList" className={pathname === '/pages/checkList' ? 'active' : ''}>체크리스트</Link>
              <Link href="/pages/gallery" className={pathname === '/pages/gallery' ? 'active' : ''}>갤러리</Link>
            </div>
          </nav>
        </div>
        <span className={`icon ${pinned ? "active" : ""}`} onClick={() => setPinned(!pinned)}>
        {pinned ? <LuPin /> : <LuPinOff />}
        </span>
    </header>
  );
}

