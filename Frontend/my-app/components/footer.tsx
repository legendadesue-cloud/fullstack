import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">

      {/* =====================================
          FOOTER LINKS
      ===================================== */}

      <section className="footerLinks">

        {/* BRAND */}

        <div className="fieldwork-brand">
          <h2>ARMSLENGTH</h2>

          <p>
            EVERYONE DESERVES A CHANCE
            <br />
            TOGETHER.
          </p>
        </div>


        {/* COMPANY */}

        <div className="company">
          <p>Company</p>

          <ul>
            <li>
              <Link href="/about">
                About
              </Link>
            </li>

            <li>
              <Link href="/careers">
                Careers
              </Link>
            </li>

            <li>
              <Link href="/contact">
                Contact
              </Link>
            </li>

            <li>
              <Link href="/organizations">
                Organizations
              </Link>
            </li>
          </ul>
        </div>


        {/* VOLUNTEERS */}

        <div className="volunteer-links">
          <p>Volunteers</p>

          <ul>
            <li>
              <Link href="/events">
                Opportunities
              </Link>
            </li>

            <li>
              <Link href="/volunteerprofile">
                My Profile
              </Link>
            </li>

            <li>
              <Link href="/bookmark">
                Saved Events
              </Link>
            </li>
          </ul>
        </div>


        {/* LEGAL */}

        <div className="legal">
          <p>Legal</p>

          <ul>
            <li>
              <Link href="/privacy">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link href="/terms">
                Terms
              </Link>
            </li>
          </ul>
        </div>

      </section>


      {/* =====================================
          NEWSLETTER
      ===================================== */}

      <div className="newsletter">

        <div className="newsletter-text">
          <span>STAY CONNECTED</span>

          <h4>Get Updates From ARMSLENGTH</h4>

          <p>
            Receive updates about new volunteer
            opportunities and community initiatives.
          </p>
        </div>

        <form>
          <input
            type="email"
            placeholder="Enter your email address"
            aria-label="Email address"
            required
          />

          <button type="submit">
            SEND
          </button>
        </form>

      </div>


      {/* =====================================
          COPYRIGHT
      ===================================== */}

      <div className="footerContent">

        <p>
          © 2026 ARMSLENGTH. All rights reserved.
        </p>

        <p>
          Making opportunities accessible.
        </p>

      </div>

    </footer>
  );
}