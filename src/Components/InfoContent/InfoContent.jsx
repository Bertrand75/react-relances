import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import styles from "./InfoContent.module.css";

export default function InfoContent({ textInfo }) {
  return (
    <div className={styles.infoContainer}>
      <FaInfoCircle size="2em" className={styles.infoIcon} />
      <div>{textInfo}</div>
    </div>
  );
}
