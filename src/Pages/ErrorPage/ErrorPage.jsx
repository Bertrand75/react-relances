import React from "react";
import styles from "./ErrorPage.module.css";

export default function ErrorPage() {
  return (
    <div>
      <h1>Erreur 404</h1>
      <p className={styles.pError}>La page que vous demandez n'existe pas</p>
    </div>
  );
}
