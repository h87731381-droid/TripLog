"use client";

import Link from "next/link";
import { useState } from "react";
import { LuPin, LuPinOff } from "react-icons/lu";
import { usePathname } from "next/navigation";

export default function Header({ children }) {
  const [pinned, setPinned] = useState(false); // 고정 여부 상태
  const pathname = usePathname()

  return (
    <header className={`menu-bar ${pinned ? "pinned" : "hover"}`}>
        <div className="menu">
            <Link href="/login" className="user-link">로그인</Link>
            <nav>
                <Link href="/pages" className={pathname === '/pages' ? 'active' : ''}>여행일정</Link>
                <Link href="/pages/attrantions" className={pathname === '/pages/attrantions' ? 'active' : ''}>추천관광지</Link>
                <Link href="/pages/budget" className={pathname === '/pages/budget' ? 'active' : ''}>여행경비</Link>
                <Link href="/pages/checkList" className={pathname === '/pages/checkList' ? 'active' : ''}>체크리스트</Link>
                <Link href="/pages/gallery" className={pathname === '/pages/gallery_main' ? 'active' : ''}>갤러리</Link>
                <span className={`icon ${pinned ? "active" : ""}`} onClick={() => setPinned(!pinned)}>
                {pinned ? <LuPin /> : <LuPinOff />}
                </span>
            </nav>
        </div>
    </header>
  );
}

