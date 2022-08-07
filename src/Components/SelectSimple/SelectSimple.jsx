import React, { useContext } from "react";
import LanguageContext from "../../Context/LanguageContext";

export default function SelectSimple(props) {
  // selectedItem (l'objet selectionné dans la liste), items la liste à afficher, params la ou les propriété(s) à afficher dans chaque option
  const { selectedItem, setSelectedItem, params, items } = props;
  // Récupération de la langue
  const { language } = useContext(LanguageContext);

  const handleChange = (event) => {
    // récupérer l' id (contenu dans value) à partir de la HTML collection
    // Attribuer l'objet à selectedItem
    const newItem = items.filter(
      (item) => item._id === event.target.selectedOptions[0].value
    );
    setSelectedItem(newItem[0]);
  };

  return (
    <select
      onChange={(event) => {
        handleChange(event);
      }}
      value={selectedItem ? selectedItem._id : "default"}
      className="inputClass"
    >
      <option value="default" key="123456789">
        {language && language === "english"
          ? "Select an item from the list"
          : "Selectionnez un élément dans la liste"}
      </option>
      {items &&
        items.map((item) => {
          return (
            <option
              // On fait en sorte que la key et la value soient différentes pour contourner un bug avec le key qui crée un warning
              key={item._id + "1"}
              value={item._id}
              //defaultValue={selectedItem && selectedItem._id === item._id}
            >
              {
                // En fonction du type de table, les propriétés affichées seront différentes
                params.map((param) => item[param] + " ")
              }
            </option>
          );
        })}
    </select>
  );
}
