import React, { useEffect, useState, useContext } from "react";
import Context from "../../Context/Context";
import MissionContext from "../../Context/MissionContext.js";
import { getOneItem } from "../../Utilities/CrudFunctions";
import styles from "./EtatRelances.module.css";

export default function EtatRelances() {
  // Récupération du token
  const { token } = useContext(Context);
  // Récupération de la mission en cours
  const { currentMission } = useContext(MissionContext);
  // Etat (react) des relances
  const [relances, setRelances] = useState([]);
  // date
  const today = new Date().toLocaleDateString();

  // Fonction de création de l'état des relances
  // Il s'agit de produire un document (à fournir au client potentiellement)
  // qui indique les informations concernant les relances effectuées auprès de journalistes

  const generateEtatRelances = () => {
    let documentDiv = document.getElementById("documentRelance").innerHTML;
    //let backUpContent = document.body.innerHTML;
    document.body.innerHTML = documentDiv;
    window.print();
    // On raffraichit la page (plutôt que de remettre l'ancien contenu pour contourner un problème lié au boutton désactivé)
    window.location.reload(false);
    //document.body.innerHTML = backUpContent;
    // var a = window.open("", "", "height=500, width=500");
    // a.document.write("<html>");
    // a.document.write("<body >");
    // a.document.write(documentDiv);
    // a.document.write("</body></html>");
    // a.document.close();
    // a.print();
  };

  useEffect(() => {
    if (token) {
      if (currentMission) {
        // On annule la requete si le composant est démonté
        let abortController;
        abortController = new AbortController();
        let signal = abortController.signal;

        const fetchData = async () => {
          let relancesData = await getOneItem(
            "?missionid=" + currentMission._id,
            process.env.REACT_APP_API_LINK_RELANCE,
            token,
            signal
          );
          setRelances(relancesData);
        };
        fetchData();
        return () => abortController.abort();
      }
    } else {
      setRelances([]);
    }
  }, [token]);

  return (
    <>
      {token && currentMission && (
        <div className={styles.pageContainer}>
          <button
            onClick={() => generateEtatRelances()}
            className={styles.printButton}
          >
            Impression
          </button>
          <div className={styles.etatRelancesContainer} id="documentRelance">
            <img
              src={process.env.REACT_APP_SERVER + currentMission.logo}
              alt="logo de la mission"
              className={styles.logo}
            />
            <h1>ETAT DES RELANCES</h1>
            <h2 className={styles.etatRelancesH2}>
              <strong>MISSION :</strong> {currentMission.name}
            </h2>
            <h2 className={styles.etatRelancesH2}>
              <strong>CLIENT :</strong> {currentMission.client.nom}
            </h2>
            <h2 className={styles.etatRelancesH2}>
              <strong>DATE :</strong> {today}
            </h2>
            <table className={styles.etatRelancesTable}>
              <thead>
                <tr>
                  <th className={styles.width1}>MEDIA</th>
                  <th className={styles.width1}>JOURNALISTE</th>
                  <th className={styles.width2}>ECHANGE</th>
                  <th className={styles.width1}>INTERET</th>
                </tr>
              </thead>
              <tbody>
                {relances.map((relance) => (
                  <tr key={relance._id}>
                    <td>{relance.newspaper && relance.newspaper.name}</td>
                    <td>
                      {relance.journalist.firstname}{" "}
                      {relance.journalist.lastname}
                    </td>
                    <td>{relance.description}</td>
                    <td>{relance.interest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
