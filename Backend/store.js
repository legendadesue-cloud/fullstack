const express = require("express");
const cors = require("cors");//re_j1arTRDx_BMxAZEfbXfdqJ7ZvWdWqchLN
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const redoc = require("redoc-express");

require("dotenv").config();
//re_j1arTRDx_BMxAZEfbXfdqJ7ZvWdWqchLN
const app = express();

const PORT = process.env.PORT || 4000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// DATABASE
// ========================================

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: false,
});

pool
  .connect()
  .then((client) => {
    console.log("PostgreSQL connected successfully");
    client.release();
  })
  .catch((error) => {
    console.error("PostgreSQL connection error:", error);
  });

// ========================================
// CLOUDINARY
// ========================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ========================================
// MULTER
// ========================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// ========================================
// SWAGGER
// ========================================

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.get(
  "/api-docs/redoc",
  redoc({
    title: "ARMSLENGTH API Documentation",
    specUrl: "/swagger.json",
  })
);

app.get("/swagger.json", (req, res) => {
  res.json(swaggerDocument);
});

// ========================================
// ROOT
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ARMSLENGTH backend is running",
    port: PORT,
  });
});

// ========================================
// VOLUNTEER LOGIN
// ========================================

app.post("/loginvolunteer", async (req, res) => {
  const { Email, Password } = req.body;

  console.log("=================================");
  console.log("LOGIN REQUEST RECEIVED");
  console.log("Email:", Email);
  console.log("=================================");

  if (!Email || !Password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required",
    });
  }

  try {
    // IMPORTANT:
    // Your profile INSERT uses `email`, not `"Email"`.
    const result = await pool.query(
      `
      SELECT
        id,
        "FullName" AS fullName,
        "Email" AS email,
        password_hash,
        skills,
        "Institution" AS institution,
        qualification,
        "FieldOfStudy" AS field_of_study,
        "VolunteerOrWorkExperience" AS volunteer_or_work_experience,
        "AreaOfInterest" AS   area_of_interest
      FROM profiles
      WHERE "Email" = $1
      LIMIT 1
      `,
      [Email.trim()]
    );

    if (result.rows.length === 0) {
      console.log("Volunteer not found:", Email);

      return res.status(401).json({
        success: false,
        error: "Volunteer not found",
      });
    }

    const user = result.rows[0];

    console.log("USER FOUND:", {
      id: user.id,
      FullName: user.FullName,
      Email: user.Email,
    });

    if (!user.password_hash) {
      return res.status(500).json({
        success: false,
        error: "No password hash exists for this account",
      });
    }

    const passwordMatch = await bcrypt.compare(
      Password,
      user.password_hash
    );

    if (!passwordMatch) {
      console.log("Incorrect password");

      return res.status(401).json({
        success: false,
        error: "Incorrect password",
      });
    }

    console.log("LOGIN SUCCESSFUL:", user.Email);

    return res.status(200).json({
      success: true,
      message: "Login successful",

      user: {
        id: user.id,
        FullName: user.FullName,
        Email: user.Email,
        Skills: user.skills,
        Institution: user.Institution,
        Qualification: user.qualification,
        FieldOfStudy: user.FieldOfStudy,
        VolunteerOrWorkExperience:
          user.VolunteerOrWorkExperience,
        AreaOfInterest: user.AreaOfInterest,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Server error",
      details: error.message,
    });
  }
});

// ========================================
// GET SINGLE EVENT
// ========================================

app.get("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM events
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET EVENT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch event",
    });
  }
});

// ========================================
// UPLOAD EVENT IMAGE
// ========================================

app.post(
  "/api/events/upload-image",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No image uploaded",
        });
      }

      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        console.error(
          "Cloudinary environment variables are missing."
        );

        return res.status(500).json({
          message: "Cloudinary configuration is missing",
        });
      }

      const result = await new Promise(
        (resolve, reject) => {
          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder: "armslength/events",
                resource_type: "image",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );

          stream.end(req.file.buffer);
        }
      );

      console.log(
        "Cloudinary upload:",
        result.secure_url
      );

      res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("CLOUDINARY ERROR:", error);

      res.status(500).json({
        message: "Image upload failed",
      });
    }
  }
);

// ========================================
// CREATE EVENT
// ========================================

app.post("/api/events", async (req, res) => {
  try {
    const {
      name,
      organization,
      category,
      eventDate,
      location,
      startTime,
      endTime,
      capacity,
      registrationDeadline,
      description,
      imageUrl,
    } = req.body;

    if (
      !name ||
      !organization ||
      !category ||
      !eventDate ||
      !location ||
      !startTime ||
      !endTime ||
      !capacity
    ) {
      return res.status(400).json({
        message:
          "Please provide all required event fields",
      });
    }

    const numericCapacity = Number(capacity);

    if (
      Number.isNaN(numericCapacity) ||
      numericCapacity <= 0
    ) {
      return res.status(400).json({
        message: "Capacity must be greater than 0",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO events (
        name,
        organization,
        category,
        event_date,
        location,
        start_time,
        end_time,
        capacity,
        registration_deadline,
        description,
        image_url,
        status
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        'Pending'
      )
      RETURNING *
      `,
      [
        name,
        organization,
        category,
        eventDate,
        location,
        startTime,
        endTime,
        numericCapacity,
        registrationDeadline || null,
        description || null,
        imageUrl || null,
      ]
    );

    res.status(201).json({
      message: "Event created successfully",
      event: result.rows[0],
    });
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);

    res.status(500).json({
      message: "Failed to create event",
      error: error.message,
    });
  }
});

// ========================================
// UPDATE EVENT
// ========================================

app.put("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      organization,
      category,
      eventDate,
      location,
      startTime,
      endTime,
      capacity,
      registrationDeadline,
      description,
      imageUrl,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE events
      SET
        name = $1,
        organization = $2,
        category = $3,
        event_date = $4,
        location = $5,
        start_time = $6,
        end_time = $7,
        capacity = $8,
        registration_deadline = $9,
        description = $10,
        image_url = $11
      WHERE id = $12
      RETURNING *
      `,
      [
        name,
        organization,
        category,
        eventDate,
        location,
        startTime,
        endTime,
        capacity,
        registrationDeadline || null,
        description || null,
        imageUrl || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.json({
      message: "Event updated successfully",
      event: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);

    res.status(500).json({
      message: "Failed to update event",
      error: error.message,
    });
  }
});

// ========================================
// APPROVE EVENT
// ========================================

app.patch(
  "/api/events/:id/approve",
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `
        UPDATE events
        SET status = 'Approved'
        WHERE id = $1
        RETURNING *
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Event not found",
        });
      }

      res.json({
        message: "Event approved successfully",
        event: result.rows[0],
      });
    } catch (error) {
      console.error("APPROVE EVENT ERROR:", error);

      res.status(500).json({
        message: "Failed to approve event",
        error: error.message,
      });
    }
  }
);

// ========================================
// DELETE EVENT
// ========================================

app.delete("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM events
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.json({
      message: "Event deleted successfully",
      event: result.rows[0],
    });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);

    res.status(500).json({
      message: "Failed to delete event",
    });
  }
});

// ========================================
// CREATE PROFILE
// ========================================

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

    if (!FullName || !Email || !Password) {
      return res.status(400).json({
        success: false,
        error:
          "Full name, email and password are required",
      });
    }

    const existingUser = await pool.query(
      `
      SELECT id
      FROM profiles
      WHERE email = $1
      LIMIT 1
      `,
      [Email.trim()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(
      Password,
      10
    );

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
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13
      )
      RETURNING
        id,
        "fullName",
        email,
        phone_number,
        date_of_birth,
        location,
        skills,
        institution,
        qualification,
        field_of_study,
        graduation_year,
        volunteer_or_work_experience,
        area_of_interest;
    `;

    const values = [
      FullName,
      Email.trim(),
      passwordHash,
      PhoneNumber || null,
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

    const result = await pool.query(
      insertQuery,
      values
    );

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile: result.rows[0],
    });
  } catch (error) {
    console.error(
      "PROFILE CREATION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========================================
// GET MOST RECENT PROFILE
// ========================================

app.get("/profile", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        "fullName" AS "FullName",
        email AS "Email",
        phone_number AS "PhoneNumber",
        date_of_birth AS "DateOfBirth",
        location AS "Location",
        skills AS "Skills",
        institution AS "Institution",
        qualification AS "Qualification",
        field_of_study AS "FieldOfStudy",
        graduation_year AS "GraduationYear",
        volunteer_or_work_experience
          AS "VolunteerOrWorkExperience",
        area_of_interest AS "AreaOfInterest"
      FROM profiles
      ORDER BY id DESC
      LIMIT 1;
    `);

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
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========================================
// GET PROFILE BY ID
// ========================================

app.get("/profile/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        "fullName" AS "FullName",
        email AS "Email",
        phone_number AS "PhoneNumber",
        date_of_birth AS "DateOfBirth",
        location AS "Location",
        skills AS "Skills",
        institution AS "Institution",
        qualification AS "Qualification",
        field_of_study AS "FieldOfStudy",
        graduation_year AS "GraduationYear",
        volunteer_or_work_experience
          AS "VolunteerOrWorkExperience",
        area_of_interest AS "AreaOfInterest"
      FROM profiles
      WHERE id = $1;
      `,
      [id]
    );

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
  } catch (error) {
    console.error("PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========================================
// UPDATE PROFILE
// ========================================

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
  } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE profiles
      SET
        "fullName" = $1,
        phone_number = $2,
        email = $3,
        date_of_birth = $4,
        location = $5,
        skills = $6,
        institution = $7,
        qualification = $8,
        field_of_study = $9,
        graduation_year = $10,
        volunteer_or_work_experience = $11,
        area_of_interest = $12
      WHERE id = $13
      RETURNING
        id,
        "fullName" AS "FullName",
        email AS "Email",
        phone_number AS "PhoneNumber",
        date_of_birth AS "DateOfBirth",
        location AS "Location",
        skills AS "Skills",
        institution AS "Institution",
        qualification AS "Qualification",
        field_of_study AS "FieldOfStudy",
        graduation_year AS "GraduationYear",
        volunteer_or_work_experience
          AS "VolunteerOrWorkExperience",
        area_of_interest AS "AreaOfInterest";
      `,
      [
        FullName,
        PhoneNumber,
        Email,
        DateOfBirth || null,
        Location || null,
        Skills || null,
        Institution || null,
        Qualification || null,
        FieldOfStudy || null,
        GraduationYear || null,
        VolunteerOrWorkExperience || null,
        AreaOfInterest || null,
        id,
      ]
    );

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
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========================================
// PATCH PROFILE
// ========================================

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
  } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE profiles
      SET
        "fullName" = $1,
        phone_number = $2,
        email = $3,
        date_of_birth = $4,
        location = $5,
        skills = $6,
        institution = $7,
        qualification = $8,
        field_of_study = $9,
        graduation_year = $10,
        volunteer_or_work_experience = $11,
        area_of_interest = $12
      WHERE id = $13
      RETURNING
        id,
        "fullName" AS "FullName",
        email AS "Email",
        phone_number AS "PhoneNumber",
        date_of_birth AS "DateOfBirth",
        location AS "Location",
        skills AS "Skills",
        institution AS "Institution",
        qualification AS "Qualification",
        field_of_study AS "FieldOfStudy",
        graduation_year AS "GraduationYear",
        volunteer_or_work_experience
          AS "VolunteerOrWorkExperience",
        area_of_interest AS "AreaOfInterest";
      `,
      [
        FullName,
        PhoneNumber,
        Email,
        DateOfBirth || null,
        Location || null,
        Skills || null,
        Institution || null,
        Qualification || null,
        FieldOfStudy || null,
        GraduationYear || null,
        VolunteerOrWorkExperience || null,
        AreaOfInterest || null,
        id,
      ]
    );

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
  } catch (error) {
    console.error("PATCH PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========================================
// DELETE PROFILE
// ========================================

app.delete("/profile/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM profiles
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

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
  } catch (error) {
    console.error("DELETE PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========================================
// OTHER ROUTES
// ========================================

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

app.options("/events", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Events updated successfully",
  });
});

// ========================================
// MULTER ERROR HANDLER
// ========================================

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message:
          "Image is too large. Maximum size is 5MB.",
      });
    }

    return res.status(400).json({
      message: error.message,
    });
  }

  if (
    error &&
    error.message === "Only image files are allowed"
  ) {
    return res.status(400).json({
      message: error.message,
    });
  }

  console.error("UNHANDLED ERROR:", error);

  res.status(500).json({
    message: "Internal server error",
  });
});

// ========================================
// 404
// ========================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// ========================================
// SERVER
// ========================================

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}`
  );
});