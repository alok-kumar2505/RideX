const express = require('express');
const router=express.Router();
const {body}=require('express-validator');

router.post("/create-ride",body("UserId").notEmpty().isLength({min:14}).isString().withMessage("UserId is required"),
body("pickup").notEmpty().isString().withMessage("Pickup location is required"),
body("destination").notEmpty().isString().withMessage("Destination is required"),
);

module.exports=router;