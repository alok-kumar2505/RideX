const axios = require("axios");
const captainModel = require("../models/captain.model");

module.exports.getAddressCoordinate = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API key is not configured in server environment");
  }
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return {
        ltd: location.lat,
        lng: location.lng,
      };
    } else {
      const detail = response.data.error_message
        ? `${response.data.status}: ${response.data.error_message}`
        : response.data.status;
      throw new Error(`Geocoding API error: ${detail}`);
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message || error);
    throw error;
  }
};

module.exports.getDistanceAndTime = async (origin, destination) => {
  const apiKey = process.env.GOOGLE_MAPS_API;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API key is not configured in server environment");
  }
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (response.data.status === "OK") {
      const element = response.data.rows[0].elements[0];

      if (element.status === "ZERO_RESULTS") {
        throw new Error(
          "No route found between the specified origin and destination",
        );
      }
      if (element.status === "OK") {
        return {
          distance: element.distance.value, // distance in meters
          duration: element.duration.value, // duration in seconds
        };
      } else {
        const elemDetail = element.error_message
          ? `${element.status}: ${element.error_message}`
          : element.status;
        throw new Error(`Distance Matrix API error: ${elemDetail}`);
      }
    } else {
      const detail = response.data.error_message
        ? `${response.data.status}: ${response.data.error_message}`
        : response.data.status;
      throw new Error(`Distance Matrix API error: ${detail}`);
    }
  } catch (error) {
    console.error("Error fetching distance and time:", error.message || error);
    throw error;
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required for autocomplete suggestions");
  }
  const apiKey = process.env.GOOGLE_MAPS_API;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API key is not configured in server environment");
  }
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (response.data.status === "OK") {
      return response.data.predictions;
    } else if (response.data.status === "ZERO_RESULTS") {
      return [];
    } else {
      const detail = response.data.error_message
        ? `${response.data.status}: ${response.data.error_message}`
        : response.data.status;
      throw new Error(`Places API error: ${detail}`);
    }
  } catch (error) {
    console.error(
      "Error fetching autocomplete suggestions:",
      error.message || error,
    );
    throw error;
  }
};

module.exports.getCaptainsInTheRadius = async (ltd,lng,radius) => {
   
  // radius in km 
  const captains = await captainModel.find ({
    location :{

      $geoWithin :{
        $centerSphere: [ [ ltd , lng ] , radius / 6371]
      }

    }
  }); 

  // console.log(captains)

  return captains; 

}
