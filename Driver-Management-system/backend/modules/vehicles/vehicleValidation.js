module.exports = function validateVehicle(req, res, next) {
  const { plate, make, model } = req.body;
  if (!plate || !make || !model) {
    return res.status(400).json({ error: 'plate, make, and model are required' });
  }
  next();
};
