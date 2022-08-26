import React, { useState, useContext } from "react";
import { createItem } from "../../Utilities/CrudFunctions";
import Context from "../../Context/Context";
import styles from "./AdminHomePage.module.css";

export default function AdminHomePage() {
  //Lorem pour test
  const lorem =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  // Titre de l'article
  const [title, setTitle] = useState("");
  // Texte entré par l'utilisateur
  const [userText, setUserText] = useState(lorem);
  // Recuperation du token du contexte
  const { token } = useContext(Context);

  // *********************** FONCTIONS **********************************
  // Sauvegarder l'article dans la base de données
  const saveArticle = () => {
    const body = { title: title, content: userText };
    createItem(process.env.REACT_APP_API_LINK_ARTICLE, body, token);
  };
  // Mise en forme du texte
  const formatSelectedText = (balise, style) => {
    const textArea = document.getElementById("textArea");
    const selectedTextZone = textArea.value.substring(
      textArea.selectionStart,
      textArea.selectionEnd
    );
    const inlineStyle = style ? " " + style : "";

    const newText =
      userText.substring(0, textArea.selectionStart - 1) +
      "<" +
      balise +
      inlineStyle +
      ">" +
      selectedTextZone +
      "</" +
      balise +
      ">" +
      userText.substring(textArea.selectionEnd, textArea.length);
    setUserText(newText);
  };

  return (
    <>
      <h2>Gestion de la page d'accueil</h2>
      <section>
        <h3>Création</h3>
        <div className={styles.createModule}>
          <input
            type="text"
            value={title}
            placeholder="Titre"
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            onChange={(e) => setUserText(e.target.value)}
            value={userText}
            id="textArea"
          ></textarea>
          <div className={styles.toolsContainer}>
            <button
              onClick={() => {
                formatSelectedText("h1");
              }}
            >
              Titre gros
            </button>
            <button
              onClick={() => {
                formatSelectedText("h2");
              }}
            >
              Titre moyen
            </button>
            <button
              onClick={() => {
                formatSelectedText("h3");
              }}
            >
              Titre petit
            </button>
            <button
              onClick={() => {
                formatSelectedText("p");
              }}
            >
              Paragraphe
            </button>
            <button
              onClick={() => {
                formatSelectedText(
                  "div",
                  "style='display:block; font-size:1.3rem; margin:1rem 1rem 1rem 3rem; border-left:3px solid green; padding-left:1rem'"
                );
              }}
            >
              Citation
            </button>
            <button
              onClick={() => {
                formatSelectedText("em");
              }}
            >
              Italique
            </button>
            <button
              onClick={() => {
                formatSelectedText("strong");
              }}
            >
              Gras
            </button>
            <button
              onClick={() => {
                formatSelectedText("div", "style='color:green;display:inline'");
              }}
            >
              Couleur
            </button>

            <button
              onClick={() => saveArticle()}
              style={{ backgroundColor: "#82df82", color: "#5e7497" }}
            >
              Valider l'article
            </button>
          </div>
        </div>
      </section>
      <section>
        <h3>Apercu</h3>
        <h4>{title}</h4>
        <div
          className={styles.articlePreview}
          dangerouslySetInnerHTML={{ __html: userText }}
        ></div>
      </section>
    </>
  );
}
