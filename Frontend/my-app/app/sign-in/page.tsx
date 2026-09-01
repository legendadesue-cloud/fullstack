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
      <section className="signin-section">
        <div className="signin-dashboard">
          <h1>ARMSLENGTH</h1>
          
          <fieldset>
            <legend>Signin details</legend>

            <div className="form-group">
              <label htmlFor="FullName">NAME</label>
              <input
                type="text"
                id="FullName"
                name="FullName"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="UUID">password</label>
              <input
                type="text"
                id="UUID"
                name="UUID"
                required
              />
            </div>
          </fieldset>

          <button className="login-button">
            <Link href="/volunteerdashboard">Login as Volunteer</Link>
          </button>
          <button className="login-button">
            <Link href="/profile">Don't have an account? Get one now </Link>
          </button>
        </div>
      </section>
          </>
  );
}