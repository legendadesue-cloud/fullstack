"use client";

import Header from "@/components/secondheader";
import Footer from "@/components/footer";
import Link from "next/link";

export default function AdminAbout() {
  return (
    <>
      <Header />

      <main className="admin-about-page">

        {/* Page Header */}
        <section className="admin-about-header">
          <div>
            <span className="admin-about-label">ADMINISTRATION</span>

            <h1>About the Platform</h1>

            <p>
              Manage and monitor the volunteer platform, organizations,
              events, and community activities from one place.
            </p>
          </div>

          <div className="admin-status">
            <span className="status-dot"></span>
            System Active
          </div>
        </section>

        {/* Platform Overview */}
        <section className="admin-about-section">
          <div className="admin-section-title">
            <span>PLATFORM OVERVIEW</span>
            <h2>About Our Volunteer Platform</h2>
          </div>

          <div className="overview-card">
            <div className="overview-icon">🌍</div>

            <div>
              <h3>Connecting Volunteers With Opportunities</h3>

              <p>
                This platform provides a central space where volunteers can
                discover opportunities, organizations can connect with
                volunteers, and administrators can manage events and
                community activities.
              </p>

              <p>
                The administration dashboard gives authorized administrators
                the tools needed to manage users, organizations, events,
                applications, and other important platform activities.
              </p>
            </div>
          </div>
        </section>

        {/* Admin Statistics */}
        <section className="admin-stats-section">

          <div className="admin-section-title">
            <span>PLATFORM STATISTICS</span>
            <h2>Current Overview</h2>
          </div>

          <div className="admin-stats-grid">

            <div className="admin-stat-card">
              <div className="stat-icon">👥</div>
              <div>
                <h3>1,250</h3>
                <p>Registered Volunteers</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon">🏢</div>
              <div>
                <h3>85</h3>
                <p>Organizations</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon">📅</div>
              <div>
                <h3>126</h3>
                <p>Events</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon">🤝</div>
              <div>
                <h3>3,480</h3>
                <p>Volunteer Applications</p>
              </div>
            </div>

          </div>
        </section>

        {/* What Admins Manage */}
        <section className="admin-about-section">

          <div className="admin-section-title">
            <span>ADMINISTRATION</span>
            <h2>What You Can Manage</h2>
          </div>

          <div className="management-grid">

            <div className="management-card">
              <div className="management-icon">👤</div>

              <h3>Volunteers</h3>

              <p>
                View registered volunteers, review profiles, and monitor
                volunteer participation.
              </p>

              <Link href="/admin/volunteers">
                Manage Volunteers →
              </Link>
            </div>

            <div className="management-card">
              <div className="management-icon">🏢</div>

              <h3>Organizations</h3>

              <p>
                Manage organizations, review their information, and monitor
                their activities on the platform.
              </p>

              <Link href="/admin/organizations">
                Manage Organizations →
              </Link>
            </div>

            <div className="management-card">
              <div className="management-icon">📅</div>

              <h3>Events</h3>

              <p>
                Create, update, approve, and monitor volunteer events and
                community activities.
              </p>

              <Link href="/admin/events">
                Manage Events →
              </Link>
            </div>

            <div className="management-card">
              <div className="management-icon">📊</div>

              <h3>Reports</h3>

              <p>
                Monitor platform activity and review important statistics and
                performance information.
              </p>

              <Link href="/admin/reports">
                View Reports →
              </Link>
            </div>

          </div>
        </section>

        {/* Admin Responsibilities */}
        <section className="responsibilities-section">

          <div className="responsibilities-content">

            <div>
              <span className="admin-about-label">ADMIN RESPONSIBILITIES</span>

              <h2>Keeping the Platform Safe and Effective</h2>

              <p>
                Administrators play an important role in maintaining the
                quality, reliability, and integrity of the platform.
              </p>
            </div>

            <div className="responsibility-list">

              <div className="responsibility-item">
                <span>✓</span>
                <div>
                  <h3>Manage Platform Users</h3>
                  <p>
                    Keep volunteer and organization information organized.
                  </p>
                </div>
              </div>

              <div className="responsibility-item">
                <span>✓</span>
                <div>
                  <h3>Monitor Events</h3>
                  <p>
                    Ensure events contain accurate and appropriate information.
                  </p>
                </div>
              </div>

              <div className="responsibility-item">
                <span>✓</span>
                <div>
                  <h3>Review Activities</h3>
                  <p>
                    Monitor applications, registrations, and platform activity.
                  </p>
                </div>
              </div>

              <div className="responsibility-item">
                <span>✓</span>
                <div>
                  <h3>Maintain Platform Quality</h3>
                  <p>
                    Help ensure users have a reliable and useful experience.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* System Information */}
        <section className="system-info-section">

          <div className="admin-section-title">
            <span>SYSTEM INFORMATION</span>
            <h2>Platform Details</h2>
          </div>

          <div className="system-info-card">

            <div className="system-row">
              <span>Platform</span>
              <strong>Volunteer Management System</strong>
            </div>

            <div className="system-row">
              <span>Version</span>
              <strong>1.0.0</strong>
            </div>

            <div className="system-row">
              <span>Status</span>
              <strong className="active-status">Operational</strong>
            </div>

            <div className="system-row">
              <span>Access Level</span>
              <strong>Administrator</strong>
            </div>

          </div>
        </section>

        {/* Admin CTA */}
        <section className="admin-about-cta">

          <div>
            <span>ADMIN DASHBOARD</span>

            <h2>Everything You Need in One Place</h2>

            <p>
              Use the administration dashboard to monitor users, events,
              organizations, and the overall platform.
            </p>

            <Link href="/admin" className="admin-dashboard-btn">
              Back to Dashboard
            </Link>
          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}