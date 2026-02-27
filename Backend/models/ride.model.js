const mongoose=require('mongoose');

const rideSchema=new mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    CaptainId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Captain',
    },
    pickup:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['pending','accepted','ongoing','completed','cancelled'],
        default:'pending'
    },
    fare:{
        type:Number,
        required:true,
        default:0,
    },
    duration:{
        type:Number,
       
    },
    distance:{
        type:Number,
        
    },
    paymentId:{
        type:String,
    },
    orderId:{
        type:String,
    },
    signature:{
        type:String,
    },
    otp:{
        type:String,
        select:false,
        required:true,
    }
},{timestamps:true})

module.exports=mongoose.model('ride',rideSchema)