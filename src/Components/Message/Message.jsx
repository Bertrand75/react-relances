import React, { useState, useEffect } from "react";
import styles from "./Message.module.css";

export default function Message({ message }) {
  // En fonction du type de message (erreur ou succes), ajustement du style
  const okNokStyle =
    message.status && message.status !== 200 && message.status !== 201
      ? styles.errorMessageContainer
      : styles.okMessageContainer;

  // Etat de l'affichage du message
  const [displayMessage, setDisplayMessage] = useState(true);

  // On fait en sorte que le message s'efface au bout de 3 secondes
  useEffect(() => {
    setDisplayMessage(true);
    let timer = setTimeout(() => setDisplayMessage(false), 2500);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <>
      {displayMessage && message.content && (
        <div className={styles.messageContainer + " " + okNokStyle}>
          {message.content}
        </div>
      )}
    </>
  );
}
