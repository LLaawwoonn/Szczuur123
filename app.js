document.addEventListener("DOMContentLoaded", function () {
  const videoElement = document.getElementById("videoPlayer");

  if (flvjs.isSupported()) {
    const flvPlayer = flvjs.createPlayer({
      type: "flv",
      url: "http://192.168.1.100:8000/live/stream.flv",
    });
    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load();
    flvPlayer.play();
  }
});
