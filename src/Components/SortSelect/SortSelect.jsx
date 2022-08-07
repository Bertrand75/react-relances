import React, { useState, useContext } from "react";
import { useEffect } from "react";
import LanguageContext from "../../Context/LanguageContext";
import styles from "./SortSelect.module.css";

export default function SortSelect({ arrayToSort, setArrayToSort, params }) {
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  let [selectedValue, setSelectedValue] = useState();
  // Classer une liste en fonction d'un paramètre donné
  const sortList = (arrayToSort, setArrayToSort, param, ascDesc) => {
    let sortedList = [...arrayToSort].sort((a, b) => {
      // Ici on transforme les paramètre de la forme "x.y"(pour accéder à un sous objet) et on adapte le code pour qu'ils puissent fonctionner
      if (param.includes(".")) {
        let paramArray = param.split(".");
        let objectA = a[paramArray[0]];
        let valueA = objectA[paramArray[1]];
        let objectB = b[paramArray[0]];
        let valueB = objectB[paramArray[1]];
        // En fonction du paramètre qui gère l'ordre de tri
        if (ascDesc === "asc" || ascDesc === undefined) {
          return valueA < valueB ? 1 : -1;
        } else if (ascDesc === "desc") {
          return valueA > valueB ? 1 : -1;
        }
      }
      if (ascDesc === "asc" || ascDesc === undefined) {
        return a[param] < b[param] ? 1 : -1;
      } else if (ascDesc === "desc") {
        return a[param] > b[param] ? 1 : -1;
      }
    });
    setArrayToSort(sortedList);
  };
  useEffect(() => {
    sortList(arrayToSort, setArrayToSort, selectedValue, "asc");
  }, [selectedValue]);
  return (
    <div className={styles.triContainer}>
      <label htmlFor="tri">
        {language && language === "english" ? "Sort list" : "Trier la liste"} :
      </label>
      <select
        name="tri"
        id="tri"
        value={selectedValue}
        onChange={(event) => {
          setSelectedValue(event.target.value);
        }}
        className={styles.triSelect}
      >
        <option value="defaultOption">
          {language && language === "english"
            ? "Choose an option"
            : "Choisissez une option"}{" "}
          :
        </option>
        {Object.keys(params).map((param) => (
          <option key={param} value={param}>
            {params[param]}
          </option>
        ))}
      </select>
    </div>
  );
}
