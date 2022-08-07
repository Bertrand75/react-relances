import React from "react";
import styles from "./EmptyPage.module.css";

export default function EmptyPage({ textInfo }) {
  return (
    <div className={styles.container}>
      <p>{textInfo ? textInfo : "Contenu indisponible"}</p>
    </div>
  );
}
