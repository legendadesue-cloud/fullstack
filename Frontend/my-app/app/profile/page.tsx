"use client";
import { useState } from "react";
import Footer from "@/components/footer";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/store/store";
import {
  updateProfile,
  setLoading,
  setMessage,
} from "@/src/store/profileslice";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();

  const [password, setPassword] = useState("");

  const profile = useSelector(
    (state: RootState) => state.profile.profile
  );

  const loading = useSelector(
    (state: RootState) => state.profile.loading
  );

  const message = useSelector(
    (state: RootState) => state.profile.message
  );

  // =========================================
  // HANDLE INPUT CHANGES
  // =========================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    dispatch(
      updateProfile({
        name: name as keyof typeof profile,
        value,
      })
    );
  };

  // =========================================
  // SUBMIT PROFILE
  // =========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (password.length < 8) {
      dispatch(
        setMessage(
          "Password must be at least 8 characters."
        )
      );
      return;
    }

    dispatch(setLoading(true));
    dispatch(setMessage(""));

    try {
      const profileData = {
        ...profile,
        Password: password,

        GraduationYear:
          profile.GraduationYear === ""
            ? null
            : Number(profile.GraduationYear),
      };

      console.log(
        "PROFILE DATA BEING SENT:",
        profileData
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(profileData),
        }
      );

      // Safely handle JSON/non-JSON responses
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

        data = {
          error:
            "The server returned an unexpected response.",
        };
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Profile creation failed: ${response.status}`
        );
      }

      setPassword("");

      dispatch(
        setMessage(
          "Profile created successfully!"
        )
      );

      console.log(
        "PROFILE CREATED:",
        data
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create profile.";

      console.error(
        "Profile creation failed:",
        error
      );

      dispatch(setMessage(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
    

      <main className="profile-page">

        {/* =====================================
            HERO
        ===================================== */}

        <section className="profile-hero">
          <div className="profile-hero-content">

            <span className="profile-label">
              VOLUNTEER REGISTRATION
            </span>

            <h1>
              Build Your
              <strong> Volunteer Profile.</strong>
            </h1>

            <p>
              Tell organizations about your skills,
              education, experience, and interests so
              you can find opportunities that match you.
            </p>

          </div>

          <div className="profile-status">
            <span className="profile-status-dot"></span>
            Volunteer Registration
          </div>
        </section>


        {/* =====================================
            FORM SECTION
        ===================================== */}

        <section className="profile-section">

          <div className="profile-intro">

            <span>YOUR INFORMATION</span>

            <h2>
              Create Your Volunteer Profile
            </h2>

            <p>
              Complete the form below with your
              information. You can use this profile
              when participating in volunteer
              opportunities through ARMSLENGTH.
            </p>

          </div>


          <form
            className="profile-form"
            onSubmit={handleSubmit}
          >

            {/* =====================================
                PERSONAL INFORMATION
            ===================================== */}

            <fieldset>
              <legend>
                <span>01</span>
                Personal Information
              </legend>

              <div className="profile-form-grid">

                <div className="form-group">
                  <label htmlFor="FullName">
                    FULL NAME
                  </label>

                  <input
                    type="text"
                    id="FullName"
                    name="FullName"
                    value={profile.FullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="Email">
                    EMAIL ADDRESS
                  </label>

                  <input
                    type="email"
                    id="Email"
                    name="Email"
                    value={profile.Email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                </div>

 

                <div className="form-group">
                  <label htmlFor="PhoneNumber">
                    PHONE NUMBER
                  </label>

                  <input
                    type="tel"
                    id="PhoneNumber"
                    name="PhoneNumber"
                    value={profile.PhoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                    required
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="DateOfBirth">
                    DATE OF BIRTH
                  </label>

                  <input
                    type="date"
                    id="DateOfBirth"
                    name="DateOfBirth"
                    value={profile.DateOfBirth}
                    onChange={handleChange}
                  />
                </div>


                <div className="form-group full-width">
                  <label htmlFor="Location">
                    LOCATION
                  </label>

                  <input
                    type="text"
                    id="Location"
                    name="Location"
                    value={profile.Location}
                    onChange={handleChange}
                    placeholder="City / State / Country"
                  />
                </div>

              </div>
            </fieldset>


            {/* =====================================
                ACCOUNT SECURITY
            ===================================== */}

            <fieldset>
              <legend>
                <span>02</span>
                Account Security
              </legend>

              <div className="form-group">

                <label htmlFor="Password">
                  PASSWORD
                </label>

                <input
                  type="password"
                  id="Password"
                  name="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Create a password"
                  minLength={8}
                  autoComplete="new-password"
                  required
                />

                <small>
                  Password must contain at least
                  8 characters.
                </small>

              </div>
            </fieldset>


            {/* =====================================
                SKILLS
            ===================================== */}

            <fieldset>
              <legend>
                <span>03</span>
                Skills
              </legend>

              <div className="form-group">

                <label htmlFor="Skills">
                  YOUR SKILLS
                </label>

                <textarea
                  id="Skills"
                  name="Skills"
                  rows={5}
                  value={profile.Skills}
                  onChange={handleChange}
                  placeholder="Leadership, Graphic Design, Programming, Teaching..."
                />

                <small>
                  List skills that could be useful
                  when volunteering.
                </small>

              </div>
            </fieldset>


            {/* =====================================
                EDUCATION
            ===================================== */}

            <fieldset>
              <legend>
                <span>04</span>
                Education
              </legend>

              <div className="profile-form-grid">

                <div className="form-group">
                  <label htmlFor="Institution">
                    INSTITUTION
                  </label>

                  <input
                    type="text"
                    id="Institution"
                    name="Institution"
                    value={profile.Institution}
                    onChange={handleChange}
                    placeholder="University / School"
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="Qualification">
                    QUALIFICATION
                  </label>

                  <input
                    type="text"
                    id="Qualification"
                    name="Qualification"
                    value={profile.Qualification}
                    onChange={handleChange}
                    placeholder="B.Sc, HND, Diploma..."
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="FieldOfStudy">
                    FIELD OF STUDY
                  </label>

                  <input
                    type="text"
                    id="FieldOfStudy"
                    name="FieldOfStudy"
                    value={profile.FieldOfStudy}
                    onChange={handleChange}
                    placeholder="Software Engineering"
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="GraduationYear">
                    GRADUATION YEAR
                  </label>

                  <input
                    type="number"
                    id="GraduationYear"
                    name="GraduationYear"
                    value={profile.GraduationYear}
                    onChange={handleChange}
                    placeholder="2028"
                    min="1900"
                    max="2100"
                  />
                </div>

              </div>
            </fieldset>


            {/* =====================================
                EXPERIENCE
            ===================================== */}

            <fieldset>
              <legend>
                <span>05</span>
                Experience
              </legend>

              <div className="form-group">

                <label htmlFor="VolunteerOrWorkExperience">
                  VOLUNTEER OR WORK EXPERIENCE
                </label>

                <textarea
                  id="VolunteerOrWorkExperience"
                  name="VolunteerOrWorkExperience"
                  rows={6}
                  value={
                    profile.VolunteerOrWorkExperience
                  }
                  onChange={handleChange}
                  placeholder="Tell us about your previous volunteer or work experience..."
                />

              </div>
            </fieldset>


            {/* =====================================
                INTERESTS
            ===================================== */}

            <fieldset>
              <legend>
                <span>06</span>
                Areas of Interest
              </legend>

              <div className="form-group">

                <label htmlFor="AreaOfInterest">
                  AREAS OF INTEREST
                </label>

                <textarea
                  id="AreaOfInterest"
                  name="AreaOfInterest"
                  rows={5}
                  value={profile.AreaOfInterest}
                  onChange={handleChange}
                  placeholder="Healthcare, Education, Environment, Community Development..."
                />

              </div>
            </fieldset>


            {/* =====================================
                SUBMIT
            ===================================== */}

            <div className="profile-submit">

              <div className="profile-submit-text">
                <strong>
                  Ready to join ARMSLENGTH?
                </strong>

                <span>
                  Review your information and
                  create your volunteer profile.
                </span>
              </div>

              <button
                type="submit"
                className="profile-submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Creating Profile..."
                  : "Create Volunteer Profile"}
              </button>

            </div>


            {/* =====================================
                MESSAGE
            ===================================== */}

            {message && (
              <div
                className={`profile-message ${
                  message
                    .toLowerCase()
                    .includes("success")
                    ? "success"
                    : "error"
                }`}
              >
                {message}
              </div>
            )}

          </form>
        </section>

      </main>

      <Footer />
    </>
  );
}