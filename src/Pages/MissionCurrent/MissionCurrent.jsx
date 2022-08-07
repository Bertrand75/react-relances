import React, { useState, useEffect, useContext } from "react";
import Context from "../../Context/Context";
import {
  FaRegStar,
  FaStar,
  FaWindowClose,
  FaRegWindowClose,
} from "react-icons/fa";
import userDefault from "./../../Images/user_default.svg";
import {
  FaChevronDown,
  FaChevronUp,
  FaRegCalendarAlt,
  FaPenSquare,
} from "react-icons/fa";
import {
  deleteItem,
  getOneItem,
  updateItem,
} from "./../../Utilities/CrudFunctions";
import { formatDate, formatDateForInput } from "./../../Utilities/FormatDate";
import SortSelect from "../../Components/SortSelect/SortSelect";
import EtatRelances from "../../Pages/EtatRelances/EtatRelances";
import MissionContext from "../../Context/MissionContext";
import styles from "./MissionCurrent.module.css";

export default function MissionCurrent() {
  // Récupération du token
  const { token } = useContext(Context);
  // Id de la mission selectionnée
  //const { id } = useParams();
  // Mission sélectionnée
  const { currentMission } = useContext(MissionContext);

  // Liste des relances de la mission
  const [relances, setRelances] = useState([]);
  // Liste des relances dont l'affichage est étendu
  const [extendedDisplay, setExtendedDisplay] = useState([]);
  // Liste des item dont l'affichage est en mode update (input)
  const [inputModeList, setInputModeList] = useState([]);
  // Liste des relances à supprimer (celles qui sont cochées)
  const [deleteListIds, setDeleteListIds] = useState([]);
  // Onglet visible
  const [visibleTab, setVisibleTab] = useState("missionRelances");

  // **********************************  FONCTIONS  *****************************************
  // Afficher plus de détails au click
  const changeDisplay = (relanceId) => {
    if (extendedDisplay.includes(relanceId)) {
      setExtendedDisplay((extendedDisplay) =>
        extendedDisplay.filter((id) => id !== relanceId)
      );
    } else {
      setExtendedDisplay((extendedDisplay) => [...extendedDisplay, relanceId]);
    }
  };

  // Ajouter ou retirer un id à/de la liste des éléments sélectionnés pour suppression
  const toggleDeleteId = (id) => {
    if (deleteListIds.includes(id)) {
      let newDeleteListIds = deleteListIds.filter((itemId) => itemId !== id);
      setDeleteListIds(newDeleteListIds);
    } else {
      setDeleteListIds((deleteListIds) => [...deleteListIds, id]);
    }
  };

  // Ajouter ou retirer un id à/de la liste des éléments qui doivent s'afficher en mode input (pour modifications)
  const toggleInputMode = (id) => {
    if (inputModeList.includes(id)) {
      let newInputModeList = inputModeList.filter((itemId) => itemId !== id);
      setInputModeList(newInputModeList);
    } else {
      setInputModeList((inputModeList) => [...inputModeList, id]);
    }
  };

  // Mettre à jour une relance
  const updateRelance = (param, value, id) => {
    let body = {};
    body[param] = value;
    updateItem(
      id,
      process.env.REACT_APP_API_LINK_RELANCE,
      body,
      token,
      setRelances
    );
  };

  // Supprimer les items selectionnés (ceux dont les ids figurent dans deleteListIds)
  const deleteList = () => {
    deleteListIds.forEach((id) => {
      deleteItem(
        id,
        process.env.REACT_APP_API_LINK_RELANCE,
        token,
        setRelances
      );
    });
  };

  // Transformer un chiffre entre 0 et 5 en couleur
  // Remarque : le break ne semble pas nécessaire dans react
  const colorInterest = (rating) => {
    switch (rating) {
      case 0:
        return styles.interest0;
      case 1:
        return styles.interest1;
      case 2:
        return styles.interest2;
      case 3:
        return styles.interest3;
      case 4:
        return styles.interest4;
      case 5:
        return styles.interest5;
      default:
        return "";
    }
  };

  useEffect(() => {
    if (token && relances) {
      // On annule la requete si le composant est démonté
      let abortController;
      abortController = new AbortController();
      let signal = abortController.signal;

      // Récupération des relances liées à la mission
      const fetchDatas = async () => {
        let relancesData = await getOneItem(
          "?missionid=" + currentMission._id,
          process.env.REACT_APP_API_LINK_RELANCE,
          token,
          signal
        );
        setRelances(relancesData);
      };
      fetchDatas();

      return () => abortController.abort();
    } else {
      //setMission({});
      setRelances([]);
    }
  }, [token]);

  // ****************************************** AFFICHAGE *********************************************
  return (
    <div>
      <h1>{currentMission.name}</h1>
      <div className={styles.tabsContainer}>
        <div>
          <h2
            onClick={() => setVisibleTab("missionRelances")}
            style={
              visibleTab === "missionRelances"
                ? { backgroundColor: "transparent", borderBottom: "none" }
                : {}
            }
          >
            Mission en cours
          </h2>
          <h2
            onClick={() => setVisibleTab("followUpState")}
            style={
              visibleTab === "followUpState"
                ? { backgroundColor: "transparent", borderBottom: "none" }
                : {}
            }
          >
            Etat des relances
          </h2>

          <div></div>
        </div>
      </div>

      {visibleTab === "followUpState" && <EtatRelances />}
      {visibleTab === "missionRelances" && (
        <>
          <SortSelect
            arrayToSort={relances}
            setArrayToSort={setRelances}
            params={{
              dateNextRelance: "Prochaine relance",
              dateLastRelance: "Dernière relance",
              "journalist.lastname": "Nom du journaliste",
              interest: "Intérêt suscité",
            }}
          />
          <div className={styles.flexContainerColumn}>
            <div
              className={
                styles.flexContainerColumn +
                " " +
                styles.rowStyle +
                " " +
                styles.rowStyleHead
              }
            >
              <div className={styles.flexContainerRow}>
                <div
                  className={
                    styles.flexItemSize1 + " " + styles.flexItemAlignCenter
                  }
                ></div>
                <div className={styles.flexItemSize2}>
                  <strong>Journaliste</strong>
                </div>
                <div className={styles.flexItemSize2}>
                  <strong>Intérêt</strong>
                </div>
                <div className={styles.flexItemSize2}>
                  <strong>Prochain contact</strong>
                </div>
                <div className={styles.flexItemSize2}>
                  <strong>Dernier contact</strong>
                </div>

                <div className={styles.flexItemSize1}>
                  <strong>Supprimer</strong>
                </div>
                <div className={styles.flexItemSize1}>
                  <strong>Détails</strong>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.flexContainerColumn}>
            {relances &&
              relances.map((relance) => (
                <div
                  key={relance._id}
                  className={
                    styles.flexContainerColumn +
                    " " +
                    styles.rowStyle +
                    " " +
                    colorInterest(relance.interest)
                  }
                >
                  <div className={styles.flexContainerRow}>
                    <div
                      className={
                        styles.flexItemSize1 + " " + styles.flexItemAlignCenter
                      }
                    >
                      <img
                        className={styles.photoProfil}
                        src={
                          relance.journalist.photo
                            ? process.env.REACT_APP_SERVER +
                              relance.journalist.photo
                            : userDefault
                        }
                        alt="Journaliste"
                      />
                    </div>
                    <div className={styles.flexItemSize2}>
                      {relance.journalist.firstname}{" "}
                      {relance.journalist.lastname}
                    </div>

                    <div
                      className={
                        styles.flexItemSize2 + " " + styles.flexContainerRow
                      }
                    >
                      {inputModeList.includes(relance._id + "interest") ? (
                        <select
                          defaultValue={relance.interest && relance.interest}
                          className={styles.inputDate}
                          onBlur={(event) => {
                            updateRelance(
                              "interest",
                              event.target.value,
                              relance._id
                            );

                            toggleInputMode(relance._id + "interest");
                          }}
                          style={{ width: "100px" }}
                        >
                          <option value={0}>0</option>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                        </select>
                      ) : relance.interest !== undefined ? (
                        <>
                          {relance.interest > 0 &&
                            [...Array(relance.interest)].map((val, index) => (
                              <FaStar key={index} />
                            ))}
                          {relance.interest >= 0 &&
                            [...Array(5 - relance.interest)].map(
                              (val, index) => <FaRegStar key={index} />
                            )}

                          {relance.interest === -1 && "NC"}
                        </>
                      ) : (
                        "NC"
                      )}
                      {inputModeList.includes(relance._id + "interest") ? (
                        <FaWindowClose
                          size="2.5em"
                          onClick={() =>
                            toggleInputMode(relance._id + "interest")
                          }
                          className="clickable"
                        />
                      ) : (
                        <FaPenSquare
                          size="2.5em"
                          onClick={() =>
                            toggleInputMode(relance._id + "interest")
                          }
                          className="clickable"
                        />
                      )}
                    </div>

                    <div
                      className={
                        styles.flexItemSize2 + " " + styles.flexContainerRow
                      }
                    >
                      {inputModeList.includes(
                        relance._id + "dateNextRelance"
                      ) ? (
                        <input
                          type="date"
                          defaultValue={
                            relance.dateNextRelance &&
                            formatDateForInput(relance.dateNextRelance)
                          }
                          className={styles.inputDate}
                          onBlur={(event) => {
                            updateRelance(
                              "dateNextRelance",
                              event.target.value,
                              relance._id
                            );
                            toggleInputMode(relance._id + "dateNextRelance");
                          }}
                        />
                      ) : relance.dateNextRelance ? (
                        formatDate(relance.dateNextRelance)
                      ) : (
                        "NC"
                      )}

                      {!inputModeList.includes(
                        relance._id + "dateNextRelance"
                      ) ? (
                        <FaRegCalendarAlt
                          size="2.5em"
                          onClick={() =>
                            toggleInputMode(relance._id + "dateNextRelance")
                          }
                          className="clickable"
                        />
                      ) : (
                        <FaRegWindowClose
                          size="2.5em"
                          onClick={() =>
                            toggleInputMode(relance._id + "dateNextRelance")
                          }
                          className="clickable"
                        />
                      )}
                    </div>
                    <div
                      className={
                        styles.flexItemSize2 + " " + styles.flexContainerRow
                      }
                    >
                      {inputModeList.includes(
                        relance._id + "dateLastRelance"
                      ) ? (
                        <input
                          type="date"
                          defaultValue={
                            relance.dateLastRelance &&
                            formatDateForInput(relance.dateLastRelance)
                          }
                          className={styles.inputDate}
                          onBlur={(event) => {
                            updateRelance(
                              "dateLastRelance",
                              event.target.value,
                              relance._id
                            );
                            toggleInputMode(relance._id + "dateLastRelance");
                          }}
                        />
                      ) : relance.dateLastRelance ? (
                        formatDate(relance.dateLastRelance)
                      ) : (
                        "NC"
                      )}
                      {!inputModeList.includes(
                        relance._id + "dateLastRelance"
                      ) ? (
                        <FaRegCalendarAlt
                          size="2.5em"
                          onClick={() =>
                            toggleInputMode(relance._id + "dateLastRelance")
                          }
                          className="clickable"
                        />
                      ) : (
                        <FaRegWindowClose
                          size="2.5em"
                          onClick={() =>
                            toggleInputMode(relance._id + "dateLastRelance")
                          }
                          className="clickable"
                        />
                      )}
                    </div>

                    <div className={styles.flexItemSize1}>
                      <input
                        type="checkbox"
                        onChange={() => toggleDeleteId(relance._id)}
                        className="checkBox"
                      />
                    </div>
                    <div
                      className={styles.flexItemSize1 + " clickable"}
                      onClick={() => {
                        changeDisplay(relance._id);
                      }}
                    >
                      {extendedDisplay.includes(relance._id) ? (
                        <FaChevronUp size="1.5em" />
                      ) : (
                        <FaChevronDown size="1.5em" />
                      )}
                    </div>
                  </div>
                  <div>
                    {extendedDisplay.includes(relance._id) && (
                      <div
                        className={
                          styles.flexContainerColumn +
                          " " +
                          styles.border +
                          " " +
                          styles.textAreaContainer
                        }
                      >
                        <h3>
                          <strong>Commentaires</strong>
                        </h3>

                        {inputModeList.includes(relance._id + "description") ? (
                          <textarea
                            className={styles.textArea}
                            defaultValue={relance.description}
                            onBlur={(event) => {
                              updateRelance(
                                "description",
                                event.target.value,
                                relance._id
                              );
                              toggleInputMode(relance._id + "description");
                            }}
                          />
                        ) : (
                          <p className={styles.textArea}>
                            {relance.description}
                          </p>
                        )}

                        {inputModeList.includes(relance._id + "description") ? (
                          <FaWindowClose
                            size="2.5em"
                            onClick={() =>
                              toggleInputMode(relance._id + "description")
                            }
                            className={styles.textAreaIcon + " clickable"}
                          />
                        ) : (
                          <FaPenSquare
                            size="2.5em"
                            onClick={() =>
                              toggleInputMode(relance._id + "description")
                            }
                            className={styles.textAreaIcon + " clickable"}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <div className={styles.flexContainerColumn}>
            <div
              className={
                styles.flexContainerColumn +
                " " +
                styles.rowStyle +
                " " +
                styles.rowStyleHead
              }
            >
              <div className={styles.buttonContainer}>
                <button className={styles.deleteButton} onClick={deleteList}>
                  Supprimer la sélection
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
