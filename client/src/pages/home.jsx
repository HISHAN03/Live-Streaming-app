import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Brodcast from "../components/brodcast";
import {gapi} from "gapi-script";
const LiveStreamPage = () => {
const videoRef = useRef();
const [isCameraOn, setIsCameraOn] = useState(true);
const [isAudioOn, setIsAudioOn] = useState(true);
const navigate = useNavigate();
const [searchInput, setSearchInput] = useState("");
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

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:3010/search?name=${searchInput}`);
      const searchResults = await response.json();
      console.log(searchResults);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  
  const authenticate = () => {
    return gapi.auth2
      .getAuthInstance()
      .signIn({ scope: 'https://www.googleapis.com/auth/youtube.force-ssl' })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => console.log(err))
  }

  const loadClient = () => {
    gapi.client.setApiKey("AIzaSyBh4zJKpPWEhYv4L27a6bPMdIhHFgwm1bw")
    return gapi.client
      .load('https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest')
      .then((res) => {
        console.log('GAPI client loaded for API')
        console.log(res)
      })
      .catch((err) => console.log('Error loading GAPI client for API', err))
  }


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
        <button onClick={() => authenticate().then(loadClient)}>authenticate</button> 
        <button onClick={handleAudioToggle}>click me</button> 

        <Brodcast />
      </ButtonContainer> 

        </ StyledContainer>
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
