import { useState } from "react";
import { useNavigate } from "react-router-dom";
const clientId =  "1064538177379-bjr5kdphshesmc3obqdp27ujbqeo5hh5.apps.googleusercontent.com"; 
function CreateBroadcast() {
  const navigate = useNavigate();

  const CreateBroadcast = async () => {
    const accessToken = localStorage.getItem("googleAccessToken"); // Replace with your method of storing the access token
    if (!accessToken) {
      console.log("Access token not found");
      return;
    }
    const broadcastData = {
      snippet: {
        title: "Test broadcast",
        scheduledStartTime: "2023-08-09T17:50:00Z",
        scheduledEndTime: "2023-08-09T17:55:00Z",
      },
      contentDetails: {
        enableClosedCaptions: true,
      },
      status: {
        privacyStatus: "unlisted",
      },
    };

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(broadcastData),
    };

    try {
      const response = await fetch(
        "https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet,status,contentDetails",
        options
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Broadcast created successfully:", data);
        navigate("/home"); 
      } else {
        console.log("Error creating broadcast");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }};
    
  return (
    
      <button onClick={CreateBroadcast}>Create Broadcast</button>
    
  );


}

export default CreateBroadcast;
