import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";

const LiveStreamPage = () => 
{
const videoRef = useRef();
const [isCameraOn, setIsCameraOn] = useState(true);
const [isAudioOn, setIsAudioOn] = useState(true);
const navigate = useNavigate();
const [searchInput, setSearchInput] = useState("");
const [youtubeIngestionUrl, setYoutubeIngestionUrl] = useState('')
const [youtubeStreamName, setYoutubeStreamName] = useState('')
const [streamId, setstreamId] = useState('')
const [ broadcastId,setbroadcastId ] = useState('');
const mediaRecorderRef = useRef();

gapi.load('client', () => 
{
  gapi.client.init({
    apiKey: "AIzaSyBh4zJKpPWEhYv4L27a6bPMdIhHFgwm1bw",
      clientId: "1064538177379-bjr5kdphshesmc3obqdp27ujbqeo5hh5.apps.googleusercontent.com",
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
      scope: 'https://www.googleapis.com/auth/youtube', 
    });
  });

  gapi.load('client', () => {
    gapi.client.init({
      apiKey: "AIzaSyBh4zJKpPWEhYv4L27a6bPMdIhHFgwm1bw",
        clientId: "1064538177379-bjr5kdphshesmc3obqdp27ujbqeo5hh5.apps.googleusercontent.com",
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
        scope: 'https://www.googleapis.com/auth/youtube', 
      });
});
  
  const createYouTubeBroadcast = async () => {
  try {
    await gapi.auth2.getAuthInstance().signIn(); 
    const user = gapi.auth2.getAuthInstance().currentUser.get();
    const accessToken = user.getAuthResponse().access_token;
    
    if (!accessToken) {
      console.log("Access token not found");
      return;
    }
    
    const broadcastData = {
      snippet: {
        title: "Test broadcast",
        scheduledStartTime: "2023-08-10T20:50:00Z",
        scheduledEndTime: "2023-08-10T20:55:00Z",
      },
      contentDetails: {
        enableClosedCaptions: true,
        enableContentEncryption: true,
        enableDvr: true,
        enableEmbed: true,
        recordFromStart: true,
        startWithSlate: true,
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: true,
      },
    };

    const response = await gapi.client.youtube.liveBroadcasts.insert({
      part: ['id', 'snippet', 'contentDetails', 'status'],
      resource: broadcastData,
    }).then((res) => {
      console.log('Response', res)
      console.log(res.result.id)
      setbroadcastId(res.result.id)
    })
    .catch((err) => {
      console.error('Execute error', err)
    });

    if (response.result) {
      console.log("Broadcast created successfully:", response.result);
  

      navigate("/home");
    } else {
      console.log("Error creating broadcast");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

useEffect(() => {
  let localStream;

  const getMediaStream = async () => {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: isCameraOn,
        audio: isAudioOn,
      });
      videoRef.current.srcObject = localStream;
      mediaRecorderRef.current = new MediaRecorder(localStream, {
        mimeType: "video/webm;codecs=h264",
      });
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          // Handle the recorded data here
          sendRecordedDataToServer(event.data);
        }
      };
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
}, [isCameraOn, isAudioOn]);

const handleStartRecording = () => {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.start();
    console.log("Recording started.");
  }
};

const handleStopRecording = () => {
  if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
    mediaRecorderRef.current.stop();
    console.log("Recording stopped.");
  }
};

const sendRecordedDataToServer = (data) => {
  // Implement the logic to send the recorded data to the server
  // For example, you can use WebSocket, fetch API, or other methods
  console.log("Sending recorded data to server:", data);
};

  const handleCameraToggle = () => {
    setIsCameraOn((prevIsCameraOn) => !prevIsCameraOn);
  };

  const handleAudioToggle = () => {
    setIsAudioOn((prevIsAudioOn) => !prevIsAudioOn);
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

  const createStream = () => {
    return gapi.client.youtube.liveStreams
      .insert({
        part: ['id,snippet,cdn,contentDetails,status'],
        resource: {
          snippet: {
            title: "Your new video stream's name",
            description:
              'A description of your video stream. This field is optional.',
          },
          cdn: {
            frameRate: 'variable',
            ingestionType: 'rtmp',
            resolution: 'variable',
            format: '',
          },
          contentDetails: {
            isReusable: true,
          },
        },
      })
      .then((res) => {
        console.log('Response', res)

        setstreamId(res.result.id)
        console.log('streamID' + res.result.id)

        setYoutubeIngestionUrl(res.result.cdn.ingestionInfo.ingestionAddress)
        console.log(res.result.cdn.ingestionInfo.ingestionAddress)

        setYoutubeStreamName(res.result.cdn.ingestionInfo.streamName)
        console.log(res.result.cdn.ingestionInfo.streamName)
      })
      .catch((err) => {
        console.log('Execute error', err)
      })
    }
    const bindBroadcastToStream = () => {
      return gapi.client.youtube.liveBroadcasts
        .bind({
          part: ['id,snippet,contentDetails,status'],
          id: broadcastId,
          streamId: streamId,
        })
        .then((res) => {
          console.log("sucess binding"+'Response', res)
        })
        .catch((err) => {
          console.error('Execute error', err)
        })
    }


    const transitionToLive = () => {
      return gapi.client.youtube.liveBroadcasts
        .transition({
          part: ['id,snippet,contentDetails,status'],
          broadcastStatus: 'live',
          id: broadcastId,
        })
        .then((res) => {
          // Handle the results here (response.result has the parsed body).
          console.log('Response', res)
        })
        .catch((err) => {
          console.log('Execute error', err)
        })
    }

return(  
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
        <video ref={videoRef} autoPlay muted />
      <button onClick={handleStartRecording}>Start Recording</button>
      <button onClick={handleStopRecording}>Stop Recording</button>
        <button onClick={() => authenticate().then(loadClient)}>authenticate</button> 

       <button onClick={createYouTubeBroadcast}> broadcast</button>
        <button onClick={createStream}>crete stream</button> 
        <button onClick={bindBroadcastToStream}>4. bind broadcast</button>
        <button onClick={transitionToLive}>live</button>


      </ButtonContainer> 

        </ StyledContainer>
      )
  
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
