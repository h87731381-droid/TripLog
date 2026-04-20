"use client"
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";



export default function Home() {
  const router = useRouter();
  setTimeout(function(){ router.push('/pages'); },0)

  return (
    <h2>
      Splash Screen
    </h2>
  );
}
