const io = require("socket.io-client");
const Config = require("../../public/config");

const socket = io(`${Config.host}:${Config.port}`);

const socketFunctions = {
  on(event, callback) {
    socket.on(event, callback);
  },
  emit(event, data) {
    socket.emit(event, data);
  },
};

module.exports = socketFunctions;
