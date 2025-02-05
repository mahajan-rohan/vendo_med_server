const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  contact: { type: String, required: true },
  availabilityStart: { type: Date, required: true },
  availabilityEnd: { type: Date, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Doctor", doctorSchema);
