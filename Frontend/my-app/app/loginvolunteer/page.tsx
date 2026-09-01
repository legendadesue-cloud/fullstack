"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [FullName, setFullName] = useState("");
  const [Password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/loginvolunteer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            FullName,
            Password,
          }),
        }
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (response.ok) {

        // Make sure the backend actually returned the user
        if (!data.user || !data.user.id) {
          console.error("No user information returned:", data);

          alert("Login succeeded, but user information was not returned.");
          return;
        }

        // Save ONLY the logged-in user's information
        sessionStorage.setItem(
          "loggedInUser",
          JSON.stringify({
            id: data.user.id,
            FullName: data.user.FullName,
            Email: data.user.Email,
          })
        );

        console.log(
          "LOGGED-IN USER SAVED:",
          data.user
        );

        // Go to the volunteer profile
        router.push("/volunteerprofile");

      } else {

        alert(
          data.error ||
          data.message ||
          "Login failed"
        );
      }

    } catch (error) {

      console.error("Login error:", error);

      alert("Unable to connect to server.");
    }
  };

  return (
    <>
      <section className="login-section">

        <div className="login-dashboard">

          <h1>ARMSLENGTH</h1>

          <fieldset>

            <legend>login details</legend>

            <div className="form-group">

              <label htmlFor="FullName">
                NAME
              </label>

              <input
                type="text"
                id="FullName"
                name="FullName"
                value={FullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="Password">
                Password
              </label>

              <input
                type="password"
                id="Password"
                name="Password"
                value={Password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>

          </fieldset>

          <button
            className="login-button"
            onClick={handleLogin}
          >
            Login as Volunteer
          </button>

          <button className="login-button">

            <Link href="/profile">
              Don't have an account? Get one now
            </Link>

          </button>

        </div>

      </section>
    </>
  );
}