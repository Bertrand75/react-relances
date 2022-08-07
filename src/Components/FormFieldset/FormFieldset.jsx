import React from "react";
import styles from "./FormFieldset.module.css";

export default function FormFielset({ children, title }) {
  return (
    <fieldset className={styles.fieldsetClass}>
      <legend className={styles.legendClass}>{title}</legend>
      <div className={styles.FormFielsetContent}>{children}</div>
    </fieldset>
  );
}
