"use client"

import Header from "./Header";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function RootLayout({ children }) {
  const deliveryRef = useRef(null); 
  const [showPlane, setShowPlane] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (hasVisited) {
      gsap.set(deliveryRef.current, { y: 0, opacity: 1 });
      gsap.set(deliveryRef.current, {clearProps: "transform"});
      setShowPlane(false);
    } else {
      setShowPlane(true);
      gsap.set(deliveryRef.current, { y: -1050, opacity: 1 });

      gsap.to(deliveryRef.current, {
        y: 0,
        opacity: 1,
        duration: 2,
        ease: "power3.inOut",

        onComplete: () => {
          gsap.to(".plane", {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
              gsap.set(deliveryRef.current, {
                clearProps: "transform"
              });
              setShowPlane(false);
              localStorage.setItem("hasVisited", "true");
            }
          });
        }
      });
    }
  }, []);

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