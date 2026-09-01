"use client";
import { useEffect } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Link from "next/link";     
import ImageCard from "@/components/imageCard";
import  Event  from "@/components/event";


export default function Home() {
    useEffect(() => {
        fetch("http://localhost:4000/events")
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
          });
      }, []);

  return (
    <>
      <Header/>

    <section className="events-section">
      <h1>Volunteer Opportunities</h1>

  <div className="events-grid">

        <Event/>
  </div>
   </section>

      <Footer/>
    </>
  );
}