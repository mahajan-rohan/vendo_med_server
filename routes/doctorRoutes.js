const express = require("express");
const {
  signupDoctor,
  loginDoctor,
  getDoctorDetails,
  updateDoctorDetails,
} = require("../controllers/doctorController.js");
const { validateDoctorSignup } = require("../middleware/validateDoctor");
const { authenticate } = require("../middleware/authMiddleware"); // Ensure you have this middleware

const router = express.Router();

router.post("/signup", validateDoctorSignup, signupDoctor);
router.post("/login", loginDoctor);

// Protected routes
router.get("/me", authenticate, getDoctorDetails); // Get authenticated doctor's details
router.put("/update", authenticate, updateDoctorDetails); // Update authenticated doctor's details

module.exports = router;
