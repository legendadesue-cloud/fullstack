// =========================
// API ROUTE
// =========================

app.get("/api", (req, res) => {
  res.status(200).json({
    home: "Home Page",
    volunteer: "Volunteer Page",
    profile: "Profile Page",
  });
});

// =========================
// VOLUNTEER ROUTES
// =========================

app.get("/volunteerpage", (req, res) => {
  res.status(200).json({
    message: "Welcome to the ArmsLength Volunteer Platform",
  });
});

app.get("/volunteer", (req, res) => {
  res.status(200).json({
    message: "Volunteer Opportunities Page",
  });
});

app.get("/organizations", (req, res) => {
  res.status(200).json({
    message: "Organizations Page",
  });
});

// =========================
// EVENTS
// =========================

// POST = create a new event
app.post("/events", (req, res) => {
  events.push(req.body);

  res.status(201).json({
    message: "Event created successfully",
    event: req.body,
  });
});

// PUT = update events
app.put("/events", (req, res) => {
  res.status(200).json({
    message: "Events updated",
  });
});

// GET = retrieve events
app.get("/events", (req, res) => {
  res.status(200).json({
    events: events,
  });
});


// POST = create profile

app.get("/api", (req, res) => {
  res.json({
    home: "Home Page",
    volunteer: "Volunteer Page",
    profile: "Profile Page",
  });
});

app.get("/volunteerpage", (req, res) => {
  res.status(200).json({
    message: "Welcome to the ArmsLength Volunteer Platform",
  });
});



app.post("/profile", async (req, res) => {
  const {
    FullName,
    PhoneNumber,
    Email,
    DateOfBirth,
    Location,
    Skills,
    Institution,
    Qualification,
    FieldOfStudy,
    GraduationYear,
    VolunteerOrWorkExperience,
    AreaOfInterest,
    CVResume,
  } = req.body;

  const insertQuery = `
    INSERT INTO profiles (
      fullname,
      phonenumber,
      email,
      dateofbirth,
      location,
      skills,
      institution,
      qualification,
      fieldofstudy,
      graduationyear,
      volunteerorworkexperience,
      areaofinterest,
      cvresume
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13
    )
    RETURNING *;
  `;

  try {
    const result = await pool.query(insertQuery, [
      FullName,
      PhoneNumber,
      Email,
      DateOfBirth,
      Location,
      Skills,
      Institution,
      Qualification,
      FieldOfStudy,
      GraduationYear,
      VolunteerOrWorkExperience,
      AreaOfInterest,
      CVResume,
    ]);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile: result.rows[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.get("/profiles", async (req, res) => {
  const fetchQuery = `
    SELECT *
    FROM profiles
    ORDER BY id DESC;
  `;

  try {
    const result = await pool.query(fetchQuery);

    res.status(200).json({
      success: true,
      profiles: result.rows,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.get("/profiles/:id", async (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT *
    FROM profiles
    WHERE id = $1;
  `;

  try {
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile: result.rows[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.put("/profiles/:id", async (req, res) => {
  const { id } = req.params;

  const {
    FullName,
    PhoneNumber,
    Email,
    DateOfBirth,
    Location,
    Skills,
    Institution,
    Qualification,
    FieldOfStudy,
    GraduationYear,
    VolunteerOrWorkExperience,
    AreaOfInterest,
    CVResume,
  } = req.body;

  const updateQuery = `
    UPDATE profiles
    SET
      fullname = $1,
      phonenumber = $2,
      email = $3,
      dateofbirth = $4,
      location = $5,
      skills = $6,
      institution = $7,
      qualification = $8,
      fieldofstudy = $9,
      graduationyear = $10,
      volunteerorworkexperience = $11,
      areaofinterest = $12,
      cvresume = $13
    WHERE id = $14
    RETURNING *;
  `;

  try {
    const result = await pool.query(updateQuery, [
      FullName,
      PhoneNumber,
      Email,
      DateOfBirth,
      Location,
      Skills,
      Institution,
      Qualification,
      FieldOfStudy,
      GraduationYear,
      VolunteerOrWorkExperience,
      AreaOfInterest,
      CVResume,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: result.rows[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.patch("/profiles/:id", async (req, res) => {
  const { id } = req.params;

  const {
    FullName,
    PhoneNumber,
    Email,
    DateOfBirth,
    Location,
    Skills,
    Institution,
    Qualification,
    FieldOfStudy,
    GraduationYear,
    VolunteerOrWorkExperience,
    AreaOfInterest,
    CVResume,
  } = req.body;

  const updateQuery = `
    UPDATE profiles
    SET
      fullname = $1,
      phonenumber = $2,
      email = $3,
      dateofbirth = $4,
      location = $5,
      skills = $6,
      institution = $7,
      qualification = $8,
      fieldofstudy = $9,
      graduationyear = $10,
      volunteerorworkexperience = $11,
      areaofinterest = $12,
      cvresume = $13
    WHERE id = $14
    RETURNING *;
  `;

  try {
    const result = await pool.query(updateQuery, [
      FullName,
      PhoneNumber,
      Email,
      DateOfBirth,
      Location,
      Skills,
      Institution,
      Qualification,
      FieldOfStudy,
      GraduationYear,
      VolunteerOrWorkExperience,
      AreaOfInterest,
      CVResume,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: result.rows[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.delete("/profiles/:id", async (req, res) => {
  const { id } = req.params;

  const deleteQuery = `
    DELETE FROM profiles
    WHERE id = $1
    RETURNING *;
  `;

  try {
    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
      deletedProfile: result.rows[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import profileReducer from "@/src/store/profileslice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//LOGING MIDDLEWARE
"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setUser } from "@/src/store/profileslice";
import type { AppDispatch } from "@/src/store/store";
import { useRouter } from "next/navigation";

export default function Home() {
  const [FullName, setFullName] = useState("");
  const [Password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();


  const handleLogin = async () => {
  const response = await fetch("http://localhost:4000/loginvolunteer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      FullName,
      Password,
    }),
  });
  const data = await response.json();
if (response.ok) {
  window.location.href = "/volunteerdashboard";
} else {
  alert(data.error);
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
              <label htmlFor="FullName">NAME</label>
              <input
                type="text"
                id="FullName"
                name="FullName"
                value={FullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="PassWord">Password</label>
              <input
                type="password"
                id="Password"
                name="Password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </fieldset>
          <button className="login-button" onClick={handleLogin}>
             Login as Volunteer
          </button>
          <button className="login-button">
            <Link href="/profile">Don't have an account? Get one now </Link>
          </button>
        </div>
      </section>
          </>
  );  
}
//john doe
//Test1234!