// BroadcastManager.js
import React, { useState } from "react";

export const BroadcastContext = React.createContext();

const BroadcastManager = ({ children }) => {
  const [broadcastId, setBroadcastId] = useState("");

  return (
    <BroadcastContext.Provider value={{ broadcastId, setBroadcastId }}>
      {children}
    </BroadcastContext.Provider>
  );
};

export default BroadcastManager;
