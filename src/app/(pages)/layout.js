"use client"

import Header from "./Header";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { authStore } from "../store/authStore";
import { tripStore } from "../store/tripStore";
import dayjs, { Dayjs } from 'dayjs'

export default function RootLayout({ children }) {
  const deliveryRef = useRef(null); 
  const [showPlane, setShowPlane] = useState(false);
  const { session } = authStore();
  const { setTripData } = tripStore();//zustand 스토어 관리

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (hasVisited) {
      gsap.set(deliveryRef.current, { y: 0, opacity: 1 });
      gsap.set(deliveryRef.current, { clearProps:'transform' });
      setShowPlane(false);
    } else {
      setShowPlane(true);
      gsap.set(deliveryRef.current, { y: -1050, opacity: 1 });

      gsap.to(deliveryRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power3.inOut",

        onComplete: () => {
          gsap.to(".plane", {
            opacity: 0,
            duration: 2,
            ease: "power2.in",
            onComplete: () => {
              gsap.set(deliveryRef.current, { clearProps:'transform' });
              setShowPlane(false);
              localStorage.setItem("hasVisited", "true");
            }
          });
        }
      });
    }
  }, []);


  useEffect(() => {
    const fetchDraft = async () => {
      const res = await fetch(`/api/planner?type=draft&session=${session.user?.email}`);
      console.log("status:", res.status); 
      const data = await res.json();

      if (data) {
        setTripData({// DB 기준으로 화면 분기
          ...data,
          start:dayjs(data.start),
          end:dayjs(data.end),
        }); 
      }
    };
    if(session?.user?.email) fetchDraft();
  }, [session]);

  return (  
    <div className="main">
      <Header />

      <div ref={deliveryRef} className="delivery-wrapper">
        <h1 className="logo" >TRIPLOG</h1>
        <main className="container">
          {children}
        </main>

        {showPlane && (
          <div className="plane">
            <img src="/imgs/splash/plane.svg" alt="plane" />
          </div>
        )}

      </div>
    </div>
     
  );
}