require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contact_routes");
const helmet = require("helmet");

// 1. Import your AI Controller
const { handleAiStream } = require("./controller/ai_controller");

const app = express();

// Trust the proxy so rate limiting works per user IP
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// Connect to MongoDB database
connectDB();

// Strict CORS configuration for production & local development
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

// 6. Rate limiter to prevent contact form spam (UNTOUCHED)
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

// Separate rate limiter for the AI Assistant (higher limit for chatting)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 chat messages per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    type: "error",
    message: "Too many chat messages, please try again in a few minutes.",
  },
});

// Apply rate limiters
app.use("/contact", contactLimiter);
app.use("/api/ai-chat", aiLimiter);

// 7. Mount routes
app.use("/", contactRoutes);

// Mount AI route endpoint
app.post("/api/ai-chat", handleAiStream);

module.exports = app;