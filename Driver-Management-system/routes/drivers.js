const express = require("express");
const router = express.Router();

let drivers = [
  { id: 1, name: "John Doe", license: "ABC123", phone: "555-1234" },
  { id: 2, name: "Jane Smith", license: "XYZ789", phone: "555-5678" }
];

let trips = [
  { id: 1, driver_id: 1, vehicle_id: 101, distance: 120 },
  { id: 2, driver_id: 1, vehicle_id: 102, distance: 80 },
  { id: 3, driver_id: 2, vehicle_id: 103, distance: 200 }
];

router.get("/", (req, res) => {
  res.json(drivers);
});

router.get("/:id", (req, res) => {
  const driverId = parseInt(req.params.id);
  const driver = drivers.find(d => d.id === driverId);

  if (!driver) return res.status(404).json({ message: "Driver not found" });

  const tripCount = trips.filter(t => t.driver_id === driverId).length;

  res.json({ ...driver, totalTrips: tripCount });
});

router.post("/", (req, res) => {
  const newDriver = { id: drivers.length + 1, ...req.body };
  drivers.push(newDriver);
  res.status(201).json(newDriver);
});


router.delete("/:id", (req, res) => {
  const driverId = parseInt(req.params.id);
  drivers = drivers.filter(d => d.id !== driverId);
  res.json({ message: "Driver deleted" });
});

