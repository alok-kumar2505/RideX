const mapService = require('../services/maps.services');
const { validationResult } = require('express-validator');

const getCoordinates = async (req, res,next) => {
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
        res.status(400).json({ message: 'Co-ordinate not found' });
    }
}

const getDistanceAndTime = async (req, res,next) => {
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
        res.status(400).json({ message: 'Error fetching distance and time' });
    }
}

const getAutoCompleteSuggestions = async (req, res,next) => {
    try{
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { input } = req.query;
    const suggestions = await mapService.getAutoCompleteSuggestions(input);
    res.status(200).json(suggestions);
    }catch(error){
        res.status(400).json({ message: 'Error fetching autocomplete suggestions' });
    }
}
    

module.exports = {
    getCoordinates,
    getDistanceAndTime,
    getAutoCompleteSuggestions
}
