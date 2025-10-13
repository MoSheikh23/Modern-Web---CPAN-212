const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const {
  getAllVehicles,
  getVehicleByID,
  addNewVehicle,
  updateExistingVehicle,
  deleteVehicle
} = require("./vehicleModel");
const { validateVehicle } = require("../../shared/middlewares/vehicleValidation");

router.get("/", (req, res) => {
  try {
    const vehicles = getAllVehicles();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching vehicles." });
  }
});

router.get("/:id", (req, res) => {
  try {
    const vehicle = getVehicleByID(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching vehicle." });
  }
});

router.post("/", validateVehicle, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const newVehicle = addNewVehicle(req.body);
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ error: "Server error creating vehicle." });
  }
});

router.put("/:id", validateVehicle, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const updatedVehicle = updateExistingVehicle(req.params.id, req.body);
    if (!updatedVehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ error: "Server error updating vehicle." });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const deletedVehicle = deleteVehicle(req.params.id);
    if (!deletedVehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json(deletedVehicle);
  } catch (error) {
    res.status(500).json({ error: "Server error deleting vehicle." });
  }
});

module.exports = router;