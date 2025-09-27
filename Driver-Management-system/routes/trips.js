const express = require("express");
const router = express.Router();

let trips = [
  { id: 1, driver_id: 1, vehicle_id: 101, distance: 120 },
  { id: 2, driver_id: 1, vehicle_id: 102, distance: 80 },
  { id: 3, driver_id: 2, vehicle_id: 103, distance: 200 }
];

router.get("/", (req, res) => {
  res.json(trips);
});

router.post("/", (req, res) => {
  const newTrip = { id: trips.length + 1, ...req.body };
  trips.push(newTrip);
  res.status(201).json(newTrip);
});

router.get("/driver/:driverId", (req, res) => {
  const driverId = parseInt(req.params.driverId);
  const driverTrips = trips.filter(t => t.driver_id === driverId);
  res.json(driverTrips);
});


