"use client";

import { useEffect } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Link from "next/link";
import ImageCard from "@/components/imageCard";

export default function Home() {
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error connecting to server:", error);
      });
  }, []);

  return (
    <>
      <Header />

      <main className="volunteer-dashboard-page">

        {/* =========================================
            DASHBOARD HERO
        ========================================= */}
        <section className="volunteer-hero">
          <div className="volunteer-hero-content">
            <span className="volunteer-label">
              VOLUNTEER DASHBOARD
            </span>

            <h1>
              Welcome to <strong>ARMSLENGTH</strong>
            </h1>

            <p>
              Discover meaningful opportunities, connect with NGOs,
              develop your skills, and make a positive impact through
              events that match your interests and career goals.
            </p>

            <div className="volunteer-hero-actions">
              <a href="#Events" className="volunteer-primary-btn">
                Explore Events
              </a>

              <Link
                href="/volunteerprofile"
                className="volunteer-secondary-btn"
              >
                View My Profile
              </Link>
            </div>
          </div>

          <div className="volunteer-status">
            <span className="status-dot"></span>
            Platform Active
          </div>
        </section>

        {/* =========================================
            QUICK ACCESS
        ========================================= */}
        <section className="dashboard-section quick-access-section">
          <div className="dashboard-section-title">
            <span>QUICK ACCESS</span>
            <h2>Manage Your Opportunities</h2>
            <p>
              Quickly access the tools and information you need as a
              volunteer.
            </p>
          </div>

          <div className="quick-access-grid">

            <Link href="/bookmark" className="quick-card">
              <div className="quick-icon">
                <img
                  src="/images/icons8-add-bookmark-48.png"
                  alt="Bookmarks"
                />
              </div>

              <div>
                <h3>Bookmarks</h3>
                <p>
                  View events and opportunities you have saved.
                </p>
              </div>

              <span className="quick-arrow">→</span>
            </Link>

            <Link href="/volunteerprofile" className="quick-card">
              <div className="quick-icon">
                <img
                  src="/images/icons8-test-account-50.png"
                  alt="Profile"
                />
              </div>

              <div>
                <h3>My Profile</h3>
                <p>
                  View and manage your volunteer information.
                </p>
              </div>

              <span className="quick-arrow">→</span>
            </Link>

            <Link href="#Events" className="quick-card">
              <div className="quick-icon">
                <img
                  src="/images/icons8-timeline-50.png"
                  alt="Events"
                />
              </div>

              <div>
                <h3>Upcoming Events</h3>
                <p>
                  Explore available events and volunteer opportunities.
                </p>
              </div>

              <span className="quick-arrow">→</span>
            </Link>

            <div className="quick-card">
              <div className="quick-icon">
                <img
                  src="/images/icons8-notification-50.png"
                  alt="Notifications"
                />
              </div>

              <div>
                <h3>Notifications</h3>
                <p>
                  Stay informed about new opportunities and updates.
                </p>
              </div>

              <span className="notification-badge">0</span>
            </div>

          </div>
        </section>

        {/* =========================================
            ABOUT PLATFORM
        ========================================= */}
        <section className="dashboard-section">
          <div className="dashboard-section-title">
            <span>ABOUT ARMSLENGTH</span>
            <h2>Where Skills Meet Purpose</h2>
          </div>

          <div className="dashboard-overview">

            <div className="overview-dashboard-icon">
              ★
            </div>

            <div>
              <h3>Build Experience Through Impact</h3>

              <p>
                ARMSLENGTH connects volunteers with NGOs and organizations
                offering meaningful events and opportunities that align
                with their skills, interests, and career goals.
              </p>

              <p>
                Whether you are looking to gain practical experience,
                contribute to your community, expand your professional
                network, or discover new opportunities, our platform
                helps you find events where your contribution matters.
              </p>

              <p>
                Every opportunity can be a step toward personal growth,
                professional development, and making a meaningful
                difference in your community.
              </p>
            </div>

          </div>
        </section>

        {/* =========================================
            HOW IT WORKS
        ========================================= */}
        <section className="dashboard-process-section">
          <div className="dashboard-section-title">
            <span>HOW IT WORKS</span>
            <h2>Your Journey Starts Here</h2>
          </div>

          <div className="process-grid">

            <div className="process-card">
              <span>01</span>
              <h3>Discover</h3>
              <p>
                Browse events and opportunities organized by NGOs
                and community organizations.
              </p>
            </div>

            <div className="process-card">
              <span>02</span>
              <h3>Choose</h3>
              <p>
                Find opportunities that match your skills, interests,
                availability, and career goals.
              </p>
            </div>

            <div className="process-card">
              <span>03</span>
              <h3>Participate</h3>
              <p>
                Get involved, contribute your skills, and gain
                valuable real-world experience.
              </p>
            </div>

            <div className="process-card">
              <span>04</span>
              <h3>Grow</h3>
              <p>
                Build your experience, expand your network, and
                increase your chances of future opportunities.
              </p>
            </div>

          </div>
        </section>

        {/* =========================================
            EVENTS
        ========================================= */}
        <section className="dashboard-section events-section" id="Events">

          <div className="dashboard-section-title">
            <span>OPPORTUNITIES</span>
            <h2>Upcoming Events</h2>
            <p>
              Explore opportunities where you can contribute,
              learn, and make an impact.
            </p>
          </div>

          <div className="gallery-grid">

            <div className="event-card">
              <ImageCard
                src="/images/COMMUNITY EME.jpg"
                alt="Community Awareness Outreach"
              />

              <div className="event-card-content">
                <span>COMMUNITY</span>
                <h3>Awareness Outreach</h3>
                <p>
                  Help raise awareness and engage with members
                  of the community.
                </p>

                <button>View Opportunity →</button>
              </div>
            </div>

            <div className="event-card">
              <ImageCard
                src="/images/This past Saturday, we had the honour of joining….jpg"
                alt="Medical Assistant"
              />

              <div className="event-card-content">
                <span>HEALTHCARE</span>
                <h3>Medical Assistant</h3>
                <p>
                  Support healthcare-focused community initiatives
                  and outreach activities.
                </p>

                <button>View Opportunity →</button>
              </div>
            </div>

            <div className="event-card">
              <ImageCard
                src="/images/Education for All.jpg"
                alt="Educational Outreach"
              />

              <div className="event-card-content">
                <span>EDUCATION</span>
                <h3>Educational Outreach</h3>
                <p>
                  Contribute to educational programs designed to
                  support learners and communities.
                </p>

                <button>View Opportunity →</button>
              </div>
            </div>

            <div className="event-card">
              <ImageCard
                src="/images/save Africans lives.jpg"
                alt="Stop Hunger Campaign"
              />

              <div className="event-card-content">
                <span>COMMUNITY SUPPORT</span>
                <h3>Stop Hunger Campaign</h3>
                <p>
                  Join initiatives focused on supporting vulnerable
                  communities and reducing hunger.
                </p>

                <button>View Opportunity →</button>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================
            IMPACT SECTION
        ========================================= */}
        <section className="dashboard-impact-section">

          <div className="impact-content">

            <div>
              <span>MAKE AN IMPACT</span>

              <h2>
                Your Skills Can Make a Difference.
              </h2>

              <p>
                Every volunteer brings unique skills, ideas, and
                experiences. Find an opportunity where what you
                know can help create meaningful change.
              </p>
            </div>

            <Link
              href="/volunteerprofile"
              className="impact-btn"
            >
              Complete Your Profile
            </Link>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}