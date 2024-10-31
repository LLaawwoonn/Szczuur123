const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const NodeMediaServer = require("node-media-server");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

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
};

const nms = new NodeMediaServer(config);
nms.run();

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("videoStream", (data) => {
    ffmpeg()
      .input(data)
      .inputFormat("rawvideo")
      .outputOptions("-vcodec libx264")
      .outputOptions("-f flv")
      .output("rtmp://localhost/live/stream")
      .run();
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
