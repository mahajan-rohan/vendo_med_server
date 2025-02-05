const express = require("express");
const cors = require("cors");
const patientRoutes = require("./routes/patientRoutes");
const vendingMachineRoutes = require("./routes/vendingMachineRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials if needed
  })
);
app.use(express.json());

// API routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/machines", vendingMachineRoutes);

module.exports = app;
