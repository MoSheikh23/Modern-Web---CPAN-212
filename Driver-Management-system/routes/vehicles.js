const express = require("express");
const router = express.Router();

let vehicles = [
  { id: 101, plate: "ABC-111", model: "Toyota Camry", year: 2020 },
  { id: 102, plate: "XYZ-222", model: "Honda Civic", year: 2019 }
];

router.get("/", (req, res) => {
  res.json(vehicles);
});

router.post("/", (req, res) => {
  const newVehicle = { id: vehicles.length + 101, ...req.body };
  vehicles.push(newVehicle);
  res.status(201).json(newVehicle);
});


