const axios = require('axios');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error(`Geocoding API error: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }

        
};

module.exports.getDistanceAndTime = async (origin, destination) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        
        if (response.data.status === 'OK') {
            const element = response.data.rows[0].elements[0];

            if (element.status === 'ZERO_RESULTS') {
                throw new Error('No route found between the specified origin and destination');
            }
            if (element.status === 'OK') {
                return {
                    distance: element.distance.text,
                    duration: element.duration.text
                };
            } else {
                throw new Error(`Distance Matrix API error: ${element.status}`);
            }
        } else {
            throw new Error(`Distance Matrix API error: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Error fetching distance and time:', error);
        throw error;
    }
};

module.exports.getAutoCompleteSuggestions = async (input) => {

    if (!input) {
        throw new Error('query is required for autocomplete suggestions');
    }
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        
        if (response.data.status === 'OK') {
            return response.data.predictions;
        } else {
            throw new Error(`Places API error: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
        throw error;
    }
};