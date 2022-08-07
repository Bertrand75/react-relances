import React, { createContext, useState } from "react";

const MissionContext = createContext();
export default MissionContext;

export const MissionContextProvider = ({ children }) => {
  let initMission = JSON.parse(localStorage.getItem("currentMission"));

  const [currentMission, setCurrentMission] = useState(initMission);

  return (
    <MissionContext.Provider value={{ currentMission, setCurrentMission }}>
      {children}
    </MissionContext.Provider>
  );
};
