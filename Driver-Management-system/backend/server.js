require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const connectDb = require("./shared/middlewares/connect-db");
app.use(connectDb);


const { authenticate, authorize } = require("./shared/middlewares/authorization");


app.use("/users", require("./modules/users/userRoutes")); 


app.use(
  "/api/drivers",
  authenticate,
  authorize("admin", "user"),
  require("./modules/drivers/driverRoutes")
);


app.use(
  "/api/vehicles",
  authenticate,
  authorize("admin"),
  require("./modules/vehicles/vehicleRoutes")
);


app.use(
  "/api/trips",
  authenticate,
  authorize("admin", "user"),
  require("./modules/trips/tripRoutes")
);



app.get("/", (_req, res) => {
  res.json({ ok: true, service: "Driver-Management-System API" });
});



app.use((err, _req, res, _next) => {
  console.error("ERROR:", err);
  const code =
    err.name === "ValidationError"
      ? 400
      : err.name === "CastError"
      ? 400
      : 500;
  res.status(code).json({ error: err.message });
});


const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`API running on http://localhost:${port}`)
);
