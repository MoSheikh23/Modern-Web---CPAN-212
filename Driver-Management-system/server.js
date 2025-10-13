const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());


const driverRoutes = require("./modules/drivers/driverRoutes");
const vehicleRoutes = require("./modules/vehicles/vehicleRoutes");
const tripRoutes = require("./modules/trips/tripRoutes");


app.use("/drivers", driverRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/trips", tripRoutes);

app.get("/", (req, res) => {
  res.send("Drive Management System API is running...");
});


app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

