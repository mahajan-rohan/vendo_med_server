const express = require("express");
const {
  createConsultation,
  getDoctorConsultations,
} = require("../controllers/consultationController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new consultation record
router.post("/", authenticate, createConsultation);

// Get consultations for a specific doctor
router.get("/doctor/:ln", authenticate, getDoctorConsultations);

module.exports = router;
