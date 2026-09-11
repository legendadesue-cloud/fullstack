"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import Link from "next/link";
import ImageCard from "@/components/imageCard";

export default function Home() {
  const organizations = [
    {
      name: "Red Cross Nigeria",
      category: "Healthcare",
      image: "/images/COMMUNITY EME.jpg",
      alt: "Red Cross Nigeria",
      description:
        "Dedicated to disaster response, emergency healthcare, blood donation campaigns, and humanitarian relief.",
      location: "Abuja",
      volunteers: "2,400+",
      events: "18 Active",
      link: "/organizations/red-cross",
    },
    {
      name: "Teach Africa",
      category: "Education",
      image: "/images/Education for All.jpg",
      alt: "Teach Africa",
      description:
        "Providing quality education, literacy programs, and digital learning opportunities for children.",
      location: "Jos",
      volunteers: "1,150+",
      events: "12 Active",
      link: "/organizations/teach-africa",
    },
    {
      name: "Save Lives Initiative",
      category: "Humanitarian Aid",
      image: "/images/save Africans lives.jpg",
      alt: "Save Lives Initiative",
      description:
        "Fighting hunger through food distribution, emergency relief, and community development.",
      location: "Makurdi",
      volunteers: "890+",
      events: "9 Active",
      link: "/organizations/save-lives",
    },
    {
      name: "Health First",
      category: "Healthcare",
      image:
        "/images/This past Saturday, we had the honour of joining….jpg",
      alt: "Health First",
      description:
        "Improving community health through outreach, vaccinations, and medical volunteer programs.",
      location: "Lagos",
      volunteers: "1,700+",
      events: "15 Active",
      link: "/organizations/health-first",
    },
    {
      name: "Green Earth",
      category: "Environment",
      image: "/images/COMMUNITY EME.jpg",
      alt: "Green Earth",
      description:
        "Promoting environmental sustainability through clean-up projects and tree-planting campaigns.",
      location: "Enugu",
      volunteers: "980+",
      events: "11 Active",
      link: "/organizations/green-earth",
    },
    {
      name: "Future Leaders",
      category: "Youth Development",
      image: "/images/Education for All.jpg",
      alt: "Future Leaders",
      description:
        "Empowering young people through leadership, mentorship, and career development programs.",
      location: "Ibadan",
      volunteers: "760+",
      events: "8 Active",
      link: "/organizations/future-leaders",
    },
  ];

  return (
    <>
      <Header />

      <main className="organizations-page">

        {/* =========================================
            HERO
        ========================================= */}
        <section className="organizations-hero">
          <div className="organizations-hero-content">
            <span className="organizations-label">
              ARMSLENGTH NETWORK
            </span>

            <h1>Partner Organizations</h1>

            <p>
              Connect with trusted NGOs and nonprofit organizations
              creating meaningful change across communities. Discover
              their missions, volunteer opportunities, and upcoming
              events.
            </p>

            <div className="organizations-hero-stats">
              <div>
                <strong>6+</strong>
                <span>Organizations</span>
              </div>

              <div>
                <strong>7K+</strong>
                <span>Volunteers</span>
              </div>

              <div>
                <strong>70+</strong>
                <span>Active Events</span>
              </div>
            </div>
          </div>

          <div className="organization-status">
            <span className="status-dot"></span>
            Organizations Active
          </div>
        </section>

        {/* =========================================
            ORGANIZATION DIRECTORY
        ========================================= */}
        <section className="organizations-section">

          <div className="organizations-section-title">
            <span>ORGANIZATION DIRECTORY</span>

            <h2>Find an Organization</h2>

            <p>
              Explore organizations based on their area of impact and
              discover opportunities that match your interests.
            </p>
          </div>

          {/* SEARCH + FILTER */}
          <div className="organization-search">

            <div className="search-wrapper">
              <span className="search-icon">⌕</span>

              <input
                type="text"
                placeholder="Search organizations..."
                className="search-box"
              />
            </div>

            <select className="filter-box">
              <option>All Categories</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Environment</option>
              <option>Humanitarian Aid</option>
              <option>Youth Development</option>
              <option>Emergency Response</option>
            </select>

          </div>

          {/* ORGANIZATION CARDS */}
          <div className="organization-grid">

            {organizations.map((organization) => (
              <article
                className="organization-card"
                key={organization.name}
              >
                <div className="organization-image">
                  <ImageCard
                    src={organization.image}
                    alt={organization.alt}
                  />

                  <span className="organization-category">
                    {organization.category}
                  </span>
                </div>

                <div className="organization-content">

                  <h2>{organization.name}</h2>

                  <p className="organization-description">
                    {organization.description}
                  </p>

                  <div className="organization-info">

                    <div>
                      <span>Location</span>
                      <strong>{organization.location}</strong>
                    </div>

                    <div>
                      <span>Volunteers</span>
                      <strong>{organization.volunteers}</strong>
                    </div>

                    <div>
                      <span>Events</span>
                      <strong>{organization.events}</strong>
                    </div>

                  </div>

                  <Link
                    href={organization.link}
                    className="organization-btn"
                  >
                    View Organization
                    <span>→</span>
                  </Link>

                </div>
              </article>
            ))}

          </div>

        </section>

        {/* =========================================
            CTA
        ========================================= */}
        <section className="organizations-cta">

          <div>
            <span>MAKE A DIFFERENCE</span>

            <h2>
              Find an Organization That Matches Your Purpose.
            </h2>

            <p>
              Explore different causes, discover meaningful
              opportunities, and use your skills to contribute
              to organizations making an impact.
            </p>

            <Link
              href="/"
              className="organizations-cta-btn"
            >
              Explore Opportunities
            </Link>
          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
