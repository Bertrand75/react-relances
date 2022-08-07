import React, { useState, useEffect, useContext } from "react";
import Message from "../../Components/Message/Message.jsx";
import Context from "../../Context/Context.js";
import { getOneItem, updateItem } from "../../Utilities/CrudFunctions";
import { FaPenSquare } from "react-icons/fa";
import styles from "./UserPage.module.css";
import { useParams } from "react-router-dom";

export default function UserPage() {
  // *******************  CONSTANTES ET VARIABLES **********************
  // Id de l'utilisateur
  const { userId } = useParams();
  // Récupération du token du context
  const { token } = useContext(Context);
  // Les données utilisateur
  const [userDatas, setUserDatas] = useState({});
  // Les inputs affichés
  const [activeInputs, setActiveInputs] = useState([]);
  // Messages informatifs éventuels
  const [message, setMessage] = useState("");

  // ************************ FONCTIONS ********************************
  // Mise à jour de l'utilisateur
  const updateUser = (property) => {
    let body = {};
    body[property] = userDatas[property];
    body[property] &&
      updateItem(
        userDatas._id,
        process.env.REACT_APP_API_LINK_USER,
        body,
        token,
        undefined,
        setMessage
      );
  };
  // Masquer un input
  const hideInput = (inputName) => {
    setActiveInputs(
      activeInputs.filter((activeInput) => activeInput !== inputName)
    );
  };
  // Afficher ou masquer un input
  const toggleInput = (inputName) => {
    if (activeInputs.includes(inputName)) {
      hideInput(inputName);
    } else {
      setActiveInputs([...activeInputs, inputName]);
    }
  };
  useEffect(() => {
    if (token) {
      let abortController;
      abortController = new AbortController();
      const fetchDatas = async () => {
        let signal = abortController.signal;
        let user = await getOneItem(
          userId,
          process.env.REACT_APP_API_LINK_USER,
          token,
          signal
        );
        user && setUserDatas(user);
      };
      fetchDatas();
      return () => abortController.abort();
    } else {
      setUserDatas({});
    }
  }, [token]);

  // ************************ AFFICHAGE ********************************
  return (
    <>
      {token && (
        <>
          <h1>Mes Informations</h1>

          <div className={styles.userInfos}>
            <div>
              <label htmlFor="inputPseudo">Pseudo : </label>
              <div>
                {!activeInputs.includes("pseudo") && <p>{userDatas.pseudo}</p>}
                {activeInputs.includes("pseudo") && (
                  <input
                    type="text"
                    id="inputPseudo"
                    value={userDatas.pseudo}
                    onChange={(event) =>
                      setUserDatas({ ...userDatas, pseudo: event.target.value })
                    }
                    onBlur={() => {
                      updateUser("pseudo");
                      hideInput("pseudo");
                    }}
                  />
                )}
              </div>
              <FaPenSquare
                size="2em"
                onClick={() =>
                  // userDatas.nom
                  //   ? toggleInput("pseudo")
                  //   : setMessage({
                  //       content: "Erreur; veuillez réessayer plus tard",
                  //     })
                  toggleInput("pseudo")
                }
                className="clickable"
              />
            </div>
            <div>
              <label htmlFor="inputNom">Nom : </label>
              <div>
                {!activeInputs.includes("nom") && <p>{userDatas.nom}</p>}
                {activeInputs.includes("nom") && (
                  <input
                    type="text"
                    id="inputNom"
                    value={userDatas.nom}
                    onChange={(event) =>
                      setUserDatas({ ...userDatas, nom: event.target.value })
                    }
                    onBlur={() => {
                      updateUser("nom");
                      hideInput("nom");
                    }}
                  />
                )}
              </div>
              <FaPenSquare
                size="2em"
                onClick={() =>
                  // userDatas.nom
                  //   ? toggleInput("nom")
                  //   : setMessage({
                  //       content: "Erreur; veuillez réessayer plus tard",
                  //     })
                  toggleInput("nom")
                }
                className="clickable"
              />
            </div>
            <div>
              <label htmlFor="inputPrenom">Prénom : </label>
              <div>
                {!activeInputs.includes("prenom") && <p>{userDatas.prenom}</p>}
                {activeInputs.includes("prenom") && (
                  <input
                    type="text"
                    id="inputPrenom"
                    value={userDatas.prenom}
                    onChange={(event) =>
                      setUserDatas({ ...userDatas, prenom: event.target.value })
                    }
                    onBlur={() => {
                      updateUser("prenom");
                      hideInput("prenom");
                    }}
                  />
                )}
              </div>
              <FaPenSquare
                size="2em"
                onClick={() =>
                  // userDatas.prenom
                  //   ? toggleInput("prenom")
                  //   : setMessage({
                  //       content: "Erreur; veuillez réessayer plus tard",
                  //     })
                  toggleInput("prenom")
                }
                className="clickable"
              />
            </div>
            <div>
              <label htmlFor="inputEmail">Email : </label>
              <div>
                {!activeInputs.includes("email") && <p>{userDatas.email}</p>}
                {activeInputs.includes("email") && (
                  <input
                    type="text"
                    id="inputEmail"
                    value={userDatas.email}
                    onChange={(event) =>
                      setUserDatas({ ...userDatas, email: event.target.value })
                    }
                    onBlur={() => {
                      updateUser("email");
                      hideInput("email");
                    }}
                  />
                )}
              </div>
              <FaPenSquare
                size="2em"
                onClick={() =>
                  // userDatas.email
                  //   ? toggleInput("email")
                  //   : setMessage({
                  //       content: "Erreur; veuillez réessayer plus tard",
                  //     })
                  toggleInput("email")
                }
                className="clickable"
              />
            </div>
          </div>
          <Message message={message} />
        </>
      )}
    </>
  );
}
