const express = require("express");
const {
  createPatient,
  getPatients,
} = require("../controllers/patientController");

const router = express.Router();

router.route("/").post(createPatient).get(getPatients);

module.exports = router;
