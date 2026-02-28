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
        console.log(data);

        if(userType==="user"){
            const user=await userModel.findByIdAndUpdate(userId,{socketId:socket.id});
            
        }else if(userType==="captain"){
            const captain=await captainModel.findByIdAndUpdate(userId,{socketId:socket.id});
            console.log(captain);
        }
    });

    socket.on("update-location-captain", async(data) => {
        const {userId, location} = data;
      const lat = Number(location?.ltd);
      const lng = Number(location?.lng);

      if(!Number.isFinite(lat) || !Number.isFinite(lng)){
            return socket.emit("error","Invalid location data");   
            
        }
       
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

function sendMessageToSocketId(socketId, event, message) {
  if (!io) {
    throw new Error("Socket.io is not initialized. Call initializeSocket(server) first.");
  }

  io.to(socketId).emit(event, message);
}

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
};