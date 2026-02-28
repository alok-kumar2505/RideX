const captainService=require('../services/captain.service');
const captainModel=require('../models/captain.model');
const {validationResult}=require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');


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
        const dupPlate=await captainModel.findOne({'vehicle.plate':vehicle.plate});
        if(dupPlate){
            return res.status(400).json({message:"Vehicle with this plate number is already registered!"})
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

module.exports.loginCaptain=async(req,res,next)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {email,password}=req.body;

    const captain=await captainModel.findOne({email}).select("+password") ;
    if(!captain){
        return res.status(400).json({message:"Invalid email or password"});
    }

    const isPasswordValid=await captain.comparePassword(password,captain.password);
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid email or password"});
    }

    const token=captain.generateAuthToken();
    res.cookie('token',token);
    res.status(200).json({token,captain});
}

module.exports.getCaptainProfile=async(req,res)=>{
    // console.log(req.captain);
    res.status(200).json({captain:req.captain});
}

module.exports.logoutcaptain=async(req,res)=>{
    const token= req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blacklistTokenModel.create({token});
    res.clearCookie('token');
    res.status(200).json({message:'Logout Succesfully!'})

}