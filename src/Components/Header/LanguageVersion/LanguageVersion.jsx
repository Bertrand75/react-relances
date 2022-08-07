import React, { useContext } from "react";
import LanguageContext from "../../../Context/LanguageContext";
import ukFlag from "./../../../Images/flag_uk.png";
import franceFlag from "./../../../Images/flag_france.png";
import styles from "./LanguageVersion.module.css";

export default function LanguageVersion() {
  // Récupération de la langue
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <div
      className={styles.flagContainer}
      onClick={() => {
        language === "english"
          ? setLanguage("français")
          : setLanguage("english");
      }}
    >
      {language && language === "english" ? (
        <img src={franceFlag} alt="drapeau français" className={styles.flag} />
      ) : (
        <img src={ukFlag} alt="english flag" className={styles.flag} />
      )}
    </div>
  );
}
