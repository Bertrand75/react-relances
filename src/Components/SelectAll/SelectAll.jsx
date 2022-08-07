import React, { useContext } from "react";
import LanguageContext from "../../Context/LanguageContext";
import styles from "./SelectAll.module.css";

export default function SelectAll({
  datas,
  deleteData,
  itemsToDelete,
  setItemsToDelete,
}) {
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  // Ajouter tous les éléments à la liste de suppression
  const selectAll = () => {
    let allIds = datas.map((data) => data._id);
    setItemsToDelete(allIds);
  };
  // Retirer tous les éléments de la liste de suppression
  const unselectAll = () => {
    setItemsToDelete([]);
  };
  // Supprimer tous les items inclus dans la liste à supprimer
  const deleteTopicsFromList = () => {
    itemsToDelete.forEach((topicId) => deleteData(topicId));
  };
  return (
    <div className={styles.deleteModule}>
      <label htmlFor="selectAll" className={styles.disappear768}>
        {language && language === "english"
          ? "Select all items"
          : "Sélectionner tous les éléments"}
      </label>
      <label htmlFor="selectAll" className={styles.appear768}>
        {language && language === "english"
          ? "Select everything"
          : "Tous sélectionner"}
      </label>
      <input
        id="selectAll"
        className={styles.checkboxInput}
        type="checkbox"
        onClick={(e) => {
          e.target.checked ? selectAll() : unselectAll();
        }}
      ></input>
      <button
        onClick={deleteTopicsFromList}
        disabled={itemsToDelete.length === 0}
      >
        {language && language === "english"
          ? "Delete selection"
          : "Supprimer la sélection"}
      </button>
    </div>
  );
}
