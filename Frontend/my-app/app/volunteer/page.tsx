"use client";
import Header from  "@/components/secondheader";
import Link from "next/link";
import  Footer from "@/components/footer";
import { useEffect } from "react";

export default function Home() {

  
       useEffect(() => {
        fetch("http://localhost:4000/volunteer")
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
          });
      }, []);



  return (
    <>
      <Header/>

      <section className="volunteer-section">

        <div className="volunteer-search">

          <input
            type="text"
            placeholder="Search Opportunities..."
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

        <div className="cards-row">

          <div className="stat-card blue">
            <div className="card-label">
              Active Opportunities
            </div>

            <div className="card-num">
              18
            </div>
          </div>

          <div className="stat-card green">
            <div className="card-label">
              Applications
            </div>

            <div className="card-num">
              342
            </div>
          </div>

          <div className="stat-card orange">
            <div className="card-label">
              Open Positions
            </div>

            <div className="card-num">
              56
            </div>
          </div>

          <div className="stat-card purple">
            <div className="card-label">
              Completed Programs
            </div>

            <div className="card-num">
              24
            </div>
          </div>

        </div>

        <section className="section">

          <h2>
            Volunteer Opportunities
          </h2>

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

                <tr>
                  <td>Community Health Outreach</td>
                  <td>Healthcare</td>
                  <td>Abuja</td>
                  <td>28 Jul 2026</td>
                  <td>43</td>

                  <td>
                    <span className="badge live">
                      Open
                    </span>
                  </td>

                  <td>
                    <button className="tbl-btn">
                        bookmark
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>Educational Support Program</td>
                  <td>Education</td>
                  <td>Jos</td>
                  <td>12 Aug 2026</td>
                  <td>31</td>

                  <td>
                    <span className="badge live">
                      Open
                    </span>
                  </td>

                  <td>
                    <button className="tbl-btn">
                        bookmark
                    </button>
                  </td>
                </tr>
                                <tr>
                  <td>Food Relief Campaign</td>
                  <td>Humanitarian Aid</td>
                  <td>Makurdi</td>
                  <td>20 Aug 2026</td>
                  <td>56</td>

                  <td>
                    <span className="badge upcoming">
                      Upcoming
                    </span>
                  </td>

                  <td>
                    <button className="tbl-btn">
                      view
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>Youth Mentorship</td>
                  <td>Youth Development</td>
                  <td>Ibadan</td>
                  <td>26 Jul 2026</td>
                  <td>24</td>

                  <td>
                    <span className="badge live">
                      Open
                    </span>
                  </td>

                  <td>
                    <button className="tbl-btn">
                        bookmark
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>Environmental Cleanup</td>
                  <td>Environment</td>
                  <td>Enugu</td>
                  <td>14 Jun 2026</td>
                  <td>61</td>

                  <td>
                    <span className="badge closed">
                      Closed
                    </span>
                  </td>

                  <td>
                    <button className="tbl-btn">
                      Archive
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>Disaster Relief Training</td>
                  <td>Emergency Response</td>
                  <td>Port Harcourt</td>
                  <td>3 Sep 2026</td>
                  <td>18</td>

                  <td>
                    <span className="badge upcoming">
                      Upcoming
                    </span>
                  </td>

                  <td>
                    <button className="tbl-btn">
                      view
                    </button>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </section>

      </section>

      <Footer/>

    </>
  );
}