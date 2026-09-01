"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/store/store";
import {
  setLoading,
  setMessage,
  setProfile,
} from "@/src/store/profileslice";

export default function Profile() {

  // Store the user who logged in
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const dispatch = useDispatch<AppDispatch>();

  // Get the profile from Redux
  const profile = useSelector(
    (state: RootState) => state.profile.profile
  );

  const loading = useSelector(
    (state: RootState) => state.profile.loading
  );

  const message = useSelector(
    (state: RootState) => state.profile.message
  );


  // STEP 1:
  // Get the logged-in user from sessionStorage
  useEffect(() => {

    const savedUser = sessionStorage.getItem("loggedInUser");

    if (savedUser) {

      const user = JSON.parse(savedUser);

      console.log("LOGGED IN USER:", user);

      setLoggedInUser(user);
    }

  }, []);


  // STEP 2:
  // Once we have the user's ID, get their profile
  useEffect(() => {

    if (!loggedInUser?.id) {
      return;
    }

    const loadProfile = async () => {

      dispatch(setLoading(true));
      dispatch(setMessage(""));

      try {

        console.log(
          "Getting profile for user ID:",
          loggedInUser.id
        );

        const response = await fetch(
          `http://localhost:4000/profile/${loggedInUser.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        console.log("PROFILE RESPONSE:", data);

        if (!response.ok) {

          throw new Error(
            data.error ||
            data.message ||
            "Failed to load profile"
          );

        }

        // Put the complete profile into Redux
        dispatch(setProfile(data.profile));

      } catch (error) {

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unable to load profile information.";

        console.error("Error loading profile:", errorMessage);

        dispatch(setMessage(errorMessage));

      } finally {

        dispatch(setLoading(false));

      }
    };

    loadProfile();

  }, [dispatch, loggedInUser?.id]);


  return (
    <>
      <Header />

      <section className="profile-section">

        <div className="profile-dashboard">

          <h1>My Profile</h1>


          {/* Show logged-in user information */}

          {loggedInUser && (
            <div className="logged-in-user">

              <p>
                Logged in as: {loggedInUser.FullName}
              </p>

              <p>
                User ID: {loggedInUser.id}
              </p>

            </div>
          )}


          {loading && (
            <p>Loading profile...</p>
          )}


          {message && !loading && (
            <p>{message}</p>
          )}


          {!loading && profile && (
            <div className="profile-details">

              <div className="profile-item">
                <h3>Full Name</h3>
                <p>
                  {profile.FullName || "Not provided"}
                </p>
              </div>


              <div className="profile-item">
                <h3>Email</h3>
                <p>
                  {profile.Email || "Not provided"}
                </p>
              </div>


              <div className="profile-item">
                <h3>Skills</h3>
                <p>
                  {profile.Skills || "Not provided"}
                </p>
              </div>


              <div className="profile-item">
                <h3>Institution</h3>
                <p>
                  {profile.Institution || "Not provided"}
                </p>
              </div>


              <div className="profile-item">
                <h3>Field of Study</h3>
                <p>
                  {profile.FieldOfStudy || "Not provided"}
                </p>
              </div>


              <div className="profile-item">
                <h3>Volunteer / Work Experience</h3>
                <p>
                  {profile.VolunteerOrWorkExperience ||
                    "Not provided"}
                </p>
              </div>


              <div className="profile-item">
                <h3>Area of Interest</h3>
                <p>
                  {profile.AreaOfInterest ||
                    "Not provided"}
                </p>
              </div>

            </div>
          )}


          {!loading && !profile && !message && (
            <p>No profile information found.</p>
          )}

        </div>


        <section className="top-right-dashboard">

          <div className="icons">

            <img
              src="/images/icons8-settings-50.png"
              alt="Settings"
            />

            <div>

              <img
                src="/images/icons8-logout-32.png"
                width={50}
                height={50}
                alt="Logout"
              />

            </div>

            <img
              src="/images/icons8-delete-user-50.png"
              alt="Delete account"
            />

          </div>

        </section>

      </section>

      <Footer />
    </>
  );
}
