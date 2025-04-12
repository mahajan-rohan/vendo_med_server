const Consultation = require("../models/consultation");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

// Create a new consultation record
exports.createConsultation = async (req, res) => {
  try {
    const {
      doctorId,
      licenseNumber,
      // patientId,
      patientName,
      diagnosis,
      prescription,
      symptoms,
    } = req.body;

    console.log({
      doctorId,
      licenseNumber,
      // patientId,
      patientName,
      diagnosis,
      prescription,
      symptoms,
    });

    // Validate doctor and patient exist
    const doctorExists = await Doctor.find({ licenseNumber });
    // const patientExists = await Patient.findById(patientId);

    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: "Doctor or patient not found",
      });
    }

    // Create consultation record
    const consultation = new Consultation({
      doctorId,
      // patientId,
      licenseNumber,
      patientName,
      diagnosis,
      prescription,
      symptoms,
    });

    await consultation.save();

    res.status(201).json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    console.error("Error creating consultation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create consultation record",
      error: error.message,
    });
  }
};

// Get consultations for a specific doctor
exports.getDoctorConsultations = async (req, res) => {
  try {
    const { ln } = req.params;

    console.log({ ln });

    const consultations = await Consultation.find({ licenseNumber: ln }).sort({
      date: -1,
    }); // Sort by date descending (newest first)
    // .populate("patientId", "name age symptoms");

    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations,
    });
  } catch (error) {
    console.error("Error fetching doctor consultations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch consultation records",
      error: error.message,
    });
  }
};
