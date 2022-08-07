import React, { useContext } from "react";
import LanguageContext from "../../Context/LanguageContext";
import PropTypes from "prop-types";
import styles from "./FormButton.module.css";

export default function FormButton({ updateMode, cancelUpdate }) {
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  return (
    <>
      <input
        type="submit"
        value={
          updateMode
            ? language === "english"
              ? "Modify item"
              : "Modifier la fiche"
            : language === "english"
            ? "Create item"
            : "Créer la fiche"
        }
        className={styles.formButton}
      />
      {updateMode ? (
        <button onClick={() => cancelUpdate()} className={styles.formButton}>
          {language && language === "english"
            ? "Empty the form"
            : "Vider le formulaire"}
        </button>
      ) : null}
    </>
  );
}
FormButton.propTypes = {
  updateMode: PropTypes.bool,
  cancelUpdate: PropTypes.func.isRequired,
};

FormButton.defaultProps = {
  updateMode: false,
};
