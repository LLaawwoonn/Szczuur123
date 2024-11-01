const broadcastController = require("../Controllers/broadcastController");
const consumerController = require("../Controllers/consumerController");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("addCandidate", (data) => {
      broadcastController.addCandidate(socket, data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
