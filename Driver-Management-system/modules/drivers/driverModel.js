const fs = require('fs');
const path = require('path');

const driversPath = path.join(__dirname, '../../data/drivers.json');

const readDrivers = () => {
  const data = fs.readFileSync(driversPath, '');
  return JSON.parse(data);
};

const writeDrivers = (data) => {
  fs.writeFileSync(driversPath, JSON.stringify(data, null, 2));
};

const getAllDrivers = () => {
  return readDrivers();
};

const getDriverByID = (id) => {
  const drivers = readDrivers();
  return drivers.find(d => d.id === parseInt(id));
};

const addNewDriver = (driverData) => {
  const drivers = readDrivers();
  const newId = drivers.length > 0 ? Math.max(...drivers.map(d => d.id)) + 1 : 1;
  const newDriver = { id: newId, ...driverData };
  drivers.push(newDriver);
  writeDrivers(drivers);
  return newDriver;
};

const updateExistingDriver = (id, updateData) => {
  const drivers = readDrivers();
  const driverIndex = drivers.findIndex(d => d.id === parseInt(id));
  if (driverIndex === -1) return null;
  
  drivers[driverIndex] = { ...drivers[driverIndex], ...updateData };
  writeDrivers(drivers);
  return drivers[driverIndex];
};

const deleteDriver = (id) => {
  const drivers = readDrivers();
  const driverIndex = drivers.findIndex(d => d.id === parseInt(id));
  if (driverIndex === -1) return null;
  
  const deletedDriver = drivers.splice(driverIndex, 1)[0];
  writeDrivers(drivers);
  return deletedDriver;
};

module.exports = {
  getAllDrivers,
  getDriverByID,
  addNewDriver,
  updateExistingDriver,
  deleteDriver
};