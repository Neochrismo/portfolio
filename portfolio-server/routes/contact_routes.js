const express = require("express");
const { submitContactForm } = require("../controller/contact_controller");

const router = express.Router();

router.post("/contact", submitContactForm);

module.exports = router;