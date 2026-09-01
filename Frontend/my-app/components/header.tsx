import Link from "next/link";

export default function Header() {
  return (
    <>
      <header>
        <nav className="navbar">
          <div className="brandName">
            <div className="brandLogo">
              <img
                src="/images/116108496640094044.jpg"
                alt="ARMSLENGTH Logo"
              />
            </div>
            <p>ARMSLENGTH</p>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-menu-icon lucide-menu"
          >
            <path d="M4 5h16" />
            <path d="M4 12h16" />
            <path d="M4 19h16" />
          </svg>

          <ul className="menu-items">
            <li>
              <Link href="/volunteerdashboard">Home</Link>
            </li>
            
            <li>
              <Link href="/organizations">Organizations</Link>
            </li>
            <li>
              <Link href="/events">Events</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/volunteerprofile">
                <img
                  src="/images/icons8-test-account-50.png"
                  alt="Profile"
                />
              </Link>
            </li>
          </ul>

          <div className="search-bar">
            <input
              type="text"
              id="searchInput"
              placeholder="🔍 Search Organization ..."
              className="search-box"
            />

            <select id="statusFilter" className="filter-box">
              <option value="">All Status</option>
              <option value="current">Current</option>
              <option value="upcoming">Upcoming</option>
              <option value="finished">Finished</option>
            </select>
          </div>
        </nav>
      </header>
    </>
  );
}