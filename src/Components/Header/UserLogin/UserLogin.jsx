import React, { useState, useContext } from "react";
import axios from "axios";
import Context from "../../../Context/Context.js";
import UserContext from "../../../Context/UserContext.js";
import LanguageContext from "../../../Context/LanguageContext";
import ModalDisplay from "../../ModalDisplay/ModalDisplay.jsx";
import { FaPowerOff } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

import styles from "./UserLogin.module.css";

export default function UserLogin() {
  // FORMULAIRE DE LOGIN
  // Pour la redirection
  let navigate = useNavigate();
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  // Données utilisateur entrées
  const emptyUserDatas = { email: "", password: "" };
  const [userDatas, setUserDatas] = useState(emptyUserDatas);

  // Affichage ou non du formulaire de login
  const [modalDisplay, setModalDisplay] = useState(false);
  const [messageResponse, setMessageResponse] = useState("");

  const { token, setToken } = useContext(Context);
  // Utilisateur loggé
  //const [user, setUser] = useState({ id: "", firstname: "" });
  const { user, setUser } = useContext(UserContext);

  const signIn = (event) => {
    event.preventDefault();
    const body = {
      email: userDatas.email,
      password: userDatas.password,
    };
    axios
      .post(process.env.REACT_APP_API_LINK_USER + "login", body)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        // let prenom = response.data.user.firstname
        //   ? response.data.user.firstname
        //   : "";
        //setUser({ id: response.data.user.id, firstname: prenom });
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        setUserDatas(emptyUserDatas);
        setModalDisplay(false);
      })
      .catch((error) => {
        console.log(error);
        setMessageResponse(error.response.data.message);
      });
    navigate("/");
  };

  return (
    <>
      {/* Si on est connecté, on affiche la possibilité de se déconnecter, sinon le contraire */}
      {token && user ? (
        <div className={styles.loginContainer}>
          <div
            onClick={() => {
              localStorage.removeItem("token");
              setToken("");
              localStorage.removeItem("user");
              setUser("");
              navigate("/");
            }}
            className={styles.login}
          >
            {language && language === "english" ? "Logout " : "Déconnexion "}

            <FaPowerOff style={{ marginLeft: "10px", color: "#82df82" }} />
          </div>

          <p className={styles.welcome}>
            <NavLink to={"/user/" + user.id}>
              {" "}
              {language && language === "english"
                ? `Welcome ${user.pseudo && user.pseudo}`
                : `Bienvenue ${user.pseudo && user.pseudo}`}
            </NavLink>
          </p>
        </div>
      ) : (
        <div className={styles.loginContainer}>
          <div
            onClick={() => {
              setModalDisplay(true);
            }}
            className={styles.login}
          >
            {language && language === "english" ? "Login " : "Connexion "}
            <FaPowerOff style={{ marginLeft: "10px", color: "#d42f2f" }} />
          </div>

          <NavLink to="/signup" className={styles.welcome}>
            {language && language === "english" ? "Sign up " : "Inscription "}
          </NavLink>
        </div>
      )}

      {modalDisplay && (
        <ModalDisplay
          setModalDisplay={setModalDisplay}
          modalDisplay={modalDisplay}
          width="50%"
          height="400px"
          color="firebrick"
        >
          <form onSubmit={signIn}>
            <h2 className={styles.loginTitle}>
              {language && language === "english" ? "Login" : "Connectez-vous"}
            </h2>
            <label htmlFor="email" className={styles.loginLabel}>
              Email :{" "}
            </label>
            <input
              name="email"
              id="email"
              type="email"
              placeholder={
                language && language === "english"
                  ? "Your email"
                  : "Votre email"
              }
              value={userDatas.email}
              onChange={(event) =>
                setUserDatas({ ...userDatas, email: event.target.value })
              }
              onFocus={() => setMessageResponse("")}
              className={styles.loginInput}
            />
            <label htmlFor="password" className={styles.loginLabel}>
              {language && language === "english"
                ? "Password : "
                : "Mot de passe : "}
            </label>
            <input
              name="password"
              id="password"
              type="password"
              placeholder={
                language && language === "english"
                  ? "Your password"
                  : "Votre mot de passe"
              }
              value={userDatas.password}
              onChange={(event) =>
                setUserDatas({ ...userDatas, password: event.target.value })
              }
              onFocus={() => setMessageResponse("")}
              className={styles.loginInput}
            />
            <input
              type="submit"
              value={language && language === "english" ? "Login" : "Connexion"}
              className={styles.loginSubmit}
            />

            {messageResponse && (
              <p className={styles.errorMessage}>{messageResponse}</p>
            )}
          </form>
        </ModalDisplay>
      )}
    </>
  );
}
