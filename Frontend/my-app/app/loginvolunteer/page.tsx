"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      alert("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending login request...");
      console.log("Email:", email);

     const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/loginvolunteer`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      Email: email.trim(),
      Password: password,
    }),
  }
);
      console.log(
        "Login response status:",
        response.status
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data: any = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error(
          "Server returned non-JSON:",
          text
        );

        alert(
          "The server returned an unexpected response. Make sure the backend is running on port 4000."
        );

        return;
      }

      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        alert(
          data.error ||
            data.message ||
            "Login failed. Please check your email and password."
        );

        return;
      }

      if (!data.success) {
        alert(
          data.error ||
            "Login failed."
        );

        return;
      }

      if (!data.user || !data.user.id) {
        console.error(
          "No user information returned:",
          data
        );

        alert(
          "Login succeeded, but user information was not returned by the server."
        );

        return;
      }

      // ========================================
      // SAVE LOGGED-IN USER
      // ========================================

      const loggedInUser = {
        id: data.user.id,
        FullName: data.user.FullName,
        Email: data.user.Email,
        Skills: data.user.Skills || "",
        Institution:
          data.user.Institution || "",
        Qualification:
          data.user.Qualification || "",
        FieldOfStudy:
          data.user.FieldOfStudy || "",
        VolunteerOrWorkExperience:
          data.user.VolunteerOrWorkExperience ||
          "",
        AreaOfInterest:
          data.user.AreaOfInterest || "",
      };

      sessionStorage.setItem(
        "loggedInUser",
        JSON.stringify(loggedInUser)
      );

      console.log(
        "LOGGED-IN USER SAVED:",
        loggedInUser
      );

      // ========================================
      // REDIRECT
      // ========================================

      router.push("/volunteerdashboard");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      alert(
        "Unable to connect to the server. Make sure your backend is running on port 4000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-dashboard">

        <h1>ARMSLENGTH</h1>

        <fieldset>
          <legend>Login Details</legend>

          {/* EMAIL */}
          <div className="form-group">
            <label htmlFor="email">
              EMAIL
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label htmlFor="password">
              PASSWORD
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>
        </fieldset>

        {/* LOGIN BUTTON */}
        <button
          type="button"
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login as Volunteer"}
        </button>

        {/* CREATE ACCOUNT */}
        <div className="login-link-container">
          <Link
            href="/profile"
            className="login-link-button"
          >
            Don't have an account? Get one now
          </Link>
        </div>

        {/* FORGOT PASSWORD */}
        <div className="forgot-password">
          <Link href="/forgotpassword">
            Forgot password?
          </Link>
        </div>

      </div>
    </section>
  );
}