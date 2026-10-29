const { Server } = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", async (data) => {
      const { userId, userType } = data;
      if (!userId) return;

      const userRoom = userId.toString();
      socket.join(userRoom);

      if (userType === "user") {
        socket.join("all_users");
        await userModel.findByIdAndUpdate(
          userId,
          { socketId: socket.id },
          { new: true }
        );
      } else if (userType === "captain") {
        socket.join("all_captains");
        await captainModel.findByIdAndUpdate(
          userId,
          { socketId: socket.id, lastActive: new Date() },
          { new: true }
        );
      }
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;
      if (!userId || !location) return;
      const lat = Number(location?.ltd);
      const lng = Number(location?.lng);

      const existingCaptain = await captainModel.findById(userId);
      let hoursToAdd = 0;
      const now = new Date();
      if (existingCaptain && existingCaptain.lastActive) {
        const diffMs = now - new Date(existingCaptain.lastActive);
        if (diffMs > 0 && diffMs < 180000) {
          hoursToAdd = diffMs / (1000 * 60 * 60);
        }
      }

      await captainModel.findByIdAndUpdate(userId, {
        location: {
          ltd: lat,
          lng: lng,
        },
        lastActive: now,
        $inc: { hoursOnline: hoursToAdd },
      });
    });

    socket.on("disconnect", () => {});
  });
}

/**
 * Sends a socket message via socketId and/or persistent userId room
 * This guarantees delivery even if the user or captain recently refreshed the page.
 */
const sendMessageToSocketId = (socketId, messageObject, userId = null) => {
  if (!io) {
    return;
  }

  let sent = false;

  // 1. Emit to specific socket ID if provided
  if (socketId) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
    sent = true;
  }

  // 2. ALSO emit to the user's persistent room (room name = userId)
  if (userId) {
    const userRoom = userId.toString();
    io.to(userRoom).emit(messageObject.event, messageObject.data);
    sent = true;
  }
};

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
};
