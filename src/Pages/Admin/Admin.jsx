import React, { useEffect, useState, useContext } from "react";
import {
  getAllItems,
  deleteItem,
  updateItem,
} from "../../Utilities/CrudFunctions";
import { AdminAccess } from "../../Utilities/Access";

import Context from "../../Context/Context.js";
import CardHoriz from "../../Components/CardHoriz/CardHoriz";
import { FaPenSquare } from "react-icons/fa";
import Message from "../../Components/Message/Message";
import AdminHomePage from "../../Components/HomePage/AdminHomePage";
import ArticlesManagement from "../../Components/ArticlesManagement/ArticlesManagement";
import styles from "./Admin.module.css";

export default function Admin() {
  // *************************** CONSTANTES & VARIABLES **********************************
  // Récupération su token du context
  const { token } = useContext(Context);
  // Accès à la page admin
  const [PageAccess, setPageAccess] = useState(false);
  // Onglet visible
  const [visibleTab, setVisibleTab] = useState("manageUser");
  // La liste des utilisateurs
  const [users, setUsers] = useState([]);
  // L'utilisateur sélectionné (pour consultation, modification ou suppression)
  const emptyUser = { nom: "", prenom: "", email: "", role: "" };
  const [user, setUser] = useState(emptyUser);
  // Les inputs affichés
  const [activeInputs, setActiveInputs] = useState([]);
  // Messages informatifs éventuels
  const [message, setMessage] = useState("");

  // ********************************** FONCTIONS ****************************************
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
  // Suppression d'un utilisateur
  const deleteUser = (idUser) => {
    deleteItem(
      idUser,
      process.env.REACT_APP_API_LINK_USER,
      token,
      setUsers,
      setMessage
    );
  };

  // Mise à jour d'un utilisateur
  const updateUser = (property) => {
    let body = {};
    body[property] = user[property];
    body[property] &&
      updateItem(
        user._id,
        process.env.REACT_APP_API_LINK_USER,
        body,
        token,
        setUsers,
        setMessage
      );
  };

  // Charger le formulaire avec les infos de l'utilisateur sélectionné
  const loadForm = (user) => {
    setUser(user);
  };

  // Récupération de tous les utilisateurs
  useEffect(() => {
    if (PageAccess) {
      let abortController;
      abortController = new AbortController();
      const fetchDatas = async () => {
        let signal = abortController.signal;
        let results = await getAllItems(
          process.env.REACT_APP_API_LINK_USER,
          token,
          signal
        );
        results && setUsers(results);
      };
      fetchDatas();
      return () => abortController.abort();
    } else {
      setUsers([]);
    }
  }, [PageAccess]);

  // Vérification du role ADMIN
  useEffect(() => {
    if (token) {
      const verifAccess = async () => {
        let accessNav = await AdminAccess(token);
        setPageAccess(accessNav);
      };
      verifAccess();
    } else {
      setPageAccess(false);
    }
  }, [token]);

  // ********************************** AFFICHAGE ****************************************
  return (
    <>
      {/* ******************************* ONGLETS ******************************* */}
      {PageAccess && (
        <>
          <h1>Admin</h1>
          <div className={styles.tabsContainer}>
            <div>
              <h2
                onClick={() => setVisibleTab("manageUser")}
                style={
                  visibleTab === "manageUser"
                    ? { backgroundColor: "transparent", borderBottom: "none" }
                    : {}
                }
              >
                Gestion des utilisateurs
              </h2>
              <h2
                onClick={() => setVisibleTab("manageHomePage")}
                style={
                  visibleTab === "manageHomePage"
                    ? { backgroundColor: "transparent", borderBottom: "none" }
                    : {}
                }
              >
                Gestion page d'accueil
              </h2>
              <h2
                onClick={() => setVisibleTab("manageHomePageArticles")}
                style={
                  visibleTab === "manageHomePageArticles"
                    ? { backgroundColor: "transparent", borderBottom: "none" }
                    : {}
                }
              >
                Archives des articles
              </h2>
              <div></div>
            </div>
          </div>
          {/* ******************************* GESTION DES UTILISATEURS ******************************* */}
          {visibleTab === "manageUser" && (
            <div>
              <section className={styles.tabsContent}>
                <h2>Gestion des utilisateurs</h2>
                <h3>Modification de l'utilisateur sélectionné : </h3>
                <div className={styles.userForm}>
                  <div>
                    <label htmlFor="inputNom">Nom : </label>
                    <div>
                      {!activeInputs.includes("nom") && <p>{user.nom}</p>}
                      {activeInputs.includes("nom") && (
                        <input
                          type="text"
                          id="inputNom"
                          value={user.nom}
                          onChange={(event) =>
                            setUser({ ...user, nom: event.target.value })
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
                        user.nom
                          ? toggleInput("nom")
                          : setMessage({
                              content:
                                "Veuillez d'abord sélectionner un utilisateur à modifier",
                            })
                      }
                      className="clickable"
                    />
                  </div>
                  <div>
                    <label htmlFor="inputPrenom">Prénom : </label>
                    <div>
                      {!activeInputs.includes("prenom") && <p>{user.prenom}</p>}
                      {activeInputs.includes("prenom") && (
                        <input
                          type="text"
                          id="inputPrenom"
                          value={user.prenom}
                          onChange={(event) =>
                            setUser({ ...user, prenom: event.target.value })
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
                        user.prenom
                          ? toggleInput("prenom")
                          : setMessage({
                              content:
                                "Veuillez d'abord sélectionner un utilisateur à modifier",
                            })
                      }
                      className="clickable"
                    />
                  </div>
                  <div>
                    <label htmlFor="inputEmail">Email : </label>
                    <div>
                      {!activeInputs.includes("email") && <p>{user.email}</p>}
                      {activeInputs.includes("email") && (
                        <input
                          type="text"
                          id="inputEmail"
                          value={user.email}
                          onChange={(event) =>
                            setUser({ ...user, email: event.target.value })
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
                        user.email
                          ? toggleInput("email")
                          : setMessage({
                              content:
                                "Veuillez d'abord sélectionner un utilisateur à modifier",
                            })
                      }
                      className="clickable"
                    />
                  </div>
                  <div>
                    <label htmlFor="inputRole">Role : </label>
                    <div>
                      {!activeInputs.includes("role") && <p>{user.role}</p>}
                      {activeInputs.includes("role") && (
                        <select
                          id="inputRole"
                          value={user.role}
                          onChange={(event) =>
                            setUser({ ...user, role: event.target.value })
                          }
                          onBlur={() => {
                            updateUser("role");
                            hideInput("role");
                          }}
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="NORMAL">NORMAL</option>
                        </select>
                      )}
                    </div>
                    <FaPenSquare
                      size="2em"
                      onClick={() =>
                        user.role
                          ? toggleInput("role")
                          : setMessage({
                              content:
                                "Veuillez d'abord sélectionner un utilisateur à modifier",
                            })
                      }
                      className="clickable"
                    />
                  </div>
                </div>
                <Message message={message} />
                <h3>Liste des utilisateurs : </h3>
                {users &&
                  users.map((anUser) => (
                    <CardHoriz
                      key={anUser._id}
                      itemReduced={{
                        Nom: `${anUser.prenom} ${anUser.nom}`,
                        Email: anUser.email,
                      }}
                      item={anUser}
                      deleteItem={deleteUser}
                      loadForm={loadForm}
                    >
                      <div>
                        {anUser.nom} {anUser.prenom}
                      </div>
                      <div>{anUser.email}</div>
                    </CardHoriz>
                  ))}
              </section>
            </div>
          )}
          {/* ******************************* CREATION ARTICLE PAGE D'ACCUEIL ******************************* */}
          {visibleTab === "manageHomePage" && (
            <section className={styles.tabsContent}>
              <AdminHomePage />
            </section>
          )}
          {/* ****************************** ARCHIVES ARTICLES PAGE D'ACCUEIL ******************************* */}
          {visibleTab === "manageHomePageArticles" && (
            <section className={styles.tabsContent}>
              <ArticlesManagement />
            </section>
          )}
        </>
      )}
    </>
  );
}
