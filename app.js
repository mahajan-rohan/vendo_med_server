const express = require("express");
const cors = require("cors");
const { exec } = require("child_process"); // ✨ Added
const patientRoutes = require("./routes/patientRoutes");
const vendingMachineRoutes = require("./routes/vendingMachineRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const consultationRoutes = require("./routes/consultationRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// API routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/machines", vendingMachineRoutes);
app.use("/api/consultations", consultationRoutes);

module.exports = app;
