const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const redoc = require("redoc-express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// swagger: http://localhost:4000/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/api-docs/redoc", redoc({
  title: "ARMSLENGTH API Documentation",
  specUrl: "/swagger.json"
}));

app.get("/swagger.json", (req, res) => {
  res.json(swaggerDocument);
});

app.get("/database", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected successfully",
      time: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .connect()
  .then((client) => {
    console.log("PostgreSQL connected");
    client.release();
  })
  .catch((err) => {
    console.error("PostgreSQL connection error:", err);
  });

  app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the ArmsLength Volunteer Platform",
  });
});

app.post("/loginvolunteer", async (req, res) => {
  const { FullName, Password } = req.body;

  // Check that both fields were provided
  if (!FullName || !Password) {
    return res.status(400).json({
      error: "Name and password are required",
    });
  }

  try {
    // Find the volunteer by their full name
    const result = await pool.query(
      `SELECT * 
       FROM profiles 
       WHERE "FullName" = $1 
       LIMIT 1`,
      [FullName]
    );

    // No volunteer found
    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Volunteer not found",
      });
    }

    // Get the volunteer from PostgreSQL
    const user = result.rows[0];

    console.log("USER FOUND:", user);

    // Compare the password entered during login
    // with the hashed password stored in PostgreSQL
    const passwordMatch = await bcrypt.compare(
      Password,
      user.password_hash
    );

    // Password is incorrect
    if (!passwordMatch) {
      return res.status(401).json({
        error: "Incorrect password",
      });
    }

    // Login successful
    return res.status(200).json({
      success: true,
      message: "Login successful",

      // Send the information needed by the frontend
      user: {
        id: user.id,
        FullName: user.FullName,
        Email: user.Email,
      },
    });

  } catch (err) {

    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
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

const events = [];

app.options("/events", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Events updated successfully",
  });
});



app.post("/profile", async (req, res) => {
  try {
    const {
      FullName,
      Email,
      Password,
      PhoneNumber,
      DateOfBirth,
      Location,
      Skills,
      Institution,
      Qualification,
      FieldOfStudy,
      GraduationYear,
      VolunteerOrWorkExperience,
      AreaOfInterest,
    } = req.body;

    if (!Password) {
      return res.status(400).json({
        error: "Password is required",
      });
    }

    const passwordHash = await bcrypt.hash(Password, 10);

    const insertQuery = `
  INSERT INTO public.profiles (
    "fullName",
    email,
    password_hash,
    phone_number,
    date_of_birth,
    location,
    skills,
    institution,
    qualification,
    field_of_study,
    graduation_year,
    volunteer_or_work_experience,
    area_of_interest
  )
  VALUES (
    $1, $2, $3, $4, $5, $6, $7,
    $8, $9, $10, $11, $12, $13
  )
  RETURNING id, "fullName", email, area_of_interest, skills, institution, qualification, field_of_study, volunteer_or_work_experience;
`;
    const values = [
      FullName,
      Email,
      passwordHash,
      PhoneNumber,
      DateOfBirth || null,
      Location || null,
      Skills || null,
      Institution || null,
      Qualification || null,
      FieldOfStudy || null,
      GraduationYear || null,
      VolunteerOrWorkExperience || null,
      AreaOfInterest || null,
    ];

    const result = await pool.query(insertQuery, values);

    res.status(201).json({
      message: "Profile created successfully",
      profile: result.rows[0],
    });
  } catch (error) {
    console.log("Profile creation error:", error.message);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/profile", async (req, res) => {
  const fetchQuery = `
    SELECT *
    FROM profiles
    ORDER BY id DESC
    LIMIT 1;
  `;

  try {
    const result = await pool.query(fetchQuery);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No profile found",
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

app.get("/profile/:id", async (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT
      id,
      "FullName" AS "FullName",
      "Email" AS "Email",
      "phone_number" AS "PhoneNumber",
      "date_of_birth" AS "DateOfBirth",
      "location" AS "Location",
      "skills" AS "Skills",
      "Institution" AS "Institution",
      "qualification" AS "Qualification",
      "FieldOfStudy" AS "FieldOfStudy",
      "graduation_year" AS "GraduationYear",
      "VolunteerOrWorkExperience" AS "VolunteerOrWorkExperience",
      "AreaOfInterest" AS "AreaOfInterest"
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
    console.error("PROFILE ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.put("/profile/:id", async (req, res) => {
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
    UPDATE profile
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

app.patch("/profile/:id", async (req, res) => {
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


app.delete("/profile/:id", async (req, res) => {
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



app.listen(4000, () => {
  console.log("Server is running on port 4000");
});