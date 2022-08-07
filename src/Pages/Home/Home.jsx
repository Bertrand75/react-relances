import React, { useContext, useEffect, useState } from "react";
import Context from "../../Context/Context";
import LanguageContext from "../../Context/LanguageContext";
import InfoContent from "../../Components/InfoContent/InfoContent";
import CurrentMission from "../../Components/CurrentMission/CurrentMission";
import { getOneItem } from "../../Utilities/CrudFunctions";
import styles from "./Home.module.css";

function Home(props) {
  // Recuperation du token du contexte
  const { token } = useContext(Context);
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  // On nomme la page pour l'affichage dans le navigateur
  document.title = language && language === "english" ? "Home" : "Accueil";

  // L'article récupéré au chargement de la page via le useEffect
  const [news, setNews] = useState("");

  useEffect(() => {
    if (token) {
      let abortController;
      abortController = new AbortController();
      const fetchDatas = async () => {
        let signal = abortController.signal;
        let article = await getOneItem(
          "last",
          process.env.REACT_APP_API_LINK_ARTICLE,
          token,
          signal
        );

        article && setNews(article);
      };
      fetchDatas();
      return () => abortController.abort();
    } else {
      setNews("");
    }
  }, [token]);
  return (
    <section className={styles.articleContainer + " positRel"}>
      {token && <CurrentMission />}
      <h1>{language && language === "english" ? "Home" : "Accueil"}</h1>
      {!token && (
        <InfoContent
          textInfo={
            language && language === "english"
              ? "Please login to access website features"
              : "Veuillez vous connecter pour accéder aux fonctionnalités du site"
          }
        />
      )}
      {token && (
        <article>
          <h2>{news.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: news.content }}></div>
        </article>
      )}
    </section>
  );
}

export default Home;
