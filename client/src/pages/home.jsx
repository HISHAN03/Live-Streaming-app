import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const LiveStreamPage = () => {
  const videoRef = useRef();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  useEffect(() => {
    // Access user's webcam and microphone and attach the stream to the video element
    navigator.mediaDevices
      .getUserMedia({ video: isCameraOn, audio: isAudioOn })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing webcam or microphone:", error);
      });
  }, [isCameraOn, isAudioOn]);

  const handleCameraToggle = () => {
    setIsCameraOn((prevIsCameraOn) => !prevIsCameraOn);
  };

  const handleAudioToggle = () => {
    setIsAudioOn((prevIsAudioOn) => !prevIsAudioOn);
  };

  return (
    <StyledContainer>
      <h1>Live Stream</h1>
      <StyledVideo ref={videoRef} autoPlay playsInline muted={!isAudioOn} />
      <ButtonContainer>
        <button onClick={handleCameraToggle}>{isCameraOn ? "Turn Off Camera" : "Turn On Camera"}</button>
        <button onClick={handleAudioToggle}>{isAudioOn ? "Mute Audio" : "Unmute Audio"}</button>
      </ButtonContainer>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledVideo = styled.video`
  width: 640px;
  height: 480px;
  margin: 20px 0;
  border: 1px solid #ccc;
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
