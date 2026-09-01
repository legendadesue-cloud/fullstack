"use client";
import { useEffect } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Link from "next/link";     
import ImageCard from "@/components/imageCard";
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
 
    <section className="organizations-section">

  <div className="organizations-header">
    <h1>Partner Organizations</h1>
    <p>
      Discover trusted NGOs and nonprofit organizations making a difference
      across communities. Explore their missions, current volunteer
      opportunities, and upcoming events.
    </p>
  </div>

  <div className="organization-search">
    <input
      type="text"
      placeholder="Search organizations..."
      className="search-box"
    />

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

  <div className="organization-grid">

    <div className="organization-card">
      <ImageCard
        src="/images/COMMUNITY EME.jpg"
        alt="Red Cross Nigeria"
      />

      <div className="organization-content">
        <h2>Red Cross Nigeria</h2>

        <span className="organization-category">
          Healthcare
        </span>

        <p>
          Dedicated to disaster response, emergency healthcare,
          blood donation campaigns, and humanitarian relief.
        </p>

        <div className="organization-info">
          <p><strong>Location:</strong> Abuja</p>
          <p><strong>Volunteers:</strong> 2,400+</p>
          <p><strong>Events:</strong> 18 Active</p>
        </div>

        <Link href="/organizations/red-cross">
          <button>View Organization</button>
        </Link>
      </div>
    </div>

    <div className="organization-card">
      <ImageCard
        src="/images/Education for All.jpg"
        alt="Teach Africa"
      />

      <div className="organization-content">
        <h2>Teach Africa</h2>

        <span className="organization-category">
          Education
        </span>

        <p>
          Providing quality education, literacy programs,
          and digital learning opportunities for children.
        </p>

        <div className="organization-info">
          <p><strong>Location:</strong> Jos</p>
          <p><strong>Volunteers:</strong> 1,150+</p>
          <p><strong>Events:</strong> 12 Active</p>
        </div>

        <Link href="/organizations/teach-africa">
          <button>View Organization</button>
        </Link>
      </div>
    </div>

    <div className="organization-card">
      <ImageCard
        src="/images/save Africans lives.jpg"
        alt="Save Lives Initiative"
      />

      <div className="organization-content">
        <h2>Save Lives Initiative</h2>

        <span className="organization-category">
          Humanitarian Aid
        </span>

        <p>
          Fighting hunger through food distribution,
          emergency relief, and community development.
        </p>

        <div className="organization-info">
          <p><strong>Location:</strong> Makurdi</p>
          <p><strong>Volunteers:</strong> 890+</p>
          <p><strong>Events:</strong> 9 Active</p>
        </div>

        <Link href="/organizations/save-lives">
          <button>View Organization</button>
        </Link>
      </div>
    </div>

    <div className="organization-card">
      <ImageCard
        src="/images/This past Saturday, we had the honour of joining….jpg"
        alt="Health First"
      />

      <div className="organization-content">
        <h2>Health First</h2>

        <span className="organization-category">
          Healthcare
        </span>

        <p>
          Improving community health through outreach,
          vaccinations, and medical volunteer programs.
        </p>

        <div className="organization-info">
          <p><strong>Location:</strong> Lagos</p>
          <p><strong>Volunteers:</strong> 1,700+</p>
          <p><strong>Events:</strong> 15 Active</p>
        </div>

        <Link href="/organizations/health-first">
          <button>View Organization</button>
        </Link>
      </div>
    </div>

    <div className="organization-card">
      <ImageCard
        src="/images/COMMUNITY EME.jpg"
        alt="Green Earth"
      />

      <div className="organization-content">
        <h2>Green Earth</h2>

        <span className="organization-category">
          Environment
        </span>

        <p>
          Promoting environmental sustainability through
          clean-up projects and tree-planting campaigns.
        </p>

        <div className="organization-info">
          <p><strong>Location:</strong> Enugu</p>
          <p><strong>Volunteers:</strong> 980+</p>
          <p><strong>Events:</strong> 11 Active</p>
        </div>

        <Link href="/organizations/green-earth">
          <button>View Organization</button>
        </Link>
      </div>
    </div>

    <div className="organization-card">
      <ImageCard
        src="/images/Education for All.jpg"
        alt="Future Leaders"
      />

      <div className="organization-content">
        <h2>Future Leaders</h2>

        <span className="organization-category">
          Youth Development
        </span>

        <p>
          Empowering young people through leadership,
          mentorship, and career development programs.
        </p>

        <div className="organization-info">
          <p><strong>Location:</strong> Ibadan</p>
          <p><strong>Volunteers:</strong> 760+</p>
          <p><strong>Events:</strong> 8 Active</p>
        </div>

        <Link href="/organizations/future-leaders">
          <button>View Organization</button>
        </Link>
      </div>
    </div>

  </div>

  </section>
      <Footer/>
    </>
  );
}