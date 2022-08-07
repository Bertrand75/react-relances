import React, { useState } from "react";

import { FiPlusSquare, FiXSquare } from "react-icons/fi";
import { FaWindowClose, FaPenSquare } from "react-icons/fa";
import styles from "./CardHoriz.module.css";

export default function CardHoriz({
  children,
  itemReduced,
  item,
  displayOn,
  setDisplayOn,
  logo,
  deleteItem,
  loadForm,
  itemsToDelete,
  setItemsToDelete,
}) {
  const [display, setDisplay] = useState(false);
  // Affichage ou non du contenu de la card
  const handleDisplay = () => {
    setDisplay((display) => !display);
    setDisplayOn && setDisplayOn((displayOn) => !displayOn);
  };
  // Ajouter un item à la liste des items à supprimer
  const addItemToDeleteList = (itemId) => {
    setItemsToDelete((idList) => [...idList, itemId]);
  };
  // Retirer un item de la liste des items à supprimer
  const removeItemFromDeleteList = (topicId) => {
    setItemsToDelete(itemsToDelete.filter((itemId) => itemId !== topicId));
  };

  // *************************  AFFICHAGE  ***********************************
  return (
    <div className={styles.container}>
      <div className={styles.maskDiv + " clickable"} onClick={handleDisplay}>
        {logo && (
          <div className={styles.widthS + " flexH"}>
            <img src={logo} alt="logo" className={styles.visuel} />
          </div>
        )}
        {Object.keys(itemReduced).map((param, paramIndex) => {
          return itemReduced[param] ? (
            <div
              key={item._id + param}
              className={`${styles.widthL} ${
                paramIndex >= 1 && styles.disappear768
              }`}
            >
              {itemReduced[param]}
            </div>
          ) : (
            <div
              key={item._id + param}
              className={`${styles.widthL} ${
                paramIndex >= 1 && styles.disappear768
              }`}
            >
              NC
            </div>
          );
        })}

        <div className={styles.widthMS}>
          {/* Input se suppression optionnel */}
          {itemsToDelete && (
            <input
              className={styles.checkboxInput + " " + styles.floatRight}
              type="checkbox"
              checked={itemsToDelete.includes(item._id)}
              onChange={(e) => {
                e.target.checked
                  ? addItemToDeleteList(item._id)
                  : removeItemFromDeleteList(item._id);
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            ></input>
          )}
          {display ? (
            <FiXSquare className={styles.floatRight} size="1.4em" />
          ) : (
            <FiPlusSquare className={styles.floatRight} size="1.4em" />
          )}
        </div>
      </div>

      <div className={display ? styles.visible : styles.hidden}>
        <div className={styles.cardHoriz}>
          {children}

          <div className={styles.cardButtons}>
            {loadForm && (
              <FaPenSquare
                onClick={() => loadForm(item)}
                size="2.7em"
                className={styles.cardButton}
              />
            )}
            {deleteItem && (
              <FaWindowClose
                onClick={() => deleteItem(item._id)}
                size="2.7em"
                className={styles.cardButton}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
