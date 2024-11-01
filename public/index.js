const Config = {
  host: "localhost",
  port: 3000,
};

const socket = io(`${Config.host}:${Config.port}`);
let socket_id;

socket.on("from-server", function (_socket_id) {
  socket_id = _socket_id;
  console.log("Connected with socket id: " + socket_id);
});

socket.on("candidate-from-server", (data) => {
  remoteCandidates.push(data);
});

const videoElement = document.getElementById("videoPlayer");
const mediaSource = new MediaSource();

videoElement.src = URL.createObjectURL(mediaSource);
mediaSource.addEventListener("sourceopen", handleSourceOpen);

function handleSourceOpen() {
  const mediaSource = this;
  const sourceBuffer = mediaSource.addSourceBuffer(
    'video/webm; codecs="vorbis,vp8"'
  );

  socket.on("broadcast", (data) => {
    const { broadcastId, sdp } = data;
    const peer = new RTCPeerConnection(
      configurationPeerConnection,
      offerSdpConstraints
    );
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("add-candidate-consumer", {
          id: broadcastId,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      videoElement.srcObject = event.streams[0];
    };

    peer
      .setRemoteDescription(new RTCSessionDescription(sdp))
      .then(() => {
        return peer.createAnswer();
      })
      .then((answer) => {
        return peer.setLocalDescription(answer);
      })
      .then(() => {
        socket.emit("answer", {
          id: broadcastId,
          sdp: peer.localDescription,
        });
      })
      .catch(console.error);
  });

  socket.on("candidate-from-server", (data) => {
    const candidate = new RTCIceCandidate(data);
    peer.addIceCandidate(candidate).catch(console.error);
  });
}
