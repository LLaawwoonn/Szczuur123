const { broadcasters } = require("../Data/data");

const startBroadcast = (socket_id, sdp) => {
  broadcasters[socket_id] = { sdp, candidates: [] };
};

const addCandidate = (broadcast_id, candidate) => {
  if (broadcasters[broadcast_id]) {
    broadcasters[broadcast_id].candidates.push(candidate);
  }
};

module.exports = {
  startBroadcast,
  addCandidate,
};
