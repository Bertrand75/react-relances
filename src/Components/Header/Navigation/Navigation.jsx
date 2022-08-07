import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Context from "../../../Context/Context";
import LanguageContext from "../../../Context/LanguageContext";
import { AdminAccess } from "../../../Utilities/Access";
import { NavLink } from "react-router-dom";
import styles from "./Navigation.module.css";

function Navigation({ styleNav }) {
  // styleNav pourra être header ou footer (style différent)

  // Récupération du token
  const { token } = useContext(Context);
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  // Accès à la page admin
  const [PageAccess, setPageAccess] = useState(false);
  // Affichage du menu (burger)
  const [menuDisplay, setMenuDisplay] = useState(false);
  // Page actuelle
  let location = useLocation();

  // ******************* FONCTIONS **************************

  const toggleMenu = () => {
    setMenuDisplay((menuDisplay) => !menuDisplay);
  };

  // Vérifier que l'utilisateur est un admin (pour l'affichage du lien admin)
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
  return (
    <div
      style={
        // Pour que la mise en forme de la page, notamment le footer ne soit pas impacté si la nav n'est pas affichée
        styleNav === "header" ? { minHeight: "57px" } : { minHeight: "35px" }
      }
    >
      <nav
        className={`${
          styleNav === "header" ? styles.headerNav : styles.footerNav
        } ${!menuDisplay && styleNav === "header" && styles.hideMenu}`}
      >
        {token && (
          <>
            <div
              className={location.pathname === "/" ? styles.currentPage : ""}
            >
              <NavLink to="/" onClick={() => setMenuDisplay(false)}>
                {language && language === "english" ? "Home" : "Accueil"}
              </NavLink>
            </div>
            <div
              className={
                location.pathname === "/journalists" ? styles.currentPage : ""
              }
            >
              <NavLink to="/journalists" onClick={() => setMenuDisplay(false)}>
                {language && language === "english"
                  ? "Journalists"
                  : "Journalistes"}
              </NavLink>
            </div>
            <div
              className={
                location.pathname === "/newspapers" ? styles.currentPage : ""
              }
            >
              <NavLink to="/newspapers" onClick={() => setMenuDisplay(false)}>
                {language && language === "english" ? "Newspapers" : "Journaux"}
              </NavLink>
            </div>
            <div
              //className={locationPath === "/missions" ? styles.currentPage : ""}
              className={
                location.pathname === "/missions" ? styles.currentPage : ""
              }
            >
              <NavLink to="/missions" onClick={() => setMenuDisplay(false)}>
                Missions
              </NavLink>
            </div>
            <div
              className={
                location.pathname === "/relances" ? styles.currentPage : ""
              }
            >
              <NavLink to="/relances" onClick={() => setMenuDisplay(false)}>
                {language && language === "english" ? "Follow-ups" : "Relances"}
              </NavLink>
            </div>
            <div
              className={
                location.pathname === "/topics" ? styles.currentPage : ""
              }
            >
              <NavLink to="/topics" onClick={() => setMenuDisplay(false)}>
                {language && language === "english" ? "Topics" : "Sujets"}
              </NavLink>
            </div>
            <div
              className={
                location.pathname === "/clients" ? styles.currentPage : ""
              }
            >
              <NavLink to="/clients" onClick={() => setMenuDisplay(false)}>
                {language && language === "english" ? "Customers" : "Clients"}
              </NavLink>
            </div>
            <div
              className={
                location.pathname === "/importexcel" ? styles.currentPage : ""
              }
            >
              <NavLink to="/importexcel" onClick={() => setMenuDisplay(false)}>
                Excel
              </NavLink>
            </div>
          </>
        )}
        {/* <div
        className={location.pathname === "/signup" ? styles.currentPage : ""}
      >
        <NavLink to="/signup">Inscription</NavLink>
      </div> */}
        {PageAccess && (
          <div
            className={
              location.pathname === "/admin"
                ? styles.currentPageAdmin
                : styles.admin
            }
          >
            <NavLink to="/admin" onClick={() => setMenuDisplay(false)}>
              Admin
            </NavLink>
          </div>
        )}
      </nav>
      {styleNav === "header" && (
        <button
          className={`${styles.burger} ${menuDisplay && styles.burgerX}`}
          onClick={toggleMenu}
        >
          <span className={styles.burgerSlice}></span>
        </button>
      )}
    </div>
  );
}

export default Navigation;
