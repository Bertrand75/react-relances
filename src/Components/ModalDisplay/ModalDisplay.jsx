import React from "react";
import { FaWindowClose } from "react-icons/fa";
import styles from "./ModalDisplay.module.css";

export default function ModalDisplay({
  children,
  modalDisplay,
  setModalDisplay,
  height,
  width,
  color,
}) {
  const closeDisplay = () => {
    setModalDisplay(false);
  };
  // Variante pour fermer quand on clique à l'extérieur du contenu
  const closeDisplayOut = (e) => {
    if (e.target.id === "container") {
      setModalDisplay(false);
    }
  };

  return (
    <>
      {modalDisplay && (
        <div>
          <div
            className={styles.modalContainer}
            onClick={(e) => closeDisplayOut(e)}
            id="container"
          >
            <div
              className={styles.modalContent}
              style={{ width: width, height: height, backgroundColor: color }}
            >
              <FaWindowClose
                onClick={closeDisplay}
                className={styles.closeButton + " clickable"}
                size="3em"
              />
              <div className={styles.modalInnerContent}>{children}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
