const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const NodeMediaServer = require("node-media-server");
const routes = require("./src/Route/route");
const socketEvents = require("./src/Socket/socketEvent");

// Initialize Express app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// NodeMediaServer configuration
const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    allow_origin: "*",
  },
  trans: {
    ffmpeg: "ffmpeg",
    tasks: [
      {
        app: "live",
        hls: true,
        hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
        dash: true,
        dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
        output: "live",
        mediaRoot: path.resolve(__dirname, "media"),
      },
    ],
  },
};

// Initialize NodeMediaServer
const nms = new NodeMediaServer(config);
nms.run();

// Middleware to parse JSON requests
app.use(express.json());

// Load routes
routes(app);

// Load socket event handlers
socketEvents(io);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = {
  app,
  server,
};
