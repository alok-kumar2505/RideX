const express = require('express');
const router=express.Router();
const {body, query}=require('express-validator');
const rideController=require('../controllers/ride.controller');
const authMiddleware=require('../Middleware/aut.middleware');

router.post("/create",authMiddleware.authUser,
body("pickup").notEmpty().isString().withMessage("Pickup location is required"),
body("destination").notEmpty().isString().withMessage("Destination is required"),
body("vehicleType").notEmpty().isIn(["bike","auto","car"]).withMessage("Vehicle type must be one of bike, auto, or car"),
rideController.createRide
);

router.get("/get-fare",authMiddleware.authUser,
    query("pickup").notEmpty().isString().withMessage("Pickup location is required"),
    query("destination").notEmpty().isString().withMessage("Destination is required"),
    rideController.getFare);


router.post("/confirm",authMiddleware.authCaptain,
body("rideId").notEmpty().isString().withMessage("Ride ID is required"),
rideController.confirmRide);

router.get("/start-ride",authMiddleware.authCaptain,query("rideId").notEmpty().isString().withMessage("Ride ID is required"),
query("otp").notEmpty().isString().isLength({ max: 6,min: 6 }).withMessage("OTP must be a 6-character string"),
rideController.startRide);


router.post("/end-ride",authMiddleware.authCaptain,body("rideId").isMongoId().notEmpty().isString().withMessage("Ride ID is required"),
rideController.endRide);
module.exports=router;