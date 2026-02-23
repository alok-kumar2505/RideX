const express = require('express');
const router=express.Router();
const {body}=require('express-validator');
const rideController=require('../controllers/ride.controller');
const authMiddleware=require('../Middleware/aut.middleware');

router.post("/create",authMiddleware.authUser,
body("pickup").notEmpty().isString().withMessage("Pickup location is required"),
body("destination").notEmpty().isString().withMessage("Destination is required"),
body("vehicleType").notEmpty().isIn(["bike","auto","car"]).withMessage("Vehicle type must be one of bike, auto, or car"),
rideController.createRide
);

module.exports=router;