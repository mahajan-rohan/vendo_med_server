const Doctor = require("../models/Doctor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDB = require("../config/db");

// Signup
exports.signupDoctor = async (req, res) => {
  try {
    connectDB();

    const {
      name,
      licenseNumber,
      specialization,
      experience,
      contact,
      availabilityStart,
      availabilityEnd,
      password,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
      name,
      licenseNumber,
      specialization,
      experience,
      contact,
      availabilityStart,
      availabilityEnd,
      password: hashedPassword,
    });

    await newDoctor.save();

    const doctor = new Doctor.find({
      licenseNumber: lisenceNumber,
    }).select("_id");
    console.log("Doctor Registered", doctor);

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Registration successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.loginDoctor = async (req, res) => {
  connectDB();

  try {
    const { licenseNumber, password } = req.body;

    console.log(licenseNumber, password);

    const doctor = await Doctor.findOne({
      licenseNumber: licenseNumber,
    });
    console.log(doctor);

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    console.log(licenseNumber, password);

    // try {
    //   const isPasswordValid = await bcrypt.compare(
    //     password,
    //     doctor[0].password
    //   );
    //   console.log("pass", isPasswordValid);
    // } catch (error) {
    //   console.log("error", error);
    // }

    const isPasswordValid = await bcrypt.compare(password, doctor.password);

    console.log("pass", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(licenseNumber, password);

    console.log("came in", doctor, isPasswordValid);
    console.log(licenseNumber, password);

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("token", token);

    console.log("Doctor logged in");
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch authenticated doctor's details
exports.getDoctorDetails = async (req, res) => {
  connectDB();
  try {
    console.log("got in the controller", req.user.id);

    // Convert string ID to ObjectID
    // const doctorId = mongoose.Types.ObjectId(req.user.id);

    console.log("got in the controller", req.user.id);

    const doctor = await Doctor.findById(req.user.id).select("-password"); // Exclude password from response

    console.log("got in the controller");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    console.log("got in the controller");
    res.status(200).json(doctor);
  } catch (error) {
    console.log("errror");

    res.status(500).json({ error: error.message });
  }
};

// Update doctor's details
exports.updateDoctorDetails = async (req, res) => {
  connectDB();
  try {
    const { name, specialization, licenseNumber } = req.body;

    // Validate input data as necessary

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      { name, specialization, licenseNumber },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const token = jwt.sign({ id: updatedDoctor._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
