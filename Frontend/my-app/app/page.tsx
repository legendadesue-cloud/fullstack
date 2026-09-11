"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  useEffect(() => {
    fetch("http://localhost:4000/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        console.log("Backend response:", data);
      })
      .catch((error) => {
        console.error("Backend connection error:", error);
      });
  }, []);

  return (
    <>
      <section className="login-section">
        <div className="login-dashboard">
          <h1>ARMSLENGTH</h1>

          <button type="button" className="login-button">
            <Link href="/loginvolunteer">
              Volunteer
            </Link>
          </button>

          <button type="button" className="login-button">
            <Link href="/loginadmin">
              Administrator
            </Link>
          </button>
        </div>
      </section>
    </>
  );
}