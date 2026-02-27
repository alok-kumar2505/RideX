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

module.exports.getFare = async (req, res) => {
  const { pickup, destination } = req.query;
  if (!pickup || !destination) {
    return res.status(400).json({ error: "Pickup and destination are required" });
  }
  try {
    const fare = await rideService.getFare(pickup, destination);
    res.json({ fare });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
