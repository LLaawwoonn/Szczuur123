const { broadcasters } = require("../Data/data");

const getBroadcast = (broadcastId) => {
  return broadcasters[broadcastId];
};

const addConsumerCandidate = (socket, data) => {
  const { broadcastId, candidate } = data;
  if (broadcasters[broadcastId]) {
    socket.broadcast.emit("consumerCandidate", { broadcastId, candidate });
  }
};

module.exports = {
  getBroadcast,
  addConsumerCandidate,
};
