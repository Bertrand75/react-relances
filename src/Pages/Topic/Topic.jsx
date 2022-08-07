import React, { useState, useContext, useEffect } from "react";
import FormTopic from "../../Components/FormTopic/FormTopic";
import { deleteItem, getAllItems } from "../../Utilities/CrudFunctions";
import Context from "../../Context/Context";
import LanguageContext from "../../Context/LanguageContext";
import Message from "../../Components/Message/Message";
import CardHoriz from "../../Components/CardHoriz/CardHoriz";
import SearchBar from "../../Components/SearchBar/SearchBar";
import SelectAll from "../../Components/SelectAll/SelectAll";
import EmptyPage from "../../Components/EmptyPage/EmptyPage";
import CurrentMission from "../../Components/CurrentMission/CurrentMission";

export default function Topic() {
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  // Titre de la page
  document.title = language && language === "english" ? "Topics" : "Sujets";
  // Les sujets récupérés
  const [datas, setDatas] = useState([]);
  // Les sujets affichés (en fonction des recherches)
  const [visibleDatas, setVisibleDatas] = useState([]);
  // le useState dataToModif est en partie décrite (sa tructure) pour éviter le passage de uncontrolled à controlled qui pose problème à Formik
  const [dataToModif, setDataToModif] = useState({ name: "", description: "" });
  // L'update mode permettra d'afficher le bouton de mise à jour plutôt que celui de création de fiche dans le formulaire
  const [updateMode, setUpdateMode] = useState(false);
  // Etat réduit ou étendu du component formulaire
  const [displayOn, setDisplayOn] = useState(false);
  // Message informatif sur les échanges avec la BDD
  const [message, setMessage] = useState({ content: "", status: "" });
  // Liste des sujets sélectionnés pour suppression
  const [topicsToDelete, setTopicsToDelete] = useState([]);
  // Récupération du token
  const { token } = useContext(Context);

  // *********************************** FONCTIONS *****************************************

  // Supprimer un topic avec son id
  const deleteData = (id) => {
    deleteItem(
      id,
      process.env.REACT_APP_API_LINK_TOPIC,
      token,
      setDatas,
      setMessage
    );
    setVisibleDatas((visibleDatas) =>
      visibleDatas.filter((item) => item._id !== id)
    );
    setTopicsToDelete((topicsToDelete) =>
      topicsToDelete.filter((idToDelete) => idToDelete !== id)
    );
  };

  // Charger le formulaire pour mettre à jour un topic
  const updateData = (data) => {
    setDisplayOn(true);
    setUpdateMode(true);
    setDataToModif(data);
  };

  // Récupérer les topics de l'utilisateur au chargement de la page
  useEffect(() => {
    if (token) {
      let abortController;
      abortController = new AbortController();
      const fetchDatas = async () => {
        let signal = abortController.signal;
        let topicsData = await getAllItems(
          process.env.REACT_APP_API_LINK_TOPIC,
          token,
          signal
        );
        if (topicsData) {
          setDatas(topicsData);
          setVisibleDatas(topicsData);
        }
      };
      fetchDatas();
      return () => abortController.abort();
    } else {
      setDatas([]);
      setVisibleDatas([]);
    }
  }, [token]);
  // Les props de FormTopic
  let props = {
    datas,
    setDatas,
    setVisibleDatas,
    dataToModif,
    setDataToModif,
    updateMode,
    setUpdateMode,
    displayOn,
    setDisplayOn,
    setMessage,
  };
  return (
    <>
      {token ? (
        <div className="positRel">
          <CurrentMission />
          <h1>{language && language === "english" ? "Topics" : "Sujets"}</h1>
          <section>
            <FormTopic {...props} />
          </section>
          <Message message={message} />
          <section className="flexV">
            <SearchBar
              datas={datas}
              setDatas={setDatas}
              visibleDatas={visibleDatas}
              setVisibleDatas={setVisibleDatas}
              searchParams={
                language && language === "english"
                  ? [["name", "Name"]]
                  : [["name", "Nom"]]
              }
            ></SearchBar>

            <SelectAll
              datas={datas}
              deleteData={deleteData}
              itemsToDelete={topicsToDelete}
              setItemsToDelete={setTopicsToDelete}
            />
            {visibleDatas.map((data) => {
              return (
                <CardHoriz
                  key={data._id + "cardHoriz"}
                  itemReduced={{ Nom: data.name }}
                  item={data}
                  deleteItem={deleteData}
                  loadForm={updateData}
                  itemsToDelete={topicsToDelete}
                  setItemsToDelete={setTopicsToDelete}
                >
                  <h4 className="h4Bold">
                    {language && language === "english" ? "Title" : "Intitulé"}{" "}
                    :
                  </h4>
                  <p> {data.name}</p>
                  <h4 className="h4Bold">Description :</h4>
                  <p>{data.description}</p>
                </CardHoriz>
              );
            })}
          </section>
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
