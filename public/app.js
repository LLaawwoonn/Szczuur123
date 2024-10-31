document.addEventListener("DOMContentLoaded", function () {
  const videoElement = document.getElementById("videoPlayer");
  const socket = io();

  if (flvjs.isSupported()) {
    const flvPlayer = flvjs.createPlayer({
      type: "flv",
      url: "ws://localhost:8000/live/stream.flv",
    });
    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load();
    flvPlayer.play();
  }

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = function (event) {
        socket.emit("videoStream", event.data);
      };
      mediaRecorder.start(1000); // send data every second
    })
    .catch((error) => {
      console.error("Error accessing media devices.", error);
    });
});
