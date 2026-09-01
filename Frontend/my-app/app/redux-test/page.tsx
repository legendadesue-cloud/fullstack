"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";

export default function ReduxTest() {
  const profile = useSelector(
    (state: RootState) => state.profile.profile
  );

  return (
    <main>
      <h1>Redux Test</h1>

      <p>Name: {profile.FullName}</p>
      <p>Email: {profile.Email}</p>
      <p>Phone: {profile.PhoneNumber}</p>
      <p>Location: {profile.Location}</p>
      <p>Skills: {profile.Skills}</p>
      <p>Institution: {profile.Institution}</p>
      <p>Qualification: {profile.Qualification}</p>
      <p>Field of Study: {profile.FieldOfStudy}</p>
    </main>
  );
}