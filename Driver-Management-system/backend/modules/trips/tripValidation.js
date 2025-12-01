module.exports = function validateTrip(req, res, next) {
  const { driver, vehicle, origin, destination, startTime } = req.body;
  if (!driver || !vehicle || !origin || !destination || !startTime) {
    return res.status(400).json({
      error: 'driver, vehicle, origin, destination, and startTime are required'
    });
  }
  next();
};
