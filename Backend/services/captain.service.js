const captainModel = require("../models/captain.model");

module.exports.createCaptain = async ({firstname,lastname,email,password,vehicleType,color,capacity,plate}) => {
    console.log(firstname,lastname,email,password,vehicleType,color,capacity,plate);
  if (!firstname ||!email || !password ||!vehicleType || !color || !capacity || !plate) {
    
    throw new Error("All fields are required");
  }

  const captain = captainModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    vehicle: { vehicleType, capacity, plate, color },
  });
  return captain;
};
