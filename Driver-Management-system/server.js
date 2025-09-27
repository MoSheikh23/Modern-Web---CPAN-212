const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

const driverRoutes = require("./routes/drivers");
const vehicleRoutes = require("./routes/vehicles");
const tripRoutes = require("./routes/trips");

app.use("/drivers", driverRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/trips", tripRoutes);

app.get("/", (req, res) => {
  res.send("Drive Management System API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
