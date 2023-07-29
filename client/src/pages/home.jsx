import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const LiveStreamPage = () => {
  const videoRef = useRef();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let localStream;
    const getMediaStream = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: isCameraOn,
          audio: isAudioOn,
        });
        videoRef.current.srcObject = localStream;
        const peerConnection = new RTCPeerConnection();
        localStream.getTracks().forEach((track) =>
          peerConnection.addTrack(track, localStream)
        );
      } catch (error) {
        console.error("Error accessing webcam or microphone:", error);
      }
    };

    getMediaStream();
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn, isAudioOn, navigate]);

  const handleCameraToggle = () => {
    setIsCameraOn((prevIsCameraOn) => !prevIsCameraOn);
  };

  const handleAudioToggle = () => {
    setIsAudioOn((prevIsAudioOn) => !prevIsAudioOn);
  };

  return (
    <StyledContainer>
      <h1>Live Stream</h1>
      <StyledVideo>
        <video ref={videoRef} autoPlay playsInline muted={!isAudioOn} />
      </StyledVideo>
      <ButtonContainer>
        <button onClick={handleCameraToggle}>
          {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>
        <button onClick={handleAudioToggle}>
          {isAudioOn ? "Mute Audio" : "Unmute Audio"}
        </button>
      </ButtonContainer>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledVideo = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  margin: 20px 0;
  border: 1px solid #ccc;
  overflow: hidden;

  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 20px;

  button {
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

export default LiveStreamPage;
