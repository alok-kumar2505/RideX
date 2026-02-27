const rideModel = require("../models/ride.model");
const mapService = require("./maps.services");
const crypto = require("crypto");

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
    UserId: user,
    pickup,
    destination,
    otp: getOTP(6),
    fare: fare[vehicleType],
  });
  return ride;
};
