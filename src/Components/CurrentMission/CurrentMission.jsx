import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import LanguageContext from "../../Context/LanguageContext";
import MissionContext from "../../Context/MissionContext";

import styles from "./CurrentMission.module.css";

export default function CurrentMission() {
  // Récupération de la mission courante
  const { currentMission } = useContext(MissionContext);
  // Récupération de la langue
  const { language } = useContext(LanguageContext);

  return (
    <div className={styles.currentMission}>
      <h3>
        {language && language === "english"
          ? "Current mission"
          : "Mission en cours"}{" "}
        :
      </h3>
      {currentMission && currentMission.name ? (
        <NavLink to={"/missions/current/"} className={styles.missionLink}>
          <p>{currentMission.name}</p>
        </NavLink>
      ) : (
        <p style={{ color: "red" }}>
          {language && language === "english" ? "None" : "Aucune"}
        </p>
      )}
    </div>
  );
}
