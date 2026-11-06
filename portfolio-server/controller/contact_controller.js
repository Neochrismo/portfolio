const Contact = require("../model/contact_model");
const { Resend } = require('resend');

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// email regex validator
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const submitContactForm = async (req, res) => {
  try {
    // 1. Extract and trim inputs immediately
    const firstName = typeof req.body.firstName === "string" ? req.body.firstName.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const type = typeof req.body.type === "string" ? req.body.type.trim() : "";
    const comment = typeof req.body.comment === "string" ? req.body.comment.trim() : "";

    // 2. Validate required fields presence
    if (!firstName || !email || !type || !comment) {
      return res.status(400).json({
        type: "error",
        message: "Please fill out all required fields.",
      });
    }

    // 3. Strict security check
    const unsafeRegex = /[<>"`/|]/;
    if (unsafeRegex.test(firstName) || unsafeRegex.test(comment)) {
      return res.status(400).json({
        type: "error",
        message: "Special characters are not allowed. Please use standard text.",
      });
    }

    // 4. Format and length validations
    if (firstName.length > 50) {
      return res.status(400).json({
        type: "error",
        message: "First name is too long (maximum 50 characters).",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        type: "error",
        message: "Please enter a valid email address.",
      });
    }

    if (comment.length < 25 || comment.length > 3000) {
      return res.status(400).json({
        type: "error",
        message: "Your message must be between 25 and 3,000 characters.",
      });
    }

    // 5. Save data to MongoDB
    const newContact = new Contact({
      firstName,
      email,
      type,
      comment,
    });

    await newContact.save();
    console.log("✅ Contact successfully saved to MongoDB!");

    // 6. Send email notification via Resend HTTP API (Port 443 - Render Safe)
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.EMAIL_USER,
      subject: `🚀 New Portfolio Inquiry: ${type} from ${firstName}`,
      text: `You have a new message from your portfolio website!\n\nName: ${firstName}\nEmail: ${email}\nEnquiry Type: ${type}\n\nMessage:\n${comment}`,
    });
    console.log("📧 Email notification sent successfully via Resend!");

    // 7. Success response to frontend
    return res.status(200).json({
      type: "success",
      message: "Thanks for reaching out! Your message has been sent successfully.",
    });

  } catch (error) {
    console.error("❌ Error handling contact submission:", error);

    // Check if it's a Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        type: "error",
        message: messages[0],
      });
    }

    return res.status(500).json({
      type: "error",
      message: "Something went wrong. Please try again later.",
    });
  }
};

module.exports = { submitContactForm };