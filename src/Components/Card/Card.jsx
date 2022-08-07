import React from "react";
import { FaWindowClose, FaPenSquare } from "react-icons/fa";
import styles from "./Card.module.css";

export default function Card({ item, deleteItem, loadForm, children }) {
  return (
    <div className={styles.card}>
      <div>{children}</div>
      <div className={styles.cardButtons}>
        <FaPenSquare
          onClick={() => loadForm(item)}
          size="2.7em"
          className={styles.cardButton}
        />
        <FaWindowClose
          onClick={() => deleteItem(item._id)}
          size="2.7em"
          className={styles.cardButton}
        />
      </div>
    </div>
  );
}
