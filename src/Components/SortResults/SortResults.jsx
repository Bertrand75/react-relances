import React, { useState, useContext } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import LanguageContext from "../../Context/LanguageContext";
import styles from "./SortResults.module.css";

export default function SortResults({ datas, setDatas, searchParams }) {
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  // Affichage du contenu du menu déroulant
  const [visible, setVisible] = useState(false);
  // Paramètre de tri qui est sélectionné
  const [selectedSearchParam, setSelectedSearchParam] = useState();

  // Fonction de tri
  const sortDatas = (sortParam) => {
    setSelectedSearchParam(sortParam[1]);
    let sortParam0 = sortParam[0];
    const sortedDatas = [...datas].sort((a, b) => {
      return a[sortParam0] > b[sortParam0] ? 1 : -1;
    });

    setDatas(sortedDatas);
    setVisible(false);
  };

  // Affichage
  return (
    <div
      className={
        styles.selectContainer + " " + styles.selectInput + " clickable"
      }
    >
      <div>
        <div onClick={() => setVisible((value) => !value)}>
          {!selectedSearchParam && (
            <div className={styles.selectAll}>
              {language && language === "english"
                ? "Sort results"
                : "Trier les résultats"}
            </div>
          )}
          {selectedSearchParam && <div>{selectedSearchParam}</div>}
          <div className={styles.chevron}>
            {visible ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>

        <ul
          className={
            styles.paramList + ` ${!visible && styles.paramListReduced}`
          }
        >
          {searchParams.map((param) => (
            <li
              key={param[0]}
              className={styles.selectThis}
              onClick={() => sortDatas(param)}
            >
              {param[1]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
