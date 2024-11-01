const {
  startBroadcast,
  addCandidate,
} = require("../Services/broadcastServices");

const start = (req, res) => {
  const { sdp, socket_id } = req.body;
  startBroadcast(socket_id, sdp);
  res.json({ message: "Broadcast started" });
};

const add = (req, res) => {
  const { candidate, broadcast_id } = req.body;
  addCandidate(broadcast_id, candidate);
  res.json({ message: "Candidate added" });
};

module.exports = {
  start,
  add,
};
