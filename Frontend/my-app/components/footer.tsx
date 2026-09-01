import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer>
        <section className="footerLinks">
          <div className="fieldwork-brand">
            <h2>ARMSLENGTH</h2>
            <p>
              EVERY DESERVES A CHANCE
              <br />
              TOGETHER.
            </p>
          </div>

          <div className="company">
            <p>Company</p>

            <ul>
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          <div className="legal">
            <p>Legal</p>

            <ul>
              <li>Privacy Policy</li>
              <li>Terms</li>
            </ul>
          </div>
        </section>

        <div className="newsletter">
          <h4>Newsletter</h4>

          <form>
            <input
              type="email"
              placeholder="Enter Your Email Address"
            />

            <button type="submit">SEND</button>
          </form>
        </div>

        <div className="footerContent">
          <p>&copy; 2026 ARMSLENGTH. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}