"use client";
import { useEffect } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
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
            Our platform is designed to help you discover events organized by
            NGOs that match your skills, interests, and career goals. Whether
            the opportunities are paid or voluntary, we make it easy to find
            the right event for you.

            <p>
              We believe every event is an opportunity to showcase your talents,
              gain valuable real-world experience, expand your professional
              network, and make a meaningful impact. By participating, you not
              only contribute to important causes but also increase your chances
              of being recognized and contacted for future opportunities.
            </p>

            <p>
              Join a community where your skills meet purpose, and let every
              event become a stepping stone toward your personal and
              professional growth.
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

          <Link href="/volunteerprofile">
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