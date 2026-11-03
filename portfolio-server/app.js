require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contact_routes");
const helmet = require("helmet");

const app = express();

// 1. CRITICAL for Render: Trust the proxy so rate limiting works per user IP
app.set("trust proxy", 1);

// 2. Security headers
app.use(helmet());

// 3. Connect to MongoDB database
connectDB();

// 4. Strict CORS configuration for production & local development
const allowedOrigins = [
  "https://neochrismo.netlify.app", // Your production frontend on Netlify
  "http://localhost:5173",          // Local Vite dev server
  "http://192.168.1.143:5173"       // Local network testing on mobile
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow tools like Postman or server-to-server requests with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("Blocked by CORS policy: Origin not allowed."), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// 5. Parse incoming JSON payloads
app.use(express.json());

// 6. Rate limiter to prevent contact form spam
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 contact requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    type: "error",
    message: "Too many contact submissions from this IP, please try again later.",
  },
});

// Apply rate limiter specifically to the contact route
app.use("/contact", contactLimiter);

// 7. Mount routes
app.use("/", contactRoutes);

module.exports = app;