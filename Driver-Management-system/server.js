require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDb = require('./shared/middlewares/connect-db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(connectDb);

app.use('/api/drivers', require('./modules/drivers/driverRoutes'));
app.use('/api/vehicles', require('./modules/vehicles/vehicleRoutes'));
app.use('/api/trips', require('./modules/trips/tripRoutes'));

app.get('/', (_req, res) => res.json({ ok: true, service: 'Driver-Management-System' }));


app.use((err, _req, res, _next) => {
  console.error(err);
  const code =
    err.name === 'ValidationError' ? 400 :
    err.name === 'CastError' ? 400 : 500;
  res.status(code).json({ error: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(` API running on http://localhost:${port}`));
