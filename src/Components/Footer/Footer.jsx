import React, { useContext } from "react";
import LanguageContext from "../../Context/LanguageContext";
import { FaFacebook, FaTwitter, FaGooglePlusG } from "react-icons/fa";
import Navigation from "../Header/Navigation/Navigation";
import styles from "./Footer.module.css";

function Footer() {
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  return (
    <footer className={styles.footerContainer}>
      <Navigation />
      {/* <div className={styles.flexColumns}> */}
      <div>
        <div className={styles.flexRowsResp}>
          <div className={styles.flexColumns + " " + styles.width30}>
            <div>
              <h3 className={styles.footerH3}>
                {language && language === "english"
                  ? "Features"
                  : "Fonctionnalités"}
              </h3>
            </div>
            <div>
              <a href="#" className={styles.footerLink}>
                Lorem ipsum dolor sit amet.
              </a>
            </div>
            <a href="#" className={styles.footerLink}>
              Lorem ipsum dolor sit amet.
            </a>
            <div>
              <a href="#" className={styles.footerLink}>
                {language && language === "english"
                  ? "Sitemap"
                  : "Plan du site"}
              </a>
            </div>
          </div>
          <div className={styles.flexColumns + " " + styles.width30}>
            <div>
              <h3 className={styles.footerH3}>
                {language && language === "english"
                  ? "Helps & tips"
                  : "Aides et astuces"}
              </h3>
            </div>
            <div>
              <a href="#" className={styles.footerLink}>
                {language && language === "english"
                  ? "How to use this application"
                  : "Comment utiliser l'application ?"}
              </a>
            </div>
            <div>
              <a href="#" className={styles.footerLink}>
                {language && language === "english"
                  ? "Print a follow-up state"
                  : "Imprimer un état des relances"}
              </a>
            </div>
            <a href="#" className={styles.footerLink}>
              Lorem ipsum dolor sit amet.
            </a>
          </div>
          <div className={styles.flexColumns + " " + styles.width30}>
            <div>
              <h3 className={styles.footerH3}>
                {language && language === "english"
                  ? "About us"
                  : "Qui sommes-nous ?"}
              </h3>
            </div>
            <a href="#" className={styles.footerLink}>
              Lorem ipsum dolor sit amet.
            </a>
            <a href="#" className={styles.footerLink}>
              Lorem ipsum dolor sit amet.
            </a>
            <div>
              <a href="#" className={styles.footerLink}>
                {language && language === "english"
                  ? "Contact us"
                  : "Nous contacter"}
              </a>
            </div>
          </div>
        </div>
        <div className={styles.flexRows + " " + styles.socialMedia}>
          <div>
            <a href="#" className={styles.footerLink}>
              <FaFacebook size="1.8em" />
            </a>
          </div>
          <div>
            <a href="#" className={styles.footerLink}>
              <FaTwitter size="1.8em" />
            </a>
          </div>
          <div>
            <a href="#" className={styles.footerLink}>
              <FaGooglePlusG size="1.8em" />
            </a>
          </div>
        </div>
        <p className="textCenter">Copyright @ Toto</p>
        <div className={styles.flexRows}>
          <div>
            <a href="#" className={styles.footerLink}>
              {language && language === "english"
                ? "Legal notices"
                : "Mentions légales"}
            </a>
          </div>
          <div>
            <a href="#" className={styles.footerLink}>
              {language && language === "english"
                ? "Privacy policy"
                : "Politique de confidentialité"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
