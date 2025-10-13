const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const {
  getAllTrips,
  getTripByID,
  addNewTrip,
  updateExistingTrip,
  deleteTrip
} = require("./tripModel");
const { validateTrip } = require("../../shared/middlewares/tripValidation");

router.get("/", (req, res) => {
  try {
    const trips = getAllTrips();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching trips." });
  }
});

router.get("/:id", (req, res) => {
  try {
    const trip = getTripByID(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching trip." });
  }
});

router.post("/", validateTrip, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const newTrip = addNewTrip(req.body);
    res.status(201).json(newTrip);
  } catch (error) {
    res.status(500).json({ error: "Server error creating trip." });
  }
});

router.put("/:id", validateTrip, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const updatedTrip = updateExistingTrip(req.params.id, req.body);
    if (!updatedTrip) return res.status(404).json({ error: "Trip not found" });
    res.json(updatedTrip);
  } catch (error) {
    res.status(500).json({ error: "Server error updating trip." });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const deletedTrip = deleteTrip(req.params.id);
    if (!deletedTrip) return res.status(404).json({ error: "Trip not found" });
    res.json(deletedTrip);
  } catch (error) {
    res.status(500).json({ error: "Server error deleting trip." });
  }
});

module.exports = router;