const rideModel = require("../models/ride.model");
const captainModel = require("../models/captain.model");
const mapService = require("./maps.services");
const crypto = require("crypto");
const {sendMessageToSocketId} = require("../socket");


async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required to calculate fare");
  }
  const distanceTime = await mapService.getDistanceAndTime(pickup, destination);

  const baseFare = { bike: 10, auto: 15, car: 20 };
  const perKmRate = { bike: 8, auto: 12, car: 15 };
  const perMinuteRate = { bike: 1, auto: 1.5, car: 2 };
  const distanceInMeters = Number(distanceTime?.distance);
  const durationInSeconds = Number(distanceTime?.duration);

  if (
    !Number.isFinite(distanceInMeters) ||
    !Number.isFinite(durationInSeconds)
  ) {
    throw new Error(
      "Unable to calculate fare: invalid distance or duration data",
    );
  }

  const fare = {};
  for (const rideType in baseFare) {
    fare[rideType] = Math.round(
      baseFare[rideType] +
        (distanceInMeters / 1000) * perKmRate[rideType] +
        (durationInSeconds / 60) * perMinuteRate[rideType],
    );
  }
  // console.log(fare);
  return fare;
}

module.exports.getFare = getFare;
function getOTP(num) {
  function generateOTP() {
    const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num) - 1).toString();
    return otp;
  }
  return generateOTP();
}

module.exports.createRide = async (user, pickup, destination, vehicleType) => {
  if (!pickup || !destination || !vehicleType) {
    throw new Error("All fields are required to create a ride");
  }
  const fare = await getFare(pickup, destination);
  const ride = await rideModel.create({
    user: user,
    pickup,
    destination,
    otp: getOTP(6),
    fare: fare[vehicleType],
  });
  return ride;
};

module.exports.confirmRide = async (rideId, captain) => {
  if (!rideId || !captain) {
    throw new Error("Ride ID and Captain are required to confirm a ride");
  }

  // 1. Check current ride status
  const existingRide = await rideModel.findById(rideId);
  if (!existingRide) {
    throw new Error("Ride not found or no longer available");
  }

  if (existingRide.status === "cancelled") {
    throw new Error("This ride was cancelled by the user");
  }

  if (
    existingRide.status === "accepted" ||
    existingRide.status === "ongoing" ||
    existingRide.status === "completed"
  ) {
    if (
      existingRide.captain &&
      existingRide.captain.toString() !== captain._id.toString()
    ) {
      throw new Error("This ride has already been accepted by another captain");
    }
  }

  // 2. Atomically update only if status is still pending
  const ride = await rideModel
    .findOneAndUpdate(
      { _id: rideId, status: "pending" },
      { captain: captain._id, status: "accepted" },
      { new: true }
    )
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    const updated = await rideModel.findById(rideId);
    if (updated?.status === "cancelled") {
      throw new Error("This ride was cancelled by the user");
    }
    throw new Error("This ride has already been accepted by another captain");
  }

  return ride;
};

module.exports.cancelRide = async (rideId, user) => {
  if (!rideId) {
    throw new Error("Ride ID is required to cancel a ride");
  }

  const ride = await rideModel.findOne({ _id: rideId, user: user._id });
  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status === "completed") {
    throw new Error("Cannot cancel a completed ride");
  }

  ride.status = "cancelled";
  await ride.save();

  return ride;
};

module.exports.startRide = async({rideId, otp, captain}) => {
  if(!rideId || !otp ){
    throw new Error("Ride ID and OTP are required to start a ride");
  }
  const ride = await rideModel
    .findOne({_id: rideId})
    .populate("user")
    .populate("captain")
    .select("+otp");

  if(!ride){
    throw new Error("Ride not found");  
  }
  if(String(ride.otp).trim() !== String(otp).trim()){
    throw new Error("Invalid OTP");
  }

  const updatedRide = await rideModel
    .findOneAndUpdate({_id: rideId}, {status: "ongoing"}, {new: true})
    .populate("user")
    .populate("captain");

  return updatedRide;
};

module.exports.endRide = async({rideId, captain}) => {
  if(!rideId){
    throw new Error("Ride ID is required to end a ride");
  }
  const ride = await rideModel
    .findOne({_id: rideId, captain: captain._id})
    .populate("user")
    .populate("captain");

  if(!ride){
    throw new Error("Ride not found");  
  }

  if(ride.status !== "ongoing"){
    throw new Error("Ride is not ongoing");
  }

  const updatedRide = await rideModel
    .findOneAndUpdate({_id: rideId}, {status: "completed"}, {new: true})
    .populate("user")
    .populate("captain");

  const rideDistanceKm = ride.distance ? Math.round((ride.distance / 1000) * 10) / 10 : 0;
  const rideFare = ride.fare || 0;

  await captainModel.findByIdAndUpdate(captain._id, {
    $inc: {
      earnings: rideFare,
      totalRides: 1,
      totalDistance: rideDistanceKm,
    }
  });

  return updatedRide;
};