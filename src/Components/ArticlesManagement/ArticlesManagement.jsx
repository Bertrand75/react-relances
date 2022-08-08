import React, { useEffect, useState, useContext } from "react";
import CardHoriz from "..//CardHoriz/CardHoriz";
import { getAllItems, deleteItem } from "../../Utilities/CrudFunctions";
import Context from "../../Context/Context";

export default function ArticlesManagement() {
  // Liste des articles
  const [articles, setArticles] = useState([]);
  // Récupération du token du contexte
  const { token } = useContext(Context);

  // ******************** Fonctions **************************
  const deleteArticle = (articleId) => {
    deleteItem(
      articleId,
      process.env.REACT_APP_API_LINK_ARTICLE,
      token,
      setArticles
    );
  };

  // Récupération de la liste des articles
  useEffect(() => {
    if (token) {
      let abortController;
      abortController = new AbortController();
      const fetchDatas = async () => {
        let signal = abortController.signal;
        let listArticles = await getAllItems(
          process.env.REACT_APP_API_LINK_ARTICLE,
          token,
          signal
        );
        listArticles && setArticles(listArticles);
      };
      fetchDatas();
      return () => abortController.abort();
    } else {
      setArticles([]);
    }
  }, [token]);

  return (
    <>
      <h2>Archives des articles</h2>
      {articles.map((article) => (
        <CardHoriz
          key={article._id}
          itemReduced={{ Titre: article.title }}
          item={article}
          deleteItem={deleteArticle}
        >
          <h3>Titre</h3>
          <p>{article.title ? article.title : "NC"}</p>
          <h3>Contenu brut</h3>
          <p>{article.content ? article.content : "NC"}</p>
        </CardHoriz>
      ))}
    </>
  );
}
