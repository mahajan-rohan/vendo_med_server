const mongoose = require("mongoose");

const vendingMachineSchema = new mongoose.Schema({
  location: { type: String, required: true },
  medicines: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("VendingMachine", vendingMachineSchema);
