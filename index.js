const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const NodeMediaServer = require("node-media-server");

// Initialize Express app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Define media root directory with full path
const mediaRoot = path.resolve(__dirname, "media");
console.log("MediaRoot is set to:", mediaRoot);

// Check if media directory exists and create if not
if (!fs.existsSync(mediaRoot)) {
  fs.mkdirSync(mediaRoot);
  console.log("Media folder created at:", mediaRoot);
} else {
  console.log("Media folder already exists at:", mediaRoot);
}

// Check if media directory is writable
fs.access(mediaRoot, fs.constants.W_OK, (err) => {
  if (err) {
    console.error("MediaRoot folder is not writable:", err);
  } else {
    console.log("MediaRoot folder is writable.");
  }
});

const config = {
  logType: 3,
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
    ffmpeg: "avconv", // Set to avconv for Libav
    mediaRoot: mediaRoot,
    tasks: [
      {
        app: "live",
        hls: true,
        hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
        dash: true,
        dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
        output: "live",
        mediaRoot: mediaRoot,
      },
    ],
  },
};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("videoStream", (data) => {
    console.log("Received video stream data");

    // Use child_process to run avconv
    const avconvCommand = `avconv -i ${data} -vcodec libx264 -f flv rtmp://localhost/live/stream`;
    exec(avconvCommand, (err, stdout, stderr) => {
      if (err) {
        console.error(`An error occurred: ${err.message}`);
        return;
      }
      console.log(`avconv stdout: ${stdout}`);
      console.error(`avconv stderr: ${stderr}`);
    });
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

console.log("Initializing NodeMediaServer...");
const nms = new NodeMediaServer(config);
nms.run();
console.log("NodeMediaServer initialized and running.");
