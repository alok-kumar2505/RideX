const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { pickup, destination, vehicleType } = req.body;
    const ride = await rideService.createRide(
      req.user._id,
      pickup,
      destination,
      vehicleType,
    );
    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
