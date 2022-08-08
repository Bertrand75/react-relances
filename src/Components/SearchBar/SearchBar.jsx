//import { element } from "prop-types";
import React, { useEffect, useState, useContext } from "react";
import LanguageContext from "../../Context/LanguageContext";
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import SortResults from "../SortResults/SortResults";
import styles from "./SearchBar.module.css";

function SearchBar({
  datas,
  setDatas,
  visibleDatas,
  setVisibleDatas,
  searchParams,
}) {
  // Récupération de la langue
  const { language } = useContext(LanguageContext);

  // Le mot recherché
  const [searchString, setSearchString] = useState("");

  // Affichage du contenu du menu déroulant
  const [visible, setVisible] = useState(false);

  // Liste des paramètres sur lesquels doit s'effectuer la recherche
  const [selectedSearchParams, setSelectedSearchParams] = useState([]);

  // Idem que ci-dessus mais pour l'affichage dans la barre de recherche uniquement
  const [selectedParamsDisplay, setSelectedParamsDisplay] = useState([]);

  // Fonction de recherche
  const searchExpression = (event) => {
    event.preventDefault(); // Pour éviter le rechargement de la page

    if (searchString === "") {
      // Si la chaîne recherchée est vide, on affiche toutes les données
      setVisibleDatas(datas);
    } else {
      // Sinon on affiche les données qui contiennent la chaine de caractère recherchée
      // Pour chaque item et pour chaque paramètre de recherche, on regarde si la chaine est présente dans l'item;
      //si oui on l'ajoute au tableau des résultats
      let dataResults = [];

      datas.forEach((element) => {
        selectedSearchParams.forEach((searchParam) => {
          if (element[searchParam]) {
            if (
              element[searchParam]
                .toLowerCase()
                .includes(searchString.toLowerCase()) &&
              !dataResults.includes(element)
            ) {
              dataResults.push(element);
            }
          }
        });
      });

      setVisibleDatas(dataResults);
    }
  };

  // Gestion des checkbox
  const handleCheckbox = (checked, param) => {
    if (checked) {
      // Si on la coche, on ajoute le paramètre à la liste
      setSelectedSearchParams([...selectedSearchParams, param[0]]);
      // affichage (dans l'input)
      setSelectedParamsDisplay([...selectedParamsDisplay, param[1]]);
    } else {
      // Sinon on le retire
      let newValues = selectedSearchParams.filter(
        (element) => element !== param[0]
      );
      setSelectedSearchParams(newValues);
      // affichage (dans l'input)
      let newValuesDisplay = selectedParamsDisplay.filter(
        (element) => element !== param[1]
      );
      setSelectedParamsDisplay(newValuesDisplay);
    }
  };

  useEffect(() => {
    // Par défault tous les paramètres de recherche sont cochés
    let selectAllParams = searchParams.map((searchParams) => searchParams[0]);
    setSelectedSearchParams(selectAllParams);
    let selectAllParamsDisplay = searchParams.map(
      (searchParams) => searchParams[1]
    );
    setSelectedParamsDisplay(selectAllParamsDisplay);
  }, [searchParams]);

  // ******************************* AFFICHAGE **********************************
  return (
    <form className={styles.searchBar} onSubmit={(e) => searchExpression(e)}>
      <div className="flexH" style={{ flexGrow: 1 }}>
        <input
          type="search"
          placeholder={
            language && language === "english"
              ? "Perform a search"
              : "Effectuer une recherche"
          }
          className={styles.searchBarInput}
          onChange={(event) => {
            setSearchString(event.target.value);
          }}
        />
        <button type="submit" className="clickable">
          <FaSearch size="2.5em" className={styles.searchBarIcon}></FaSearch>
        </button>
      </div>
      <div className="flexH">
        <div
          className={
            styles.selectContainer + " " + styles.selectInput + " clickable"
          }
        >
          <div onClick={() => setVisible((value) => !value)}>
            {selectedSearchParams.length === searchParams.length && (
              <div className={styles.selectAll}>
                {language && language === "english"
                  ? "All search terms"
                  : "Tous les critères"}
              </div>
            )}
            {selectedSearchParams.length > 0 &&
              selectedSearchParams.length < searchParams.length && (
                <div>{selectedParamsDisplay.map((param) => param + " ")}</div>
              )}
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
              <label htmlFor={param[0] + "input"} key={param[0]}>
                <li className={styles.selectThis}>
                  <input
                    id={param[0] + "input"}
                    checked={selectedSearchParams.includes(param[0])}
                    type="checkbox"
                    onChange={(e) => handleCheckbox(e.target.checked, param)}
                  />{" "}
                  {param[1]}
                </li>
              </label>
            ))}
          </ul>
        </div>
        <SortResults
          datas={datas}
          setDatas={setDatas}
          searchParams={searchParams}
        />
      </div>
    </form>
  );
}
export default SearchBar;
