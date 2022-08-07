import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./FormMask.module.css";

export default function FormMask({ children, title, displayOn, setDisplayOn }) {
  const [display, setDisplay] = useState(false);

  const handleDisplay = () => {
    // Nous gardons les deux display pour que le composant puisse
    // S'ouvrir lorsqu'on souhaite faire un update
    // Fonctionner indépendemment si displayOn et setDisplayOn ne lui sont pas passés (dans un autre cas d'utilisation par exemple)
    setDisplay((display) => !display);
    setDisplayOn((displayOn) => !displayOn);
  };

  useEffect(() => {
    displayOn && setDisplay(true);
  }, [displayOn]);
  return (
    <>
      <div className={styles.maskDiv + " clickable"} onClick={handleDisplay}>
        <h2>
          {title}{" "}
          {display ? (
            <FaChevronUp className={styles.floatRight} size="1.4em" />
          ) : (
            <FaChevronDown className={styles.floatRight} size="1.4em" />
          )}
        </h2>
      </div>

      <div className={display ? styles.visible : styles.hidden}>{children}</div>
    </>
  );
}
