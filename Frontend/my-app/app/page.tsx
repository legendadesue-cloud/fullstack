"use client";
import { useEffect } from "react";
import Link from "next/link";     
import ImageCard from "@/components/imageCard";
//import Popup from "@/components/popup";

export default function Home() {
  
   useEffect(() => {
    fetch("http://localhost:4000/")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }, []);


  return (
    <>
      <section className="login-section">
        <div className="login-dashboard">
          <h1>ARMSLENGTH</h1>
          <button className="login-button">
            <Link href="/loginvolunteer">volunteer</Link>
          </button>
          <button className="login-button">
            <Link href="/loginadmin">Administrator</Link>
          </button>
        </div>
      </section>
          </>
  );}