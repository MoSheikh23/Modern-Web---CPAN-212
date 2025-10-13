const fs = require('fs');
const path = require('path');

const vehiclesPath = path.join(__dirname, '../../data/vehicles.json');

const readVehicles = () => {
  const data = fs.readFileSync(vehiclesPath, '');
  return JSON.parse(data);
};

const writeVehicles = (data) => {
  fs.writeFileSync(vehiclesPath, JSON.stringify(data, null, 2));
};

const getAllVehicles = () => {
  return readVehicles();
};

const getVehicleByID = (id) => {
  const vehicles = readVehicles();
  return vehicles.find(v => v.id === parseInt(id));
};

const addNewVehicle = (vehicleData) => {
  const vehicles = readVehicles();
  const newId = vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1;
  const newVehicle = { id: newId, ...vehicleData };
  vehicles.push(newVehicle);
  writeVehicles(vehicles);
  return newVehicle;
};

const updateExistingVehicle = (id, updateData) => {
  const vehicles = readVehicles();
  const vehicleIndex = vehicles.findIndex(v => v.id === parseInt(id));
  if (vehicleIndex === -1) return null;
  
  vehicles[vehicleIndex] = { ...vehicles[vehicleIndex], ...updateData };
  writeVehicles(vehicles);
  return vehicles[vehicleIndex];
};

const deleteVehicle = (id) => {
  const vehicles = readVehicles();
  const vehicleIndex = vehicles.findIndex(v => v.id === parseInt(id));
  if (vehicleIndex === -1) return null;
  
  const deletedVehicle = vehicles.splice(vehicleIndex, 1)[0];
  writeVehicles(vehicles);
  return deletedVehicle;
};

module.exports = {
  getAllVehicles,
  getVehicleByID,
  addNewVehicle,
  updateExistingVehicle,
  deleteVehicle
};