"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap"; // 배경모듈

const summary_data = [
  { id: 0, text: "지도 위 최적 동선 설계", img: "/imgs/splash/pad_check.png" },
  { id: 1, text: "어디 갈지 고민될 땐 추천 리스트", img: "/imgs/splash/pad_att.png" },
  { id: 2, text: "클릭 한 번으로 끝내는 정산", img: "/imgs/splash/pad_budget.png" },
  { id: 3, text: "체크리스트로 꼼꼼하게", img: "/imgs/splash/pad_check.png" },
  { id: 4, text: "나만의 포토로그", img: "/imgs/splash/pad_gallery.png" },
];

export default function Home() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(-1); 
  const [isExiting, setIsExiting] = useState(false); // 박스
  const [isReady, setIsReady] = useState(false);
  const bgRef = useRef(null); // 배경

  // 방문기록 체크
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (hasVisited) {
      router.push('/planner'); 
    } else {
      setIsReady(true); 
    }
  }, [router]);

  // 리스트 제어
  useEffect(() => {
    if (!isReady) return;

    let interval;

    const start = setTimeout(() => { 
      setActiveIndex(0); 

      interval = setInterval(() => {
        setActiveIndex((prev) => {
          if(prev < summary_data.length - 1) return prev + 1;
          clearInterval(interval); 
          return prev;
        });
      }, 1000); 
    }, 1500);

    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [isReady]);
  
  // 박스/배경 제어 및 페이지 전환 
  useEffect(() => {
    if (!isReady) return;

    let moveTimer;

    if(activeIndex === summary_data.length - 1) {
      const allTimer = setTimeout(() => {
        setIsExiting(true); // 박스

        if(bgRef.current) {
          gsap.to(bgRef.current, {
            duration: 1.3,
            "--angle": "360deg", 
            ease: "power2.inOut",
          });
        } // gsap 모듈 
        
        moveTimer = setTimeout(() => {
          router.push('/planner');
        }, 1300); 
      }, 500);

      return () => {
        clearTimeout(allTimer);
        if (moveTimer) clearTimeout(moveTimer); 
      };
    }
  }, [activeIndex, router, isReady]);

  if (!isReady) return null;

  return (
    <section className="splash-bg">
      <div ref={bgRef} className="bg-overlay"></div>      
      <div className={`splash ${isExiting ? 'exit' : ''}`}>

        <div className="s-text">

          <div className="s-title">
            <p>지도로 한눈에 보는 나만의 완벽한 동선</p>
            <h1>TripLog</h1>
          </div>

          <div className="summary">
            <ul className="s-list">
              {summary_data.map((item, index) => (
                <li key={item.id}
                    className={`
                      ${activeIndex === index ? 'active' : ''} 
                      ${(index < activeIndex && activeIndex !== -1) ? 'passed' : ''} 
                      ${activeIndex === summary_data.length - 1 ? 'finished' : ''}
                    `}
                >
                  <img src={(activeIndex >= index && activeIndex !== -1) ? 
                    "/imgs/splash/check-1.svg" : "/imgs/splash/check-0.svg"} 
                    alt="check" 
                  />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="s-img">
          {summary_data.map((item, index) => (
            <img 
              key={item.id}
              src={item.img} 
              alt="ipad-screen" 
              className={(activeIndex === index || (activeIndex === -1 && index === 0)) ? 'show' : ''}  
            />
          ))}
          </div>
      </div>
    </section>
  );
}