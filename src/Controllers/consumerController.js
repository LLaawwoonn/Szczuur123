const getBroadcast = (socket, data) => {
  const { broadcastId } = data;
  if (broadcasts[broadcastId]) {
    socket.emit("broadcastReceived", broadcasts[broadcastId]);
  } else {
    socket.emit("broadcastNotFound");
  }
};

const addConsumerCandidate = (socket, data) => {
  const { broadcastId, candidate } = data;
  if (broadcasts[broadcastId]) {
    socket.broadcast.emit("consumerCandidate", { broadcastId, candidate });
  }
};

module.exports = {
  getBroadcast,
  addConsumerCandidate,
};
