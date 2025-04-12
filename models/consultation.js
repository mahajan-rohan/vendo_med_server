const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  licenseNumber: { type: String, required: true },
  // patientId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Patient",
  //   required: true,
  // },
  patientName: { type: String, required: true },
  diagnosis: { type: String, default: "" },
  prescription: {
    type: [
      {
        name: String,
        quantity: Number,
      },
    ],
    default: [],
  },
  symptoms: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Consultation", consultationSchema);
