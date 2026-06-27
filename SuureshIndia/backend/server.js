const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const { client } = require("./utils/sanityClient");
const { startScheduler } = require("./services/rssScheduler");

const app = express();

// FIX: Include production domain alongside localhost. Update ALLOWED_ORIGINS in .env for production.
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

function isOriginAllowed(origin) {
  if (!origin) return true; // allow server-to-server or curl requests
  if (allowedOrigins.includes(origin)) return true;
  // allow any local development host on localhost or 127.0.0.1
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (isOriginAllowed(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/articles", require("./routes/articles"));
app.use("/api/updates", require("./routes/updates"));
app.use("/api/team", require("./routes/team"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/calendar", require("./routes/calendar"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/files", require("./routes/files"));
app.use("/api/services", require("./routes/services"));
app.use("/api/search", require("./routes/search"));
app.use("/api/org-settings", require("./routes/orgSettings"));
app.use("/api/social-links", require("./routes/socialLinks"));
app.use("/api/legal", require("./routes/legalPages"));
app.use("/api/content", require("./routes/content"));

app.get("/", (req, res) => res.json({ status: "SuureshIndia API is running" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;

async function bootstrapAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@suureshindia.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@1234";

  const existing = await client.fetch(
    '*[_type == "adminUser" && email == $email][0]',
    { email: adminEmail },
  );

  if (existing) {
    console.log(`Admin account verified in Sanity: ${adminEmail}`);
    return;
  }

  const password = await bcrypt.hash(adminPassword, 10);
  await client.create({
    _type: "adminUser",
    email: adminEmail,
    password,
  });
  console.log(`Admin account seeded in Sanity: ${adminEmail}`);
}

async function bootstrap() {
  try {
    await bootstrapAdmin();
  } catch (err) {
    console.error(`Error during admin bootstrapping: ${err.message}`);
    process.exit(1);
  }

  startScheduler(60 * 60 * 1000);

  app.listen(PORT, () => {
    console.log(
      `SuureshIndia Node API Server running on http://localhost:${PORT}`,
    );
  });
}

bootstrap();
