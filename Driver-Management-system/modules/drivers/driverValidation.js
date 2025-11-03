module.exports = function validateDriver(req, res, next) {
  const { name, licenseNumber } = req.body;
  if (!name || !licenseNumber) {
    return res.status(400).json({ error: 'name and licenseNumber are required' });
  }
  next();
};
