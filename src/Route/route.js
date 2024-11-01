const broadcastController = require("../Controllers/broadcastController");
const consumerController = require("../Controllers/consumerController");

module.exports = (app) => {
  app.post("/broadcast", (req, res) =>
    broadcastController.startBroadcast(req, res)
  );
  app.post("/consumer", (req, res) =>
    consumerController.getBroadcast(req, res)
  );
  app.get("/list-broadcast", (req, res) =>
    broadcastController.fetchBroadcasts(req, res)
  );
};
