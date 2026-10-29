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
      10, // 10 km radius
    );

    ride.otp = ""; //Not send otp to captain
    const rideWithUser = await rideModel.findOne({_id: ride._id}).populate('user');
    res.status(201).json(ride);

    captainInRadius.forEach((captain) => {
      sendMessageToSocketId(
        captain.socketId,
        {
          event: "new-ride",
          data: rideWithUser,
        },
        captain._id
      );
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
    return res.status(400).json({ errors: errors.array(), message: errors.array()[0]?.msg });
  }
  try {
    const { rideId } = req.body;
    const ride = await rideService.confirmRide(rideId, req.captain);

    // Notify the user that ride is confirmed
    sendMessageToSocketId(
      ride.user.socketId,
      {
        event: "ride-confirmed",
        data: ride,
      },
      ride.user._id
    );

    // Broadcast to all captains that this ride was taken, passing acceptedByCaptainId
    sendMessageToSocketId(
      null,
      {
        event: "ride-taken",
        data: {
          rideId: ride._id,
          acceptedByCaptainId: req.captain._id.toString(),
        },
      },
      "all_captains"
    );

    res.status(200).json(ride);
  } catch (error) {
    console.error("Confirm ride error:", error.message);
    res.status(400).json({ message: error.message || "Failed to confirm ride" });
  }
};

module.exports.cancelRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { rideId } = req.body;
    const ride = await rideService.cancelRide(rideId, req.user);

    // Broadcast to all captains so open popups close immediately
    sendMessageToSocketId(
      null,
      {
        event: "ride-cancelled",
        data: {
          rideId: ride._id,
          message: "The rider cancelled this ride request",
        },
      },
      "all_captains"
    );

    if (ride.captain) {
      sendMessageToSocketId(
        null,
        {
          event: "ride-cancelled",
          data: {
            rideId: ride._id,
            message: "The rider cancelled this ride request",
          },
        },
        ride.captain.toString()
      );
    }

    res.status(200).json({ message: "Ride cancelled successfully", ride });
  } catch (error) {
    console.error("Cancel ride error:", error.message);
    res.status(400).json({ message: error.message || "Failed to cancel ride" });
  }
};

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), message: errors.array()[0]?.msg || "Invalid request parameters" });
  }
  try {
    const { rideId, otp } = req.query;
    const ride = await rideService.startRide({rideId, otp, captain:req.captain});

    if (!ride || !ride.user) {
      return res.status(500).json({ error: "Failed to start ride", message: "Failed to start ride" });
    }

    sendMessageToSocketId(
      ride.user.socketId,
      {
        event: "ride-started",
        data: ride,
      },
      ride.user._id
    );
    return res.status(200).json(ride);
  } catch (error) {
    console.error("Error starting ride:", error);
    return res.status(400).json({ error: error.message, message: error.message });
  }
};

module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), message: errors.array()[0]?.msg || "Invalid request parameters" });
  }
  try {
    const { rideId } = req.body;
    const ride = await rideService.endRide({rideId, captain: req.captain});

    if (!ride || !ride.user) {
      return res.status(500).json({ error: "Failed to end ride", message: "Failed to end ride" });
    }

    sendMessageToSocketId(
      ride.user.socketId,
      {
        event: "ride-ended",
        data: ride,
      },
      ride.user._id
    );
    return res.status(200).json(ride);
  } catch (error) {
    console.error("Error ending ride:", error);
    return res.status(400).json({ error: error.message, message: error.message });
  }
};
