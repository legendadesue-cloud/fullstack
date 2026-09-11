"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [Email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // =========================================
  // SAFELY READ SERVER RESPONSE
  // =========================================

  const getResponseData = async (response: Response) => {
    const contentType = response.headers.get("content-type") || "";

    // If server returned JSON
    if (contentType.includes("application/json")) {
      return await response.json();
    }

    // If server returned HTML/text instead
    const text = await response.text();

    console.error("Server returned non-JSON:", text);

    return {
      error: `Server returned an unexpected response (${response.status}).`,
    };
  };

  // =========================================
  // SEND OTP
  // =========================================

  const handleSendOTP = async () => {
    if (!Email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:4000/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            Email: Email.trim(),
          }),
        }
      );

      const data = await getResponseData(response);

      console.log("SEND OTP RESPONSE:", data);

      if (!response.ok) {
        alert(
          data.error ||
            data.message ||
            `Unable to send OTP. Server status: ${response.status}`
        );

        return;
      }

      setOtpSent(true);

      alert(
        data.message ||
          "OTP has been sent to your email."
      );
    } catch (error) {
      console.error("SEND OTP ERROR:", error);

      alert(
        "Unable to connect to the server. Make sure your Express server is running on port 4000."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // VERIFY OTP
  // =========================================

  const handleVerifyOTP = async () => {
    if (!Email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (!OTP.trim()) {
      alert("Please enter the OTP.");
      return;
    }

    if (OTP.trim().length !== 6) {
      alert("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:4000/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            Email: Email.trim(),
            OTP: OTP.trim(),
          }),
        }
      );

      const data = await getResponseData(response);

      console.log("VERIFY OTP RESPONSE:", data);

      if (!response.ok) {
        alert(
          data.error ||
            data.message ||
            `OTP verification failed. Server status: ${response.status}`
        );

        return;
      }

      // =========================================
      // CHECK USER
      // =========================================

      if (!data.user) {
        console.error(
          "No user returned from backend:",
          data
        );

        alert(
          "OTP was verified, but the server did not return user information."
        );

        return;
      }

      if (!data.user.id) {
        console.error(
          "User ID missing:",
          data.user
        );

        alert(
          "Login succeeded, but the user ID was not returned."
        );

        return;
      }

      // =========================================
      // SAVE LOGGED-IN USER
      // =========================================

      const loggedInUser = {
        id: data.user.id,
        FullName:
          data.user.FullName ||
          data.user.fullName ||
          "",
        Email:
          data.user.Email ||
          data.user.email ||
          Email.trim(),
      };

      sessionStorage.setItem(
        "loggedInUser",
        JSON.stringify(loggedInUser)
      );

      console.log(
        "LOGGED-IN USER SAVED:",
        loggedInUser
      );

      // =========================================
      // REDIRECT
      // =========================================

      router.push("/volunteerprofile");
    } catch (error) {
      console.error(
        "VERIFY OTP ERROR:",
        error
      );

      alert(
        "Unable to connect to the server. Make sure your Express server is running on port 4000."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // CHANGE EMAIL
  // =========================================

  const handleChangeEmail = () => {
    setOtpSent(false);
    setOTP("");
  };

  return (
    <section className="login-section">
      <div className="login-dashboard">

        {/* HEADER */}

        <div className="login-header">
          <span>VOLUNTEER PORTAL</span>

          <h1>ARMSLENGTH</h1>

          <p>
            Sign in to access your volunteer
            profile and opportunities.
          </p>
        </div>

        <fieldset>
          <legend>Login Details</legend>

          {/* EMAIL */}

          <div className="form-group">
            <label htmlFor="Email">
              EMAIL ADDRESS
            </label>

            <input
              type="email"
              id="Email"
              name="Email"
              placeholder="Enter your email address"
              value={Email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={otpSent || loading}
              required
            />
          </div>

          {/* SEND OTP */}

          {!otpSent && (
            <button
              type="button"
              className="login-button"
              onClick={handleSendOTP}
              disabled={loading}
            >
              {loading
                ? "Sending OTP..."
                : "Send OTP"}
            </button>
          )}

          {/* OTP SECTION */}

          {otpSent && (
            <div className="otp-section">

              <div className="otp-message">
                <span>✓</span>

                <p>
                  A 6-digit OTP has been sent to
                  <strong> {Email}</strong>
                </p>
              </div>

              <div className="form-group otp-group">
                <label htmlFor="OTP">
                  ENTER OTP
                </label>

                <input
                  type="text"
                  id="OTP"
                  name="OTP"
                  placeholder="000000"
                  value={OTP}
                  onChange={(e) =>
                    setOTP(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6)
                    )
                  }
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                />

                <small>
                  Enter the 6-digit code sent to
                  your email.
                </small>
              </div>

              {/* VERIFY */}

              <button
                type="button"
                className="login-button"
                onClick={handleVerifyOTP}
                disabled={
                  loading || OTP.length !== 6
                }
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP & Login"}
              </button>

              {/* RESEND / CHANGE */}

              <div className="otp-actions">

                <button
                  type="button"
                  className="resend-button"
                  onClick={handleSendOTP}
                  disabled={loading}
                >
                  Resend OTP
                </button>

                <button
                  type="button"
                  className="change-email-button"
                  onClick={handleChangeEmail}
                  disabled={loading}
                >
                  Change Email
                </button>

              </div>
            </div>
          )}
        </fieldset>
          <div>
        </div>

      </div>
    </section>
  );
}