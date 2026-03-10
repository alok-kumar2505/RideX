const { Server } = require("socket.io");
const userModel=require('./models/user.model');
const captainModel=require('./models/captain.model');

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join',async(data)=>{
        const {userId,userType}=data;
        

        if(userType==="user"){
            const user=await userModel.findByIdAndUpdate(userId,{socketId:socket.id}, {new: true});
            // console.log(`User ${userId} joined with socket ID: ${socket.id}`);
            
        }else if(userType==="captain"){
            const captain=await captainModel.findByIdAndUpdate(userId,{socketId:socket.id}, {new: true});
            // console.log(`Captain ${userId} joined with socket ID: ${socket.id}`);
        }
    });

    socket.on("update-location-captain", async(data) => {
        const {userId, location} = data;
      const lat = Number(location?.ltd);
      const lng = Number(location?.lng);

      
       
        const captain = await captainModel.findByIdAndUpdate(userId,{location:{
        ltd: lat,
        lng: lng
        }});
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  
}

const sendMessageToSocketId = (socketId, messageObject) => {

console.log('🔔 Attempting to send:', messageObject.event, 'to socketId:', socketId);

    if (!socketId) {
        console.log('Cannot send message - socketId is null/undefined');
        return;
    }

    if(io){
      io.to(socketId).emit(messageObject.event, messageObject.data);
    }else{
      console.log('Socket.io server instance (io) is not initialized');
    }
}

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
};