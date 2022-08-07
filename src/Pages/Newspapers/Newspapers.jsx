import React, { useEffect, useState, useContext } from "react";
import FormNewspaper from "../../Components/FormNewspaper/FormNewspaper";
import { getAllItems, deleteItem } from "../../Utilities/CrudFunctions";
import Context from "../../Context/Context";
import LanguageContext from "../../Context/LanguageContext";
import SearchBar from "../../Components/SearchBar/SearchBar";
import Message from "../../Components/Message/Message";
import CardHoriz from "../../Components/CardHoriz/CardHoriz";
import SelectAll from "../../Components/SelectAll/SelectAll";
import EmptyPage from "../../Components/EmptyPage/EmptyPage";
import CurrentMission from "../../Components/CurrentMission/CurrentMission";

export default function Newspapers() {
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  // Titre de la page
  document.title =
    language && language === "english" ? "Newspapers" : "Journaux";
  // Liste des journaux de la bdd
  const [datas, setDatas] = useState([]);
  // Liste des journaux affichés (en fonction des recherches notamment)
  const [visibleDatas, setVisibleDatas] = useState([]);
  // Mode update du formulaire
  let [updateMode, setUpdateMode] = useState(false);
  // Journal sélectionné pour modifications
  let [selectedItem, setSelectedItem] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    description: "",
  });
  // Gère l'ouverture du formulaire
  const [displayOn, setDisplayOn] = useState(false);
  // Message informatif sur les échanges avec la BDD
  const [message, setMessage] = useState({ content: "", status: "" });
  // Liste des journaux sélectionnés pour suppression
  const [newspapersToDelete, setNewspapersToDelete] = useState([]);
  // Récupérer le token du contexte
  const { token } = useContext(Context);

  // Suppression d'un journal
  const deleteNewspaper = (id) => {
    deleteItem(
      id,
      process.env.REACT_APP_API_LINK_NEWSPAPER,
      token,
      setDatas,
      setMessage
    );
    //setUpdateMode(false);
    setVisibleDatas((visibleDatas) =>
      visibleDatas.filter((item) => item._id !== id)
    );
    setNewspapersToDelete((newspapersToDelete) =>
      newspapersToDelete.filter((idToDelete) => idToDelete !== id)
    );
  };
  // Remplissage des champs du formulaire
  const updateForm = (data) => {
    setUpdateMode(true);
    setDisplayOn(true);
    setSelectedItem(data);
  };

  // Récupérer les journaux au chargement de la page
  useEffect(() => {
    if (token) {
      let abortController;
      abortController = new AbortController();
      const fetchDatas = async () => {
        let signal = abortController.signal;
        let newspapers = await getAllItems(
          process.env.REACT_APP_API_LINK_NEWSPAPER,
          token,
          signal
        );
        if (newspapers) {
          setDatas(newspapers);
          setVisibleDatas(newspapers);
        }
      };
      fetchDatas();
      return () => abortController.abort();
    } else {
      setDatas([]);
      setVisibleDatas([]);
    }
  }, [token]);

  // Les props du composant FormNewspaper
  let props = {
    updateMode,
    setUpdateMode,
    selectedItem,
    setSelectedItem,
    setDatas,
    setVisibleDatas,
    displayOn,
    setDisplayOn,
    setMessage,
  };
  return (
    <>
      {token ? (
        <div className="positRel">
          <CurrentMission />
          <h1>
            {language && language === "english" ? "Newspapers" : "Journaux"}
          </h1>
          <section>
            <FormNewspaper {...props} />
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
                  ? [
                      ["name", "Name"],
                      ["email", "Email"],
                    ]
                  : [
                      ["name", "Nom"],
                      ["email", "Email"],
                    ]
              }
            ></SearchBar>

            <SelectAll
              datas={datas}
              deleteData={deleteNewspaper}
              itemsToDelete={newspapersToDelete}
              setItemsToDelete={setNewspapersToDelete}
            />
            {visibleDatas.map((data) => {
              return (
                <CardHoriz
                  key={data._id + "cardHoriz"}
                  itemReduced={{
                    Nom: data.name,
                    Email: data.email,
                    Téléphone: data.phoneNumber,
                  }}
                  item={data}
                  deleteItem={deleteNewspaper}
                  loadForm={updateForm}
                  itemsToDelete={newspapersToDelete}
                  setItemsToDelete={setNewspapersToDelete}
                >
                  <h4 className="h4Bold">
                    {language && language === "english" ? "Lastname" : "Nom"} :
                  </h4>
                  <p>{data.name}</p>
                  {data.email && (
                    <>
                      <h4 className="h4Bold">Email :</h4>
                      <p>{data.email}</p>
                    </>
                  )}
                  {data.phoneNumber && (
                    <>
                      <h4 className="h4Bold">
                        {language && language === "english"
                          ? "Phone number"
                          : "Téléphone"}{" "}
                        :
                      </h4>
                      <p>{data.phoneNumber}</p>
                    </>
                  )}
                  {data.description && (
                    <>
                      <h4 className="h4Bold">Description :</h4>
                      <p>{data.description}</p>
                    </>
                  )}
                </CardHoriz>
              );
            })}
          </section>
        </div>
      ) : (
        <EmptyPage
          textInfo={
            "Veuillez vous connecter pour afficher le contenu de cette page"
          }
        />
      )}
    </>
  );
}
