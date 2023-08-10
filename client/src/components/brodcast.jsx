  import { gapi } from "gapi-script";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import BroadcastManager from "./brodcsatID";
  function CreateBroadcast() {
    const navigate = useNavigate();
    
    gapi.load('client', () => {
      gapi.client.init({
        apiKey: "AIzaSyBh4zJKpPWEhYv4L27a6bPMdIhHFgwm1bw",
          clientId: "1064538177379-bjr5kdphshesmc3obqdp27ujbqeo5hh5.apps.googleusercontent.com",
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
          scope: 'https://www.googleapis.com/auth/youtube', 
        });
      });
      
      
      
      const createYouTubeBroadcast = async () => {
        const { broadcastId,setbroadcastId } = useContext(BroadcastContext);
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
  
    return (
      <button onClick={createYouTubeBroadcast}>Create Broadcast</button>
    );
  }
  
  export default CreateBroadcast;
  