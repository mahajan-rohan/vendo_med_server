const express = require("express");
const {
  getMachines,
  addMedicine,
} = require("../controllers/vendingMachineController");

const router = express.Router();

router.route("/").get(getMachines);
router.route("/:id/medicine").post(addMedicine);

module.exports = router;
