"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react"; 

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(function(){ router.push('/pages'); }, 2000); 
    return () => clearTimeout(timer);
  }, [router]); // router가 준비되면 한 번 실행

  return (
    <h2>
      Splash Screen
    </h2>
  );
}