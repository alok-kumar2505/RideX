const axios = require("axios");
const captainModel = require("../models/captain.model");

// Active map provider: "mapbox" (default) or "google"
const MAP_PROVIDER = process.env.MAP_PROVIDER || "mapbox";

/* =========================================================================
   1. GET ADDRESS COORDINATES (Geocoding: Address -> { ltd, lng })
   ========================================================================= */

// --- ACTIVE: MAPBOX IMPLEMENTATION ---
const getAddressCoordinateMapbox = async (address) => {
  const token = process.env.MAPBOX_TOKEN;
  if (!token) {
    throw new Error("MAPBOX_TOKEN is not configured in server environment");
  }
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}`;

  try {
    const response = await axios.get(url);
    if (response.data.features && response.data.features.length > 0) {
      // Mapbox returns [longitude, latitude]
      const [lng, lat] = response.data.features[0].center;
      return {
        ltd: lat,
        lng: lng,
      };
    } else {
      throw new Error(`Coordinates not found for address: "${address}"`);
    }
  } catch (error) {
    console.error("Mapbox Coordinates Error:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch coordinates via Mapbox");
  }
};

/*
// --- GOOGLE MAPS IMPLEMENTATION (Uncomment to switch back to Google Maps) ---
const getAddressCoordinateGoogle = async (address) => {
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
    console.error("Google Coordinates Error:", error.message || error);
    throw error;
  }
};
*/

module.exports.getAddressCoordinate = async (address) => {
  if (MAP_PROVIDER === "google") {
    // To switch back to Google: uncomment getAddressCoordinateGoogle above and return it here:
    // return await getAddressCoordinateGoogle(address);
  }
  return await getAddressCoordinateMapbox(address);
};


/* =========================================================================
   2. GET DISTANCE AND TIME (Distance Matrix: Origin, Destination -> { distance, duration })
   ========================================================================= */

// --- ACTIVE: MAPBOX IMPLEMENTATION ---
const getDistanceAndTimeMapbox = async (origin, destination) => {
  const token = process.env.MAPBOX_TOKEN;
  if (!token) {
    throw new Error("MAPBOX_TOKEN is not configured in server environment");
  }

  // Mapbox Directions requires coordinates: get coordinates for origin & destination
  const originCoords = await getAddressCoordinateMapbox(origin);
  const destCoords = await getAddressCoordinateMapbox(destination);

  // Mapbox Directions API format: {origin_lng},{origin_lat};{dest_lng},{dest_lat}
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords.lng},${originCoords.ltd};${destCoords.lng},${destCoords.ltd}?overview=false&access_token=${token}`;

  try {
    const response = await axios.get(url);

    if (response.data.code === "Ok" && response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      return {
        distance: Math.round(route.distance), // distance in meters (same format as Google)
        duration: Math.round(route.duration), // duration in seconds (same format as Google)
      };
    } else if (response.data.code === "NoRoute") {
      throw new Error("No driving route found between specified locations");
    } else {
      throw new Error(`Mapbox Directions API error: ${response.data.message || response.data.code}`);
    }
  } catch (error) {
    console.error("Mapbox Distance & Time Error:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message || "Failed to calculate distance & time via Mapbox");
  }
};

/*
// --- GOOGLE MAPS IMPLEMENTATION (Uncomment to switch back to Google Maps) ---
const getDistanceAndTimeGoogle = async (origin, destination) => {
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
    console.error("Google Distance & Time Error:", error.message || error);
    throw error;
  }
};
*/

module.exports.getDistanceAndTime = async (origin, destination) => {
  if (MAP_PROVIDER === "google") {
    // To switch back to Google: uncomment getDistanceAndTimeGoogle above and return it here:
    // return await getDistanceAndTimeGoogle(origin, destination);
  }
  return await getDistanceAndTimeMapbox(origin, destination);
};


/* =========================================================================
   3. GET AUTOCOMPLETE SUGGESTIONS (Search query -> [{ description, structured_formatting }])
   ========================================================================= */

// --- ACTIVE: MAPBOX IMPLEMENTATION ---
const getAutoCompleteSuggestionsMapbox = async (input) => {
  if (!input) {
    throw new Error("Query is required for autocomplete suggestions");
  }
  const token = process.env.MAPBOX_TOKEN;
  if (!token) {
    throw new Error("MAPBOX_TOKEN is not configured in server environment");
  }
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?autocomplete=true&access_token=${token}`;

  try {
    const response = await axios.get(url);

    if (response.data.features) {
      // Map Mapbox features into prediction objects matching the frontend format
      return response.data.features.map((feature) => ({
        place_id: feature.id,
        description: feature.place_name,
        structured_formatting: {
          main_text: feature.text || feature.place_name,
          secondary_text: feature.context
            ? feature.context.map((c) => c.text).join(", ")
            : feature.place_name,
        },
      }));
    }
    return [];
  } catch (error) {
    console.error("Mapbox Autocomplete Error:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch autocomplete suggestions via Mapbox");
  }
};

/*
// --- GOOGLE MAPS IMPLEMENTATION (Uncomment to switch back to Google Maps) ---
const getAutoCompleteSuggestionsGoogle = async (input) => {
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
    console.error("Google Autocomplete Error:", error.message || error);
    throw error;
  }
};
*/

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (MAP_PROVIDER === "google") {
    // To switch back to Google: uncomment getAutoCompleteSuggestionsGoogle above and return it here:
    // return await getAutoCompleteSuggestionsGoogle(input);
  }
  return await getAutoCompleteSuggestionsMapbox(input);
};


/* =========================================================================
   4. GET CAPTAINS IN RADIUS (Accurate Geodesic / Haversine Distance)
   ========================================================================= */

// Haversine formula to compute great-circle distance between two points in km
function calculateDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius = 10) => {
  // Query all active captains
  const activeCaptains = await captainModel.find({
    status: "active",
  });

  if (!activeCaptains || activeCaptains.length === 0) {
    console.log("⚠️ No active captains currently found in database");
    return [];
  }

  // If pickup coordinates are missing or invalid, notify all active captains
  if (
    typeof ltd !== "number" ||
    typeof lng !== "number" ||
    isNaN(ltd) ||
    isNaN(lng)
  ) {
    console.log("ℹ️ Pickup coordinates not provided; notifying all active captains");
    return activeCaptains;
  }

  // Filter captains within radius
  const nearbyCaptains = activeCaptains.filter((captain) => {
    // If captain has no location set yet (e.g. freshly logged in on desktop), include them
    if (
      !captain.location ||
      typeof captain.location.ltd !== "number" ||
      typeof captain.location.lng !== "number" ||
      isNaN(captain.location.ltd) ||
      isNaN(captain.location.lng)
    ) {
      return true;
    }

    const dist = calculateDistanceInKm(
      ltd,
      lng,
      captain.location.ltd,
      captain.location.lng
    );
    return dist <= radius;
  });

  // If none are within strict radius (e.g. testing in development or low-density areas),
  // fallback to all active captains so the ride request is never lost
  if (nearbyCaptains.length === 0) {
    console.log(`ℹ️ No captains within ${radius}km. Broadcasting to all ${activeCaptains.length} active captains`);
    return activeCaptains;
  }

  console.log(`✅ Found ${nearbyCaptains.length} captains within ${radius}km`);
  return nearbyCaptains;
};
