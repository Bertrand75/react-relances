import React, { useState, useContext, useEffect } from "react";
import Context from "../../Context/Context";
import LanguageContext from "../../Context/LanguageContext";
import * as XLSX from "xlsx";
import {
  createItemWithPicture,
  updateItemWidthPicture,
  getOneItem,
  createItem,
  updateItem,
} from "../../Utilities/CrudFunctions";

import userDefault from "./../../Images/user_default.svg";
import EmptyPage from "../../Components/EmptyPage/EmptyPage";
import CurrentMission from "../../Components/CurrentMission/CurrentMission";
import { SiMicrosoftexcel } from "react-icons/si";
import styles from "./ImportExcel.module.css";

export default function ImportExcel() {
  document.title = "Import Excel";
  // Récupération de la langue
  const { language } = useContext(LanguageContext);

  // Les données des journalistes (ou des journaux) du fichier excell
  const [items, setItems] = useState([]);

  // Les journalistes (ou les journaux) séllectionnés pour l'ajout
  const [selectedItems, setSelectedItems] = useState([]);

  // Type de données (journaliste ou journal?)
  const [itemsType, setItemsType] = useState("");

  const { token } = useContext(Context);

  // *********************************************************************
  // ************************* FONCTIONS *********************************
  // *********************************************************************

  // Fonction qui permet de récupérer les informations du fichier excel dans le useState items
  const readExcel = (file) => {
    let fileReader = new FileReader();
    fileReader.onload = (event) => {
      let data = event.target.result;
      let workbook = XLSX.read(data, {
        type: "binary",
      });
      workbook.SheetNames.forEach((sheet) => {
        let rowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );

        setItems(rowObject);
        if (rowObject[0]["ID_HA"]) {
          setItemsType("journalist");
        } else if (rowObject[0]["ID_MEDIA"]) {
          setItemsType("newspaper");
        }
      });
    };
    fileReader.readAsBinaryString(file);
  };

  // Ajout ou suppression d'un journaliste (ou d'un journal) à/de la selection (pour import dans la bdd)
  const toggleItem = (checkedValue, item) => {
    if (checkedValue) {
      setSelectedItems((selectedItems) => [...selectedItems, item]);
    } else {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem !== item)
      );
    }
  };

  // Cocher toutes les cases (d'ajout de journalistes)
  const selectAll = () => {
    let checkboxes = document.getElementsByName("checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
    setSelectedItems(items);
  };

  // Décocher toutes les cases (d'ajout de journalistes)
  const unSelectAll = () => {
    let checkboxes = document.getElementsByName("checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    setSelectedItems([]);
  };

  // Ajouter les données liées aux journalistes (ou aux journaux) sélectionnés à la BDD, dans les tables correspondantes
  const addSecondaryDatas = async (datasString, API_LINK) => {
    let excelDatas = [];
    selectedItems.forEach((item) => {
      // Récupération des journaux ou sujet (en fonction du paramètre donné) associés au journaliste ou autre
      // Ou des sujets associés aux journaux
      let datasArray = item[datasString].split(", "); // Dans le fichier excell les sous domaines sont séparés de cette manière
      datasArray.forEach((dataString) => {
        // Les charger dans un tableau en évitant les doublons
        if (!excelDatas.includes(dataString)) {
          excelDatas.push(dataString);
        }
      });
    });

    // Création d'un tableau global de clé/valeur avec l'ensemble des journaux (ou des sujets, en fonction du paramètre) des journalistes
    // Cela permet d'éviter trop de répétitions (beaucoup de répétitions de sujets et possiblement de journaux d'un journaliste à l'autre)
    // On souhaite récupérer les id pour pourvoir les préciser lors de la création du journaliste
    // On va donc récupérer les id de ceux qui en ont déjà via GET
    // Et via POST pour les autres

    let excelDatasWithId = await Promise.all(
      excelDatas.map(async (dataString) => {
        // On recherche l'objet dans la base de données pour voir s'il existe déjà
        let responseObject = await getOneItem(
          dataString,
          API_LINK + "name/",
          token
        );
        // Si on a une de réponse
        if (responseObject !== undefined) {
          // On retourne l'intitulé et l'id de l'objet
          return [dataString, responseObject._id];
          // Si pas de réponse
        } else {
          // On crée l'objet
          let body = {
            name: dataString,
          };
          try {
            let responseObjectCreate = await createItem(API_LINK, body, token);

            // On retourne l'intitulé et l'id de l'objet créé
            return [dataString, responseObjectCreate._id];
          } catch (error) {
            console.log(error);
          }
        }
      })
    );

    // Convertion en objet simple
    let objetExcelDatasWithId = {};
    excelDatasWithId.forEach((element) => {
      try {
        objetExcelDatasWithId[element[0]] = element[1];
      } catch (error) {
        console.log(error);
      }
    });

    return objetExcelDatasWithId;
  };

  // Ajout des journalistes une fois que les sujets et journaux ont été ajouté et converti en id
  const addJournalistsWithDatas = (excelMediasWithId, excelDomainesWithId) => {
    selectedItems.forEach((journalist) => {
      let journalistString = journalist.PRENOM + "/" + journalist.NOM;
      //  Récupération des médias
      let stringNewspapers = journalist.MEDIA.split(",");

      // Récupération des id des médias
      let newspapersId = stringNewspapers.map((stringNewspaper) => {
        return excelMediasWithId[stringNewspaper];
      });
      // Récupération des sujets
      let stringTopics = journalist.DOMAINE.split(",");
      // Récupération des id des sujets
      let topicsId = stringTopics.map((stringTopic) => {
        return excelDomainesWithId[stringTopic];
      });

      // Rechercher le journaliste pour voir s'il existe déjà
      try {
        getOneItem(
          journalistString,
          process.env.REACT_APP_API_LINK_JOURNALIST,
          token
        ).then((response) => {
          //Si le journaliste n'existe pas
          if (response === undefined) {
            // Création du journaliste
            try {
              const body = {
                lastname: journalist.NOM,
              };
              if (journalist.PRENOM) body.firstname = journalist.PRENOM;
              if (journalist.CIVILITE) body.genre = journalist.CIVILITE;
              if (journalist["E-MAIL"]) body.email = journalist["E-MAIL"];
              if (journalist.TEL) body.phoneNumber = journalist.TEL;
              if (journalist["TEL DIRECT"])
                body.phoneNumberDirect = journalist["TEL DIRECT"];
              if (topicsId) body.topics = topicsId;
              if (newspapersId) body.newspapers = newspapersId;

              createItemWithPicture(
                process.env.REACT_APP_API_LINK_JOURNALIST,
                token,
                body,
                userDefault
              );
            } catch (error) {
              console.log(error);
            }
          } else {
            // Si le journaliste existe, on regarde si on peut compléter ses infos (ajouter des sujets traités et/ou des journaux dans lequel il travaille)
            let journalistTopics = response.topics.map((topic) => topic);

            let journalistNewspapers = response.newspapers.map(
              (newspaper) => newspaper
            );
            // Pour chacun des domaines du journaliste au niveau du fichier excel

            for (const domaineWithId in excelDomainesWithId) {
              // S'il n'est pas inclus dans sa liste de topics au niveau de la base de donnée, on l'ajoute
              if (!journalistTopics.includes(domaineWithId)) {
                journalistTopics.push(domaineWithId);
              }
            }
            // Idem pour les journaux
            for (const mediaWithId in excelMediasWithId) {
              if (!journalistNewspapers.includes(mediaWithId)) {
                journalistNewspapers.push(mediaWithId);
              }
            }
            // On met à jour la fiche du journaliste au niveau de la base de donnée
            const bodyUp = {
              topics: journalistTopics,
              newspapers: journalistNewspapers,
            };

            updateItemWidthPicture(
              journalistString,
              process.env.REACT_APP_API_LINK_JOURNALIST,
              token,
              bodyUp
            );
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  const addMediasWithTopics = (excelTopicsWithId) => {
    selectedItems.forEach((media) => {
      // Récupération des sujets
      let stringTopics = media.DOMAINE.split(",");
      // Récupération des id des sujets
      let topicsId = stringTopics.map((stringTopic) => {
        return excelTopicsWithId[stringTopic];
      });

      // Rechercher le media pour voir s'il existe déjà
      try {
        getOneItem(
          media.NOM,
          process.env.REACT_APP_API_LINK_NEWSPAPER + "name/",
          token
        ).then((response) => {
          //Si le media n'existe pas
          if (response === undefined) {
            // Création du media
            try {
              const body = {
                name: media.NOM,
              };

              if (media["E-MAIL"]) body.email = media["E-MAIL"];
              if (media["TYPE MEDIA"]) body.mediaType = media["TYPE MEDIA"];
              if (media.TEL) body.phoneNumber = media.TEL;
              if (topicsId) body.topics = topicsId;

              createItem(process.env.REACT_APP_API_LINK_NEWSPAPER, body, token);
            } catch (error) {
              console.log(error);
            }
          } else {
            // Si le media existe, on regarde si on peut compléter ses infos (ajouter des sujets traités qui ne figurent pas dans la base)
            let mediaTopics = response.topics.map((topic) => topic);

            // Pour chacun des domaines du media au niveau du fichier excel

            for (const domaineWithId in excelTopicsWithId) {
              // S'il n'est pas inclus dans sa liste de topics au niveau de la base de donnée, on l'ajoute
              if (!mediaTopics.includes(domaineWithId)) {
                mediaTopics.push(domaineWithId);
              }
            }

            // On met à jour la fiche du media au niveau de la base de donnée
            const bodyUp = {
              topics: mediaTopics,
            };

            updateItem(
              response._id,
              process.env.REACT_APP_API_LINK_NEWSPAPER,
              token,
              bodyUp
            );
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  // Ajout des journalistes
  const addJournalists = async () => {
    let topicsWithId = await addSecondaryDatas(
      "DOMAINE",
      process.env.REACT_APP_API_LINK_TOPIC
    );
    let newspapersWithId = await addSecondaryDatas(
      "MEDIA",
      process.env.REACT_APP_API_LINK_NEWSPAPER
    );

    addJournalistsWithDatas(newspapersWithId, topicsWithId);
  };

  // Ajout des médias
  const addMedias = async () => {
    let topicsWithId = await addSecondaryDatas(
      "DOMAINE",
      process.env.REACT_APP_API_LINK_TOPIC
    );
    addMediasWithTopics(topicsWithId);
  };

  useEffect(() => {}, []);
  // ********************************************************************
  // ************************* AFFICHAGE ********************************
  // ********************************************************************
  return (
    <>
      {token ? (
        <div className="positRel">
          <CurrentMission />
          <h1>Import Excel</h1>
          <form
            className={styles.excelImportForm + " " + styles.importContainer}
          >
            <label
              htmlFor="fileUpload"
              className={styles.importLabel + " clickable"}
            >
              <div className={styles.importLabelText}>
                {language && language === "english"
                  ? "Select Excel file"
                  : "Sélectionnez un fichier Excel"}{" "}
              </div>

              <div className={styles.importButton}>
                <SiMicrosoftexcel size="2em" />
              </div>
              <input
                type="file"
                id="fileUpload"
                accept=".xls,.xlsx"
                onChange={(event) => {
                  readExcel(event.target.files[0]);
                }}
                className={styles.excelFileInput}
              />
              {/* <button
          type="button"
          id="uploadExcel"
          className={styles.excelImportButton}
        >
          Importer Le fichier
        </button> */}
            </label>
          </form>
          <div className={styles.htmlExcel}>
            {items.length > 0 && itemsType === "journalist" && (
              <>
                <button
                  type="button"
                  onClick={(event) => addJournalists(event)}
                  className={styles.excelImportButton + " divCenter clickable"}
                  disabled={selectedItems.length === 0}
                >
                  {language && language === "english"
                    ? "Add selected journalists"
                    : "Ajouter les journalistes sélectionnés"}
                </button>

                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th colSpan="9" className={styles.thRadiusUp}>
                        <h2>
                          {language && language === "english"
                            ? "Journalists"
                            : "Journalistes"}
                        </h2>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        {language && language === "english"
                          ? "Title"
                          : "Civilité"}
                      </th>
                      <th>
                        {language && language === "english"
                          ? "Lastname"
                          : "Nom"}
                      </th>
                      <th>
                        {language && language === "english"
                          ? "Firstname"
                          : "Prénom"}
                      </th>
                      <th>
                        {language && language === "english"
                          ? "Domain"
                          : "Domaine"}
                      </th>
                      <th>
                        {language && language === "english" ? "Media" : "Média"}
                      </th>
                      <th>
                        {language && language === "english"
                          ? "Phone number"
                          : "Téléphone"}
                      </th>
                      <th>
                        {language && language === "english"
                          ? "Direct number"
                          : "Téléphone direct"}
                      </th>
                      <th>Email</th>
                      <th>
                        <input
                          type="checkbox"
                          onChange={(event) =>
                            event.target.checked ? selectAll() : unSelectAll()
                          }
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((journalist) => {
                      return (
                        <tr key={journalist.ID_HA}>
                          <td>{journalist.CIVILITE}</td>
                          <td>{journalist.NOM}</td>
                          <td>{journalist.PRENOM}</td>
                          <td>{journalist.DOMAINE}</td>
                          <td>{journalist.MEDIA}</td>
                          <td className={styles.td12}>{journalist.TEL}</td>
                          <td className={styles.td12}>
                            {journalist["TEL DIRECT"]}
                          </td>
                          <td>{journalist["E-MAIL"]}</td>
                          <td>
                            <input
                              name="checkbox"
                              type="checkbox"
                              onChange={(event) =>
                                toggleItem(event.target.checked, journalist)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan="7"></th>
                      <th>
                        {language && language === "english"
                          ? "Select all"
                          : "Tout sélectionner"}
                      </th>
                      <th>
                        <input
                          type="checkbox"
                          onChange={(event) =>
                            event.target.checked ? selectAll() : unSelectAll()
                          }
                        />
                      </th>
                    </tr>
                  </tfoot>
                </table>
                <button
                  type="button"
                  onClick={(event) => addJournalists(event)}
                  className={styles.excelImportButton + " divCenter"}
                >
                  {language && language === "english"
                    ? "Add selected journalists"
                    : "Ajouter les journalistes sélectionnés"}
                </button>
              </>
            )}
            {items.length > 0 && itemsType === "newspaper" && (
              <>
                <button
                  type="button"
                  onClick={(event) => addMedias(event)}
                  className={styles.excelImportButton + " divCenter clickable"}
                  disabled={selectedItems.length === 0}
                >
                  {language && language === "english"
                    ? "Add selected newspapers"
                    : "Ajouter les journaux sélectionnés"}
                </button>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th colSpan="6" className={styles.thRadiusUp}>
                        <h2>
                          {language && language === "english"
                            ? "Medias"
                            : "Médias"}
                        </h2>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        {language && language === "english"
                          ? "Media name"
                          : "Nom du média"}
                      </th>
                      <th>
                        {language && language === "english"
                          ? "Domain"
                          : "Domaine"}
                      </th>
                      <th>
                        {language && language === "english"
                          ? "Media type"
                          : "Type de média"}
                      </th>
                      <th>
                        {language && language === "english"
                          ? "Phone number"
                          : "Téléphone"}
                      </th>
                      <th>Email</th>
                      <th>
                        <input
                          type="checkbox"
                          onChange={(event) =>
                            event.target.checked ? selectAll() : unSelectAll()
                          }
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((newspaper) => {
                      return (
                        <tr key={newspaper.ID_MEDIA}>
                          <td>{newspaper.NOM}</td>
                          <td>{newspaper.DOMAINE}</td>
                          <td>{newspaper["TYPE MEDIA"]}</td>
                          <td>{newspaper.TEL}</td>
                          <td>{newspaper["E-MAIL"]}</td>
                          <td>
                            <input
                              name="checkbox"
                              type="checkbox"
                              onChange={(event) =>
                                toggleItem(event.target.checked, newspaper)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan="7" className={styles.thRadiusDownL}></th>
                      <th>Tout sélectionner</th>
                      <th className={styles.thRadiusDownR}>
                        <input
                          type="checkbox"
                          onChange={(event) =>
                            event.target.checked ? selectAll() : unSelectAll()
                          }
                        />
                      </th>
                    </tr>
                  </tfoot>
                </table>
                <button
                  type="button"
                  onClick={(event) => addMedias(event)}
                  className={styles.excelImportButton + " divCenter"}
                >
                  {language && language === "english"
                    ? "Add selected medias"
                    : "Ajouter les médias sélectionnés"}
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <EmptyPage
          textInfo={
            language && language === "english"
              ? "Please login to access the content of this page"
              : "Veuillez vous connecter pour afficher le contenu de cette page"
          }
        />
      )}
    </>
  );
}
