const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const {
  getAllDrivers,
  getDriverByID,
  addNewDriver,
  updateExistingDriver,
  deleteDriver
} = require("./driverModel");
const { validateDriver } = require("../../shared/middlewares/driverValidation");

router.get("/", (req, res) => {
  try {
    const drivers = getAllDrivers();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching drivers." });
  }
});

router.get("/:id", (req, res) => {
  try {
    const driver = getDriverByID(req.params.id);
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching driver." });
  }
});

router.post("/", validateDriver, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const newDriver = addNewDriver(req.body);
    res.status(201).json(newDriver);
  } catch (error) {
    res.status(500).json({ error: "Server error creating driver." });
  }
});

router.put("/:id", validateDriver, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const updatedDriver = updateExistingDriver(req.params.id, req.body);
    if (!updatedDriver) return res.status(404).json({ error: "Driver not found" });
    res.json(updatedDriver);
  } catch (error) {
    res.status(500).json({ error: "Server error updating driver." });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const deletedDriver = deleteDriver(req.params.id);
    if (!deletedDriver) return res.status(404).json({ error: "Driver not found" });
    res.json(deletedDriver);
  } catch (error) {
    res.status(500).json({ error: "Server error deleting driver." });
  }
});

module.exports = router;