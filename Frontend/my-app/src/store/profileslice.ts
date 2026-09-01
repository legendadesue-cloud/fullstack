import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Profile {
  FullName: string;
  PhoneNumber: string;
  Email: string;
  DateOfBirth: string;
  Location: string;
  Skills: string;
  Institution: string;
  Qualification: string;
  FieldOfStudy: string;
  GraduationYear: string;
  VolunteerOrWorkExperience: string;
  AreaOfInterest: string;
}

export interface LoggedInUser {
  id: number | string;
  FullName: string;
  Email: string;
}

interface ProfileState {
  profile: Profile;
  user: LoggedInUser | null;
  loading: boolean;
  message: string;
}

const initialProfile: Profile = {
  FullName: "",
  PhoneNumber: "",
  Email: "",
  DateOfBirth: "",
  Location: "",
  Skills: "",
  Institution: "",
  Qualification: "",
  FieldOfStudy: "",
  GraduationYear: "",
  VolunteerOrWorkExperience: "",
  AreaOfInterest: "",
};

const initialState: ProfileState = {
  profile: initialProfile,
  user: null,
  loading: false,
  message: "",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,

  reducers: {
    // Updates an individual profile field
    updateProfile: (
      state,
      action: PayloadAction<{
        name: keyof Profile;
        value: string;
      }>
    ) => {
      state.profile[action.payload.name] = action.payload.value;
    },

    // Stores the complete profile
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },

    // Stores information received after login
    setUser: (state, action: PayloadAction<LoggedInUser>) => {
      state.user = action.payload;
    },

    // Clears the logged-in user
    clearUser: (state) => {
      state.user = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },

    // Clears everything when logging out
    clearProfile: (state) => {
      state.profile = initialProfile;
      state.user = null;
      state.message = "";
      state.loading = false;
    },
  },
});

export const {
  updateProfile,
  setProfile,
  setUser,
  clearUser,
  setLoading,
  setMessage,
  clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;