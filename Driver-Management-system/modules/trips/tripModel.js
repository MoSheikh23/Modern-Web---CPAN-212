const fs = require('fs');
const path = require('path');

const tripsPath = path.join(__dirname, '../../data/trips.json');

const readTrips = () => {
  const data = fs.readFileSync(tripsPath, '');
  return JSON.parse(data);
};

const writeTrips = (data) => {
  fs.writeFileSync(tripsPath, JSON.stringify(data, null, 2));
};

const getAllTrips = () => {
  return readTrips();
};

const getTripByID = (id) => {
  const trips = readTrips();
  return trips.find(t => t.id === parseInt(id));
};

const addNewTrip = (tripData) => {
  const trips = readTrips();
  const newId = trips.length > 0 ? Math.max(...trips.map(t => t.id)) + 1 : 1;
  const newTrip = { id: newId, ...tripData };
  trips.push(newTrip);
  writeTrips(trips);
  return newTrip;
};

const updateExistingTrip = (id, updateData) => {
  const trips = readTrips();
  const tripIndex = trips.findIndex(t => t.id === parseInt(id));
  if (tripIndex === -1) return null;
  
  trips[tripIndex] = { ...trips[tripIndex], ...updateData };
  writeTrips(trips);
  return trips[tripIndex];
};

const deleteTrip = (id) => {
  const trips = readTrips();
  const tripIndex = trips.findIndex(t => t.id === parseInt(id));
  if (tripIndex === -1) return null;
  
  const deletedTrip = trips.splice(tripIndex, 1)[0];
  writeTrips(trips);
  return deletedTrip;
};

module.exports = {
  getAllTrips,
  getTripByID,
  addNewTrip,
  updateExistingTrip,
  deleteTrip
};