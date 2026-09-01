"use client";

import { useState } from "react";
import Header from "@/components/header";
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
const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  if (password.length < 8) {
    dispatch(setMessage("Password must be at least 8 characters."));
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

    const response = await fetch(
      "http://localhost:4000/profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.error ||
        data.message ||
        `Profile creation failed: ${response.status}`
      );
    }

    setPassword("");
    dispatch(setMessage("Profile created successfully!"));
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to create profile";

    console.log("Profile creation failed:", errorMessage);
    dispatch(setMessage(errorMessage));
  } finally {
    dispatch(setLoading(false));
  }
};

  return (
    <>
      <Header />

      <section className="profile-section">
        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >
          <h2>Volunteer Profile</h2>

          <fieldset>
            <legend>Personal Information</legend>

            <div className="form-group">
              <label htmlFor="FullName">
                Full Name
              </label>

              <input
                type="text"
                id="FullName"
                name="FullName"
                value={profile.FullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="Email">
                Email Address
              </label>

              <input
                type="email"
                id="Email"
                name="Email"
                value={profile.Email}
                onChange={handleChange}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="PhoneNumber">
                Phone Number
              </label>

              <input
                type="tel"
                id="PhoneNumber"
                name="PhoneNumber"
                value={profile.PhoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="DateOfBirth">
                Date of Birth
              </label>

              <input
                type="date"
                id="DateOfBirth"
                name="DateOfBirth"
                value={profile.DateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="Location">
                Location
              </label>

              <input
                type="text"
                id="Location"
                name="Location"
                value={profile.Location}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Skills</legend>

            <div className="form-group">
              <label htmlFor="Skills">
                List Your Skills
              </label>

              <textarea
                id="Skills"
                name="Skills"
                rows={5}
                value={profile.Skills}
                onChange={handleChange}
                placeholder="Leadership, Graphic Design, Programming, Teaching..."
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Education</legend>

            <div className="form-group">
              <label htmlFor="Institution">
                Institution
              </label>

              <input
                type="text"
                id="Institution"
                name="Institution"
                value={profile.Institution}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="Qualification">
                Qualification
              </label>

              <input
                type="text"
                id="Qualification"
                name="Qualification"
                value={profile.Qualification}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="FieldOfStudy">
                Field of Study
              </label>

              <input
                type="text"
                id="FieldOfStudy"
                name="FieldOfStudy"
                value={profile.FieldOfStudy}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="GraduationYear">
                Graduation Year
              </label>

              <input
                type="number"
                id="GraduationYear"
                name="GraduationYear"
                value={profile.GraduationYear}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Experience</legend>

            <div className="form-group">
              <label htmlFor="VolunteerOrWorkExperience">
                Volunteer or Work Experience
              </label>

              <textarea
                id="VolunteerOrWorkExperience"
                name="VolunteerOrWorkExperience"
                rows={6}
                value={profile.VolunteerOrWorkExperience}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Interests</legend>

            <div className="form-group">
              <label htmlFor="AreaOfInterest">
                Areas of Interest
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

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>

          {message && <p>{message}</p>}
        </form>
      </section>

      <Footer />
    </>
  );
}