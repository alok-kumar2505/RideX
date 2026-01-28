const captainService=require('../services/captain.service');
const captainModel=require('../models/captain.model');
const {validationResult}=require('express-validator');


module.exports.registerCaptain= async(req,res,next)=>{
        const errors=validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const {fullname,email,password,vehicle}=req.body;

        const isCaptainAlreadyRegistered=await captainModel.findOne({email});
        if(isCaptainAlreadyRegistered){
            return res.status(400).json({message:"Captain ALready Exists!"})
        }

        const hashedPassword= await captainModel.hashPassword(password);

        const captain= await captainService.createCaptain({
            firstname:fullname.firstname,
            lastname:fullname.lastname,
            email,
            password:hashedPassword,
            vehicleType:vehicle.vehicleType,
            color:vehicle.color,
            capacity:vehicle.capacity,
            plate:vehicle.plate,   
        })

        const token=captain.generateAuthToken();
        res.status(201).json({token,captain});
}