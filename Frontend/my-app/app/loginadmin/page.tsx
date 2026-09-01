"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const correctPasscode = "ARM2026";

    if (passcode === correctPasscode) {
      router.push("/admin");
    } else {
      setError("Incorrect passcode.");
    }
  };

  return (
    <>
      <section className="login-section">
        <div className="login-dashboard">
          <h1>ARMSLENGTH</h1>

          <fieldset>
            <legend>Login Details</legend>

            <div className="form-group">
              <label htmlFor="Organization">Organization</label>
              <input
                type="text"
                id="Organization"
                name="Organization"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="passcode">Passcode</label>
              <input
                type="password"
                id="passcode"
                name="passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
              />
            </div>
          </fieldset>

          {error && <p className="login-error">{error}</p>}

          <button className="login-button" onClick={handleLogin}>
            Login as Administrator
          </button>

          <button className="login-button">
            <a href="/profile">
              Haven't registered your organization? Register now
            </a>
          </button>
        </div>
      </section>
    </>
  );
}