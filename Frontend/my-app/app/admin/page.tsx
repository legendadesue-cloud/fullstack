"use client";
import { useEffect } from "react";
import Footer from "@/components/footer";
import Header from "@/components/secondheader";
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
      <Header/>
      <section className="dashboard">
        <div className="volunteer-dashboard">
          <h1>Welcome to ARMSLENGTH</h1>

          <article>
            Our administrator platform is designed to help you manage and oversee the activities of NGOs,
             volunteers, events, and opportunities on the platform.
              As an administrator, you can verify organizations, manage users, monitor events, review applications,
               and ensure that all information provided is accurate and appropriate.
               The platform gives you the tools needed to keep the system organized,
               secure, and effective for both volunteers and organizations.

            <p>
              We believe every organization, volunteer, and event contributes to building a stronger and more connected community.
              By effectively managing the platform, administrators help ensure that opportunities are trustworthy,
              organizations are properly represented, and volunteers can safely discover meaningful experiences.
              Your role helps create a reliable environment where organizations can grow,
              volunteers can contribute, and impactful projects can reach the people who need them most.

            </p>

            <p>
              Join a community where organizations, volunteers, and opportunities come together to create meaningful change.
              As an administrator, help build a trusted platform where every opportunity is managed effectively,
              every organization can make an impact,
              and every volunteer has the chance to contribute to a better community.
            </p>
          </article>
        </div>

        <section className="top-right-dashboard">
          <div className="icons">
            <img
              src="/images/icons8-notification-50.png"
            />

            <div>
              <Link href="/bookmark">
                <img
                  src="/images/icons8-add-bookmark-48.png"
                  width={50}
                  height={50}
                />
                <span id="bookmark-count">
                  0
                  </span>
              </Link>
            </div>

          <Link href="/profile">
                <img
                  src="/images/icons8-test-account-50.png"
                  alt="Profile"
                />
              </Link>
          

            <img
              src="/images/icons8-timeline-50.png"
            />
          </div>
        </section>

        <section className="upcomingEvents" id="Events">
          <h2>Events</h2>

          <div className="gallery-grid">
            <div className="card">
              <ImageCard src="/images/COMMUNITY EME.jpg" alt="Awareness Outreach" />
            <h3>Awareness Outreach</h3>
            </div>

            <div className="card">
              <ImageCard src="/images/This past Saturday, we had the honour of joining….jpg" alt="Medical Assistant" />
              <h3>Medical Assistant</h3>
            </div>

            <div className="card">
              <ImageCard src="/images/Education for All.jpg" alt="Educational Outreach" />
              <h3>Educational Outreach</h3>
            </div>

            <div className="card">
              <ImageCard src="/images/save Africans lives.jpg" alt="Stop Hunger Campaign" />
              <h3>Stop Hunger Campaign</h3>
            </div>
          </div>
        </section>
      </section>
      <Footer/>
    </>
  );
}