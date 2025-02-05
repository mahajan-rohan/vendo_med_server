const { body, validationResult } = require("express-validator");

exports.validateDoctorSignup = [
  body("name").notEmpty().withMessage("Name is required"),
  body("licenseNumber").notEmpty().withMessage("License number is required"),
  body("specialization").notEmpty().withMessage("Specialization is required"),
  body("experience")
    .isInt({ min: 0 })
    .withMessage("Experience must be a positive number"),
  body("contact").notEmpty().withMessage("Contact is required"),
  body("availabilityStart")
    .notEmpty()
    .withMessage("Availability start is required"),
  body("availabilityEnd")
    .notEmpty()
    .withMessage("Availability end is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
