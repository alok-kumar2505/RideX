const mapService = require('../services/maps.services');
const { validationResult } = require('express-validator');

const getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { address } = req.query;

    if (!address) {
        return res.status(400).json({ error: 'Address query parameter is required' });
    }

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.json(coordinates);
    } catch (error) {
        console.error("Coordinate error:", error.message || error);
        res.status(500).json({
            message: 'Internal server error: Unable to fetch coordinates',
            error: error.message || 'Coordinate not found'
        });
    }
}

const getDistanceAndTime = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { origin, destination } = req.query;

    if (!origin || !destination) {
        return res.status(400).json({ error: 'Origin and destination query parameters are required' });
    }

    try {
        const result = await mapService.getDistanceAndTime(origin, destination);
        res.json(result);
    } catch (error) {
        console.error("Distance & time error:", error.message || error);
        res.status(500).json({
            message: 'Internal server error: Error fetching distance and time',
            error: error.message || 'Error fetching distance and time'
        });
    }
}

const getAutoCompleteSuggestions = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { input } = req.query;
        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        res.status(200).json(suggestions);
    } catch (error) {
        console.error("Autocomplete error:", error.message || error);
        res.status(500).json({
            message: 'Internal server error: Error fetching autocomplete suggestions',
            error: error.message || 'Failed to fetch location suggestions'
        });
    }
}
    

module.exports = {
    getCoordinates,
    getDistanceAndTime,
    getAutoCompleteSuggestions
}
