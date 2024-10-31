const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const NodeMediaServer = require("node-media-server");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const mediaRoot = path.join(__dirname, "media");
console.log("MediaRoot is set to:", mediaRoot);

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8080,
    allow_origin: "*",
  },
  trans: {
    ffmpeg: "ffmpeg", // Jeśli dodałeś ffmpeg do PATH, wystarczy "ffmpeg"
    tasks: [
      {
        app: "live",
        hls: true,
        hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
        dash: true,
        dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
        mediaRoot: mediaRoot, // Ustaw poprawną ścieżkę MediaRoot
        output: "live",
      },
    ],
  },
};

const nms = new NodeMediaServer(config);
nms.run();

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("videoStream", (data) => {
    console.log("Received video stream data");
    ffmpeg()
      .input(data)
      .inputFormat("rawvideo")
      .outputOptions("-vcodec libx264")
      .outputOptions("-f flv")
      .output("rtmp://localhost/live/stream")
      .on("start", function () {
        console.log("FFmpeg process started");
      })
      .on("codecData", function (data) {
        console.log(
          "Input is " + data.audio + " audio " + data.video + " video"
        );
      })
      .on("progress", function (progress) {
        console.log("Processing: " + progress.percent + "% done");
      })
      .on("error", function (err) {
        console.log("An error occurred: " + err.message);
      })
      .on("end", function () {
        console.log("Processing finished successfully");
      })
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
