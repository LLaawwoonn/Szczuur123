document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("videoPlayer");
  const source = document.createElement("source");

  source.setAttribute("src", "http://localhost:8000/live/stream.flv");
  source.setAttribute("type", "video/flv");

  video.appendChild(source);
  video.onload();
});
