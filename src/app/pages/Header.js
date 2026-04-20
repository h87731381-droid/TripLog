"use client";

import { useState } from "react";
import { LuPin, LuPinOff } from "react-icons/lu";
import Link from "next/link";

export default function Header({ children }) {
  const [pinned, setPinned] = useState(false); // 고정 여부 상태

  return (
    <header className={`menu-bar ${pinned ? "pinned" : "hover"}`}>
        <div className="menu">
            <Link href="/login" className="user-link">로그인</Link>
            <nav>
                <Link href="/">여행일정</Link>
                <Link href="/">추천관광지</Link>
                <Link href="/">여행경비</Link>
                <Link href="/">체크리스트</Link>
                <Link href="/">갤러리</Link>
                <span className={`icon ${pinned ? "active" : ""}`} onClick={() => setPinned(!pinned)}>
                {pinned ? <LuPin /> : <LuPinOff />}
                </span>
            </nav>
        </div>
    </header>
  );
}

