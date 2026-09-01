"use client";

import Header from "@/components/header"
import Footer from "@/components/footer";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Header />

      <main className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <span className="about-label">ABOUT US</span>

            <h1>
              Connecting People.
              <br />
              <span>Creating Impact.</span>
            </h1>

            <p>
              We connect passionate volunteers with meaningful opportunities,
              organizations, and events that create positive change in
              communities.
            </p>

            <div className="about-hero-buttons">
              <Link href="/volunteer" className="primary-btn">
                Become a Volunteer
              </Link>

              <Link href="/events" className="secondary-btn">
                Explore Events
              </Link>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="about-section who-we-are">
          <div className="about-image">
            <div className="image-placeholder">
            
              <p>Building stronger communities together</p>
            </div>
          </div>

          <div className="about-text">
            <span className="section-label">WHO WE ARE</span>

            <h2>Making Volunteering Easier and More Meaningful</h2>

            <p>
              Our platform was created to make it easier for people to discover
              volunteer opportunities and connect with organizations that are
              working to make a difference.
            </p>

            <p>
              Whether you are looking to volunteer your time, develop new
              skills, meet people, or support a meaningful cause, we help you
              find opportunities that match your interests.
            </p>

            <p>
              At the same time, organizations can use our platform to promote
              events, find volunteers, and build stronger communities.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mission-section">
          <div className="mission-card">
            <div className="mission-icon"></div>

            <span className="section-label">OUR MISSION</span>

            <h2>Empowering People to Make a Difference</h2>

            <p>
              Our mission is to connect individuals with opportunities where
              their time, skills, and passion can create meaningful social
              impact.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon"></div>

            <span className="section-label">OUR VISION</span>

            <h2>A Community Where Everyone Can Contribute</h2>

            <p>
              We envision a world where everyone has access to opportunities
              that allow them to contribute, grow, and help build stronger
              communities.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="what-we-do">
          <div className="section-heading">
            <span className="section-label">WHAT WE DO</span>

            <h2>Bringing Volunteers and Organizations Together</h2>

            <p>
              We provide the tools and opportunities needed to turn
              willingness into real-world impact.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Volunteer Opportunities</h3>
              <p>
                Discover volunteer opportunities that match your interests,
                skills, and goals.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Community Events</h3>
              <p>
                Find and participate in events, campaigns, and projects that
                create positive change.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Organizations</h3>
              <p>
                Connect with organizations and discover the causes they are
                working to support.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Skills & Growth</h3>
              <p>
                Gain valuable experience, develop new skills, and grow through
                meaningful volunteer experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Statistics */}
        <section className="impact-section">
          <div className="section-heading light">
            <span className="section-label">OUR IMPACT</span>

            <h2>Small Actions Can Create Big Change</h2>

            <p>
              Every volunteer, organization, and event contributes to a
              stronger community.
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat">
              <h3>1,000+</h3>
              <p>Volunteers</p>
            </div>

            <div className="stat">
              <h3>100+</h3>
              <p>Organizations</p>
            </div>

            <div className="stat">
              <h3>250+</h3>
              <p>Events</p>
            </div>

            <div className="stat">
              <h3>50+</h3>
              <p>Communities Reached</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-section">
          <div className="section-heading">
            <span className="section-label">HOW IT WORKS</span>

            <h2>From Interest to Impact</h2>

            <p>
              Getting involved is simple. Find an opportunity and start making
              a difference.
            </p>
          </div>

          <div className="steps">
            <div className="step">
              <span className="step-number">01</span>
              <h3>Discover</h3>
              <p>
                Browse volunteer opportunities, events, and organizations.
              </p>
            </div>

            <div className="step">
              <span className="step-number">02</span>
              <h3>Connect</h3>
              <p>
                Find an opportunity that matches your interests and skills.
              </p>
            </div>

            <div className="step">
              <span className="step-number">03</span>
              <h3>Participate</h3>
              <p>
                Register for an event and contribute your time and skills.
              </p>
            </div>

            <div className="step">
              <span className="step-number">04</span>
              <h3>Make an Impact</h3>
              <p>
                Help create positive change and strengthen your community.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <div>
            <span className="section-label">GET INVOLVED</span>

            <h2>Ready to Make a Difference?</h2>

            <p>
              Your time, skills, and passion can help create meaningful change.
            </p>

            <div className="cta-buttons">
              <Link href="/volunteer" className="primary-btn">
                Join as a Volunteer
              </Link>

              <Link href="/contact" className="secondary-btn">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}