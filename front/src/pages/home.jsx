import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";
import socketIOClient from 'socket.io-client';
const serverEndpoint = 'http://localhost:3100';


const LiveStreamPage = () => 
{
  const [recordingActive, setRecordingActive] = useState(false); 
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [youtubeStreamName, setYoutubeStreamName] = useState('')
  const [youtubeIngestionUrl, setYoutubeIngestionUrl] = useState('')
  const [streamId, setstreamId] = useState('')
  const [ broadcastId,setbroadcastId ] = useState('');
  const mediaRecorderRef = useRef();
  const socket = socketIOClient(serverEndpoint);



  useEffect(() => {

    const handleFramesReceived = () => {
      console.log('Video frames received successfully'); // You can replace this with your desired action
    };

    socket.on('connect', () => {
      console.log('Connected to the server');

      socket.on('framesReceived', handleFramesReceived);
    });

    socket.on('disconnect', () => {
    console.log('Disconnected from the server');
    socket.off('framesReceived', handleFramesReceived);
    });

    // const handleDataAvailable = (event) => {
    //   if (event.data && event.data.size > 0) {
    //     if (socket) {
    //       console.log('sending frames');
    //       socket.emit('videoFrame', event.data);

    //       // Listen for a response from the server
    //       socket.on('framesReceived', () => {
    //         console.log('Server acknowledged frames received successfully.');
    //         // You can add additional handling here if needed
    //       });
    //     }
    //   }
    // };

    // mediaRecorderRef.current.ondataavailable = handleDataAvailable;


    return () => {
    socket.disconnect();
    };
    }, []);

gapi.load('client', () => 
 {
    gapi.client.init({
    apiKey: "AIzaSyBh4zJKpPWEhYv4L27a6bPMdIhHFgwm1bw",
    clientId: "1064538177379-bjr5kdphshesmc3obqdp27ujbqeo5hh5.apps.googleusercontent.com",
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
    scope: 'https://www.googleapis.com/auth/youtube', 
    });
  });

gapi.load('client', () => 
 {
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
        scheduledStartTime: "2023-10-10T20:50:00Z",
        scheduledEndTime: "2023-10-10T20:55:00Z",
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
      if (res.result) {
        console.log("Broadcast created successfully:", res.result);
      }
  
    })
    .catch((err) => {
      console.error('Execute error', err)
    });

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
        videoBitsPerSecond: 3000000,
        audioBitsPerSecond: 64000,
   
      });
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          if (socket) { // Note: Removed .current
            console.log('sending frames');
            socket.emit('videoFrame', event.data);
    
            // Listen for a response from the server
            socket.on('framesReceived', () => {
              console.log('Server acknowledged frames received successfully.');
              // You can add additional handling here if needed
            });
          }
        }
       // mediaRecorderRef.current.start();

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
}, [isCameraOn, isAudioOn,recordingActive]);
const toggleRecording = () => {
  if (!isRecording) {
    mediaRecorderRef.current.start();
    setIsRecording(true);
    setRecordingActive(true); // Start recording
    console.log("Recording started.");
  } else {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setRecordingActive(false); // Stop recording
    console.log("Recording stopped.");
  }
};

// const handleStartRecording = () => {
//   if (mediaRecorderRef.current && !isRecording) {
    
//     mediaRecorderRef.current.start();
//     setIsRecording(true);
//     console.log("Recording started.");
//   }
// };


// const handleStopRecording = () => {
//   if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
//     mediaRecorderRef.current.stop();
//     setIsRecording(false);
//     console.log("Recording stopped.");
//   }
// };

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
        console.log(res+"aut sucess")
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
      sendStreamDataToServer(res.result.id, res.result.cdn.ingestionInfo.ingestionAddress,res.result.cdn.ingestionInfo.streamName);
      setYoutubeStreamName(res.result.cdn.ingestionInfo.streamName)
      console.log("streamName"+res.result.cdn.ingestionInfo.streamName)
    })
    .catch((err) => {
      console.log('Execute error', err)
      })
    }

    const sendStreamDataToServer = (streamId, ingestionUrl,YoutubeStreamName) => {
      const serverUrl = 'http://localhost:3100/youtube'; // Replace with your server's URL
    
      const data = {
        streamId: streamId,
        ingestionUrl: ingestionUrl,
        iid:YoutubeStreamName
      };
    
      // Make an HTTP POST request to your server
      fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            console.log('Data sent to server successfully.');
          } else {
            console.error('Failed to send data to server.');
          }
        })
        .catch((error) => {
          console.error('Error sending data to server:', error);
        });
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
          broadcastStatus: 'live',
          id: broadcastId,
          part: ['id,snippet,contentDetails,status'],
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
        <button onClick={toggleRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        {/* <video ref={videoRef} autoPlay muted /> */}
      {/* <button onClick={handleStartRecording}>Start Recording</button>
      <button onClick={handleStopRecording}>Stop Recording</button> */}
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
