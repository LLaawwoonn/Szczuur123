document.addEventListener("DOMContentLoaded", function () {
  const videoElement = document.getElementById("videoPlayer");
  console.log("DOM fully loaded and parsed");

  if (flvjs.isSupported()) {
    console.log("FLV.js is supported");
    const flvPlayer = flvjs.createPlayer({
      type: "flv",
      url: "ws://localhost:8080/live.flv",
    });
    console.log("FLV player created with URL ws://localhost:8080/live.flv");

    flvPlayer.attachMediaElement(videoElement);
    console.log("FLV player attached to video element");

    videoElement.muted = true; // Wycisz wideo, aby umożliwić automatyczne odtwarzanie
    flvPlayer.load();
    console.log("FLV player loaded");

    flvPlayer.on("play", function () {
      console.log("FLV player is playing");
    });

    flvPlayer.on("error", function (err) {
      console.error("FLV player error: ", err);
    });

    flvPlayer.play();
  } else {
    console.log("FLV.js is not supported");
  }

  console.log("Connecting to socket...");

  const socket = io.connect("http://localhost:8000");

  socket.on("connect", function () {
    console.log("Socket connected");
  });

  socket.on("disconnect", function () {
    console.log("Socket disconnected");
  });

  socket.on("error", function (err) {
    console.error("Socket error:", err);
  });

  socket.on("videoStream", function (data) {
    console.log("Received video stream data:", data);
  });
});
