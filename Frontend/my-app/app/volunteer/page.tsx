"use client";

import { useEffect, useState } from "react";
import Header from "@/components/secondheader";
import Footer from "@/components/footer";

type VolunteerOpportunity = {
  opportunity: string;
  category: string;
  location: string;
  deadline: string;
  applicants: number;
  status: "Open" | "Upcoming" | "Closed";
};

const volunteerData: VolunteerOpportunity[] = [
  {
    opportunity: "Community Health Outreach",
    category: "Healthcare",
    location: "Abuja",
    deadline: "28 Jul 2026",
    applicants: 43,
    status: "Open",
  },
  {
    opportunity: "Educational Support Program",
    category: "Education",
    location: "Jos",
    deadline: "12 Aug 2026",
    applicants: 31,
    status: "Open",
  },
  {
    opportunity: "Food Relief Campaign",
    category: "Humanitarian Aid",
    location: "Makurdi",
    deadline: "20 Aug 2026",
    applicants: 56,
    status: "Upcoming",
  },
  {
    opportunity: "Youth Mentorship",
    category: "Youth Development",
    location: "Ibadan",
    deadline: "26 Jul 2026",
    applicants: 24,
    status: "Open",
  },
  {
    opportunity: "Environmental Cleanup",
    category: "Environment",
    location: "Enugu",
    deadline: "14 Jun 2026",
    applicants: 61,
    status: "Closed",
  },
  {
    opportunity: "Disaster Relief Training",
    category: "Emergency Response",
    location: "Port Harcourt",
    deadline: "3 Sep 2026",
    applicants: 18,
    status: "Upcoming",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [opportunities, setOpportunities] =
    useState<VolunteerOpportunity[]>(volunteerData);

  useEffect(() => {
    fetch("http://localhost:4000/volunteer")
      .then((res) => res.json())
      .then((data) => {
        console.log("VOLUNTEER RESPONSE:", data);

        // Keep the page working even if the backend
        // does not return the table data yet.
        if (Array.isArray(data) && data.length > 0) {
          setOpportunities(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching volunteer data:", error);
      });
  }, []);

  const filteredOpportunities = opportunities.filter((item) => {
    const matchesSearch =
      item.opportunity
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.location
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All Categories" ||
      item.category === category;

    return matchesSearch && matchesCategory;
  });

  const activeCount = opportunities.filter(
    (item) => item.status === "Open"
  ).length;

  const upcomingCount = opportunities.filter(
    (item) => item.status === "Upcoming"
  ).length;

  const totalApplicants = opportunities.reduce(
    (total, item) => total + item.applicants,
    0
  );

  const completedCount = opportunities.filter(
    (item) => item.status === "Closed"
  ).length;

  return (
    <>
      <Header />

      <main className="volunteer-management-page">

        {/* HERO */}
        <section className="volunteer-hero">
          <div className="volunteer-hero-content">

            <span className="volunteer-label">
              VOLUNTEER MANAGEMENT
            </span>

            <h1>
              Manage Opportunities.
              <strong> Create Impact.</strong>
            </h1>

            <p>
              Manage volunteer opportunities, monitor applications,
              and connect people with meaningful programs across
              the ARMSLENGTH platform.
            </p>

            <div className="volunteer-hero-actions">
              <a
                href="#opportunities"
                className="volunteer-primary-btn"
              >
                View Opportunities
              </a>

              <a
                href="#statistics"
                className="volunteer-secondary-btn"
              >
                View Statistics
              </a>
            </div>
          </div>

          <div className="volunteer-status">
            <span className="status-dot"></span>
            Platform Active
          </div>
        </section>

        {/* SEARCH */}
        <section className="volunteer-section">

          <div className="volunteer-section-heading">
            <span>OPPORTUNITY DIRECTORY</span>

            <h2>
              Volunteer Opportunities
            </h2>

            <p>
              Search and filter opportunities to quickly find
              programs that match your organization's needs.
            </p>
          </div>

          <div className="volunteer-search">

            <div className="search-field">
              <label htmlFor="search">
                Search
              </label>

              <input
                id="search"
                type="text"
                placeholder="Search opportunities or locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-field">
              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>All Categories</option>
                <option>Healthcare</option>
                <option>Education</option>
                <option>Environment</option>
                <option>Humanitarian Aid</option>
                <option>Youth Development</option>
                <option>Emergency Response</option>
              </select>
            </div>

          </div>

          {/* STATISTICS */}
          <section
            className="volunteer-stats"
            id="statistics"
          >

            <div className="volunteer-stat-card">
              <span className="stat-label">
                Active Opportunities
              </span>

              <strong>
                {activeCount}
              </strong>

              <small>
                Currently open
              </small>
            </div>

            <div className="volunteer-stat-card">
              <span className="stat-label">
                Applications
              </span>

              <strong>
                {totalApplicants}
              </strong>

              <small>
                Total applicants
              </small>
            </div>

            <div className="volunteer-stat-card">
              <span className="stat-label">
                Upcoming
              </span>

              <strong>
                {upcomingCount}
              </strong>

              <small>
                Starting soon
              </small>
            </div>

            <div className="volunteer-stat-card">
              <span className="stat-label">
                Completed
              </span>

              <strong>
                {completedCount}
              </strong>

              <small>
                Closed programs
              </small>
            </div>

          </section>

          {/* TABLE */}
          <section
            className="volunteer-table-section"
            id="opportunities"
          >

            <div className="table-heading">
              <div>
                <span>AVAILABLE PROGRAMS</span>

                <h2>
                  Opportunity Management
                </h2>
              </div>

              <span className="result-count">
                {filteredOpportunities.length} opportunities
              </span>
            </div>

            <div className="table-wrap">

              <table>

                <thead>
                  <tr>
                    <th>Opportunity</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Deadline</th>
                    <th>Applicants</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredOpportunities.length > 0 ? (
                    filteredOpportunities.map((item, index) => (
                      <tr key={`${item.opportunity}-${index}`}>

                        <td>
                          <strong className="opportunity-name">
                            {item.opportunity}
                          </strong>
                        </td>

                        <td>
                          {item.category}
                        </td>

                        <td>
                          {item.location}
                        </td>

                        <td>
                          {item.deadline}
                        </td>

                        <td>
                          {item.applicants}
                        </td>

                        <td>
                          <span
                            className={`badge ${item.status.toLowerCase()}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td>
                          <div className="table-actions">

                            {item.status === "Open" && (
                              <>
                                <button className="tbl-btn view-btn">
                                  View
                                </button>

                                <button className="tbl-btn bookmark-btn">
                                  Bookmark
                                </button>
                              </>
                            )}

                            {item.status === "Upcoming" && (
                              <button className="tbl-btn view-btn">
                                View
                              </button>
                            )}

                            {item.status === "Closed" && (
                              <button
                                className="tbl-btn archive-btn"
                                disabled
                              >
                                Archived
                              </button>
                            )}

                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="no-results"
                      >
                        No volunteer opportunities found.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </section>

        </section>

        {/* BOTTOM CTA */}
        <section className="volunteer-cta">

          <div className="volunteer-cta-content">

            <span>
              KEEP MAKING AN IMPACT
            </span>

            <h2>
              Help Connect People With Purpose.
            </h2>

            <p>
              Keep the ARMSLENGTH platform organized by managing
              opportunities and ensuring volunteers can discover
              meaningful programs.
            </p>

            <div className="volunteer-cta-actions">

              <a
                href="#opportunities"
                className="volunteer-cta-primary"
              >
                Manage Opportunities
              </a>

              <a
                href="#statistics"
                className="volunteer-cta-secondary"
              >
                View Statistics
              </a>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}