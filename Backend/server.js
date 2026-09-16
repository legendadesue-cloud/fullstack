const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const { Resend } = require("resend");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const redoc = require("redoc-express");

require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);


// ========================================
// OTP STORAGE
// ========================================

const otpStore = new Map();

const app = express();

const PORT = process.env.PORT || 4000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

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

// Test database connection
pool.connect()
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
  res.json({
    message: "ARMSLENGTH Events Backend is running",
  });
});

// ========================================
// DATABASE TEST
// ========================================

app.get("/database", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected successfully",
      time: result.rows[0],
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// ======================================================
//                    VOLUNTEER LOGIN
// ======================================================

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
// SEND OTP
// ========================================
app.post("/send-otp", async (req, res) => {
  const { Email } = req.body;

  console.log("=================================");
  console.log("SEND OTP REQUEST");
  console.log("Email:", Email);
  console.log("=================================");

  if (!Email || !Email.trim()) {
    return res.status(400).json({
      success: false,
      error: "Email is required",
    });
  }

  const email = Email.trim().toLowerCase();

  try {
    const result = await pool.query(
      `
      SELECT id, "FullName", "Email"
      FROM profiles
      WHERE LOWER("Email") = $1
      LIMIT 1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No volunteer account found with this email",
      });
    }

    const user = result.rows[0];

    const OTP = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore.set(email, {
      otp: OTP,
      userId: user.id,
      expiresAt,
    });

    console.log("OTP generated for:", email);

    const { data, error } = await resend.emails.send({
      from: "ARMSLENGTH <noreply@armslength.com.ng>",
      to: [email],
      subject: "ARMSLENGTH Login OTP",

      text: `
Hello ${user.FullName},

Your ARMSLENGTH login OTP is:

${OTP}

This OTP is valid for 10 minutes.

If you did not request this OTP, please ignore this email.

ARMSLENGTH
      `,

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
          <h2>ARMSLENGTH Login</h2>

          <p>Hello ${user.FullName},</p>

          <p>Your ARMSLENGTH login OTP is:</p>

          <h1 style="letter-spacing: 8px; font-size: 32px;">
            ${OTP}
          </h1>

          <p>
            This OTP is valid for
            <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not request this OTP,
            you can safely ignore this email.
          </p>

          <p>ARMSLENGTH</p>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);

      return res.status(500).json({
        success: false,
        error: "Failed to send OTP",
        details: error.message,
      });
    }

    console.log("OTP EMAIL SENT:", data);

    return res.status(200).json({
      success: true,
      message: "OTP has been sent to your email",
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to send OTP",
      details: error.message,
    });
  }
});


// ========================================
// VERIFY OTP
// ========================================

app.post("/verify-otp", async (req, res) => {
  const { Email, OTP } = req.body;

  console.log("=================================");
  console.log("VERIFY OTP REQUEST");
  console.log("Email:", Email);
  console.log("OTP:", OTP);
  console.log("=================================");

  if (!Email || !OTP) {
    return res.status(400).json({
      success: false,
      error: "Email and OTP are required",
    });
  }

  const email = Email.trim().toLowerCase();
  const otp = OTP.trim();

  try {
    const storedOTP = otpStore.get(email);

    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        error: "No OTP found. Please request a new OTP.",
      });
    }

    if (Date.now() > storedOTP.expiresAt) {
      otpStore.delete(email);

      return res.status(400).json({
        success: false,
        error: "OTP has expired. Please request a new OTP.",
      });
    }

    if (storedOTP.otp !== otp) {
      return res.status(401).json({
        success: false,
        error: "Invalid OTP",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        "FullName" AS fullName,
        "Email" AS email,
        skills,
        "Institution" AS institution,
        qualification,
        "FieldOfStudy" AS field_of_study,
        "VolunteerOrWorkExperience" AS volunteer_or_work_experience,
        "AreaOfInterest" AS area_of_interest
      FROM profiles
      WHERE id = $1
      LIMIT 1
      `,
      [storedOTP.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Volunteer profile not found",
      });
    }

    const user = result.rows[0];

    otpStore.delete(email);

    console.log("OTP VERIFIED:", email);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",

      user: {
        id: user.id,
        FullName: user.fullname,
        Email: user.email,
        Skills: user.skills,
        Institution: user.institution,
        Qualification: user.qualification,
        FieldOfStudy: user.field_of_study,
        VolunteerOrWorkExperience:
          user.volunteer_or_work_experience,
        AreaOfInterest: user.area_of_interest,
      },
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Server error",
      details: error.message,
    });
  }
});// ========================================
// GET ALL EVENTS
// ========================================

app.get("/api/events", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        organization,
        category,
        event_date,
        location,
        start_time,
        end_time,
        capacity,
        volunteers,
        registration_deadline,
        description,
        image_url,
        status,
        created_at
      FROM events
      ORDER BY event_date ASC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch events",
      error: error.message,
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
      error: error.message,
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
        error: error.message,
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

    const numericCapacity = Number(capacity);

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
        numericCapacity,
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
      console.error(
        "APPROVE EVENT ERROR:",
        error
      );

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
      error: error.message,
    });
  }
});

app.post("/api/events/:id/register", async (req, res) => {
  try {
    const { id } = req.params;

    const eventResult = await pool.query(
      `SELECT id, name, capacity, volunteers, registration_deadline, status
       FROM events
       WHERE id = $1`,
      [id]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    const event = eventResult.rows[0];

    if (event.status !== "Approved") {
      return res.status(400).json({
        success: false,
        error: "This event is not open for registration",
      });
    }

    if (
      event.registration_deadline &&
      new Date(event.registration_deadline) < new Date()
    ) {
      return res.status(400).json({
        success: false,
        error: "Registration deadline has passed",
      });
    }

    if (
      event.capacity !== null &&
      event.volunteers >= event.capacity
    ) {
      return res.status(400).json({
        success: false,
        error: "This event is full",
      });
    }

    const updatedEvent = await pool.query(
      `UPDATE events
       SET volunteers = COALESCE(volunteers, 0) + 1
       WHERE id = $1
       RETURNING id, name, capacity, volunteers`,
      [id]
    );

    res.json({
      success: true,
      message: "Successfully registered for the event",
      event: updatedEvent.rows[0],
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to register for event",
      details: error.message,
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

    if (!Password) {
      return res.status(400).json({
        error: "Password is required",
      });
    }

    const passwordHash = await bcrypt.hash(Password, 10);

    const insertQuery = `
      INSERT INTO public.profiles (
        "FullName",
        "Email",
        password_hash,
        skills,
        phone_number,
        date_of_birth,
        location,
        "Institution",
        qualification,
        "FieldOfStudy",
        graduation_year,
        "VolunteerOrWorkExperience",
        "AreaOfInterest"
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13
      )
      RETURNING
        id,
        "FullName",
        "Email",
        skills,
        phone_number,
        date_of_birth,
        location,
        "Institution",
        qualification,
        "FieldOfStudy",
        graduation_year,
        "VolunteerOrWorkExperience",
        "AreaOfInterest";
    `;

    const values = [
      FullName,
      Email,
      passwordHash,
      Skills || null,
      PhoneNumber || null,
      DateOfBirth || null,
      Location || null,
      Institution || null,
      Qualification || null,
      FieldOfStudy || null,
      GraduationYear || null,
      VolunteerOrWorkExperience || null,
      AreaOfInterest || null,
    ];

    const result = await pool.query(insertQuery, values);

    return res.status(201).json({
      message: "Profile created successfully",
      profile: result.rows[0],
    });

  } catch (error) {
    console.log("Profile creation error:", error.message);

    return res.status(500).json({
      error: error.message,
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

app.use(
  (error, req, res, next) => {
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
      error.message ===
        "Only image files are allowed"
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error(
      "UNHANDLED ERROR:",
      error
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
);

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
    `ARMSLENGTH backend running on http://localhost:${PORT}`
  );
});