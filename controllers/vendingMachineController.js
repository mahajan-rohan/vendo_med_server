const VendingMachine = require("../models/VendingMachine");

// Get all vending machines
exports.getMachines = async (req, res) => {
  try {
    const machines = await VendingMachine.find();
    res.status(200).json(machines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add medicine to a vending machine
exports.addMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { medicines } = req.body;

    const machine = await VendingMachine.findByIdAndUpdate(
      id,
      { $push: { medicines } },
      { new: true }
    );

    res.status(200).json(machine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
