document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("videoPlayer");
  const source = document.createElement("source");

  source.setAttribute("src", "output.mp4");
  source.setAttribute("type", "video/mp4");

  video.appendChild(source);
  video.load();
});
