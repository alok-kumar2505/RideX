const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const mapService = require("../services/maps.services");
const { sendMessageToSocketId } = require("../socket");
const rideModel = require("../models/ride.model");

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

    const pickupCoords = await mapService.getAddressCoordinate(pickup);
    // console.log(pickupCoords);

    const captainInRadius = await mapService.getCaptainsInTheRadius(
      pickupCoords.ltd,
      pickupCoords.lng,
      2,
    ); // 2 km radius

    ride.otp = ""; //Not send otp to captain
    const rideWithUser=await rideModel.findOne({_id:ride._id}).populate('user');
    res.status(201).json(ride);

    captainInRadius.map((captain) => {
      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getFare = async (req, res) => {
  const { pickup, destination } = req.query;
  if (!pickup || !destination) {
    return res
      .status(400)
      .json({ error: "Pickup and destination are required" });
  }
  try {
    const fare = await rideService.getFare(pickup, destination);
    res.json({ fare });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { rideId } = req.body;
    const ride = await rideService.confirmRide(rideId,req.captain);
    console.log("Ride confirmed:", ride);
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
     }); 
    
    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { rideId, otp } = req.query;
    const ride = await rideService.startRide({rideId, otp, captain:req.captain});

    if (!ride || !ride.user) {
      return res.status(500).json({ error: "Failed to start ride" });
    }

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
     });
    return res.status(200).json(ride);
  } catch (error) {
    console.error("Error starting ride:", error);
    return res.status(500).json({ error: error.message });
  }
};
