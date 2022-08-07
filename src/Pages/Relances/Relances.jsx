import React, { useEffect, useState, useContext } from "react";
import Context from "../../Context/Context";
import LanguageContext from "../../Context/LanguageContext";
import { FaWindowClose, FaPenSquare } from "react-icons/fa";
import { FaRegStar, FaStar } from "react-icons/fa";
import SelectSimple from "../../Components/SelectSimple/SelectSimple";
import CurrentMission from "../../Components/CurrentMission/CurrentMission";
import {
  createItem,
  getAllItems,
  deleteItem,
  updateItem,
} from "../../Utilities/CrudFunctions";
import { formatDate, formatDateForInput } from "../../Utilities/FormatDate";
import FormButton from "../../Components/FormButton/FormButton";
import FormMask from "../../Components/FormMask/FormMask";
import FormFieldset from "../../Components/FormFieldset/FormFieldset";
import StarRating from "../../Components/StarRating/StarRating";
import Message from "./../../Components/Message/Message";
import CardHoriz from "../../Components/CardHoriz/CardHoriz";
import EmptyPage from "../../Components/EmptyPage/EmptyPage";

import styles from "./Relances.module.css";

export default function Relances() {
  document.title = "Relances";
  // Récupérer le token du contexte
  const { token } = useContext(Context);
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  // Liste des relances
  const [datas, setDatas] = useState([]);
  // Id de la relance sélectionnée pour modif
  const [relanceId, setRelanceId] = useState("");
  // Journalistes de la liste de selection
  const [journalists, setJournalists] = useState([]);
  // Missions de la liste de selection
  const [missions, setMissions] = useState([]);
  // Titre de la relance du formulaire
  const [title, setTitle] = useState("");
  // Journaliste selectionné pour la relance
  const [journalist, setJournalist] = useState({});
  // Journaux du journaliste (sélectionné)
  const [newspapers, setNewspapers] = useState([]);
  // Journal selectionné pour la relance
  const [newspaper, setNewspaper] = useState({});
  // Description de la relance
  const [description, setDescription] = useState("");
  // Date dernière relance
  const [dateLastRelance, setDateLastRelance] = useState("");
  // Date prochaine relance
  const [dateNextRelance, setDateNextRelance] = useState("");
  // Interet du journaliste pour la mission
  const [interest, setInterest] = useState(-1);
  // Mission de la relance
  const [mission, setMission] = useState("");
  // Affichage du formulaire (déplié ou pas)
  const [displayOn, setDisplayOn] = useState(false);
  // Mode mise à jour du formulaire (par opposition à mode création)
  const [updateMode, setUpdateMode] = useState(false);
  // Message informatif sur les échanges avec la BDD
  const [message, setMessage] = useState({ content: "", status: "" });

  // ************************************************************************************************
  // *************************************  FONCTIONS  **********************************************
  // ************************************************************************************************

  // Création du body qui sera passé en paramètre des fonctions createItem et  updateItem
  const createBody = () => {
    const body = {
      journalist: journalist._id,
      description: description,
      dateLastRelance: dateLastRelance,
      dateNextRelance: dateNextRelance,
      mission: mission._id,
      interest: interest,
    };
    newspaper._id && (body["newspaper"] = newspaper._id);
    return body;
  };

  // Charger le formulaire
  // Lorsqu'une relance est sélectionnée (afin de la modifier)
  const selectItem = (data) => {
    // Passer en mode update (pour que les boutons update et cancel apparaissent)
    setUpdateMode(true);
    // Charger le formulaire (pour modifications) en modifiant les useState
    setRelanceId(data._id);
    //data.title ? setTitle(data.title) : setTitle("");

    // setJournalist(journalistComplete);
    setJournalist(data.journalist);
    // On récupère les journaux du journaliste
    // En effet la liste des journaux possibles (ceux dans lesquels il travaille) du journaliste ne sont pas stockés dans l'objet data (relance); seul celui qui avait été sélectionné l'est
    // Il faut donc rechercher cette liste dans la liste de l'ensemble des journalistes que l'on a en reserve
    let journalistComplete = journalists.filter(
      (journalist) => journalist._id === data.journalist._id
    );
    journalistComplete[0].newspapers &&
      setNewspapers(journalistComplete[0].newspapers);
    data.newspaper ? setNewspaper(data.newspaper) : setNewspaper("");
    setMission(data.mission);
    data.dateLastRelance
      ? setDateLastRelance(data.dateLastRelance)
      : setDateLastRelance("");
    data.dateNextRelance
      ? setDateNextRelance(data.dateNextRelance)
      : setDateNextRelance("");
    data.description ? setDescription(data.description) : setDescription("");
    data.interest ? setInterest(data.interest) : setInterest(-1);
    // On affiche le formulaire
    setDisplayOn(true);
    // On remonte au niveau du formulaire
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Supprimer une relance
  const deleteRelance = (id) => {
    deleteItem(
      id,
      process.env.REACT_APP_API_LINK_RELANCE,
      token,
      setDatas,
      setMessage
    );
  };

  // Repasser en mode création (si on était en mode update)
  const cancelUpdate = () => {
    // Sortir du mode update
    setUpdateMode(false);
    // Vider les champs du formulaire
    setRelanceId("");
    //setTitle("");
    setJournalist("");
    setNewspaper("");
    setMission("");
    setDateLastRelance("");
    setDateNextRelance("");
    setDescription("");
    setInterest(-1);
  };

  // Transformation d'un nombre en étoiles
  const starConvert = (number, maxNumber) => {
    if (number >= 0 && number <= maxNumber) {
      let fullStars = [...Array(number)].map((val, index) => (
        <FaStar key={index} />
      ));

      let emptyStars = [...Array(maxNumber - number)].map((val, index) => (
        <FaRegStar key={index} />
      ));
      fullStars.push(emptyStars);
      return fullStars;
    }
  };

  // Récupération des relances
  useEffect(() => {
    if (token) {
      let abortController;
      abortController = new AbortController();
      const fetchDatas = async () => {
        let signal = abortController.signal;
        let relancesData = await getAllItems(
          process.env.REACT_APP_API_LINK_RELANCE,
          token,
          signal
        );
        relancesData && setDatas(relancesData);
      };
      fetchDatas();
      return () => abortController.abort();
    } else {
      setDatas([]);
    }
  }, [token]);

  // Récupération des journalistes
  useEffect(() => {
    if (token) {
      let abortController;
      abortController = new AbortController();
      const fetchDatas = async () => {
        let signal = abortController.signal;
        let journalistsData = await getAllItems(
          process.env.REACT_APP_API_LINK_JOURNALIST,
          token,
          signal
        );
        journalistsData && setJournalists(journalistsData);
      };
      fetchDatas();
      return () => abortController.abort();
    } else {
      setJournalists([]);
    }
  }, [token]);

  // Récupération des missions
  useEffect(() => {
    if (token) {
      let abortController;
      abortController = new AbortController();
      const fetchDatas = async () => {
        let signal = abortController.signal;
        let missionsData = await getAllItems(
          process.env.REACT_APP_API_LINK_MISSION,
          token,
          signal
        );
        missionsData && setMissions(missionsData);
      };
      fetchDatas();
      return () => abortController.abort();
    } else {
      setMissions([]);
    }
  }, [token]);

  // ************************************************************************************************
  // *************************************  AFFICHAGE  **********************************************
  // ************************************************************************************************

  return (
    <>
      {token ? (
        <div className="positRel">
          <CurrentMission />
          <h1>
            {language && language === "english" ? "Follow-ups" : "Relances"}
          </h1>
          {/* ************************************* FORMULAIRE ********************************************** */}
          <section>
            <FormMask
              title={
                language && language === "english"
                  ? "Follow-ups management form"
                  : "Formulaire de gestion des relances"
              }
              displayOn={displayOn}
              setDisplayOn={setDisplayOn}
            >
              <form
                className="flexV"
                onSubmit={(event) => {
                  if (updateMode) {
                    event.preventDefault();
                    let body = createBody();
                    updateItem(
                      relanceId,
                      process.env.REACT_APP_API_LINK_RELANCE,
                      body,
                      token,
                      setDatas,
                      setMessage
                    );
                    cancelUpdate();
                  } else {
                    event.preventDefault();
                    let body = createBody();
                    createItem(
                      process.env.REACT_APP_API_LINK_RELANCE,
                      body,
                      token,
                      setDatas,
                      undefined,
                      setMessage
                    );
                  }
                }}
              >
                <FormFieldset
                  title={
                    language && language === "english"
                      ? "Creation, addition, deletion of follow-ups"
                      : "Création, ajout, suppression de relances"
                  }
                >
                  <p>
                    {language && language === "english"
                      ? "Journalist"
                      : "Journaliste"}{" "}
                    *
                  </p>

                  <SelectSimple
                    selectedItem={journalist}
                    setSelectedItem={setJournalist}
                    items={journalists}
                    params={["firstname", "lastname"]}
                  />
                  {journalist.newspapers && !updateMode && (
                    <>
                      <p>
                        {language && language === "english"
                          ? "Newspaper"
                          : "Journal"}{" "}
                        *
                      </p>

                      <SelectSimple
                        selectedItem={newspaper}
                        setSelectedItem={setNewspaper}
                        items={journalist.newspapers}
                        params={["name"]}
                      />
                    </>
                  )}
                  {updateMode && (
                    <>
                      <p>
                        {language && language === "english"
                          ? "Newspaper"
                          : "Journal"}{" "}
                        *
                      </p>

                      <SelectSimple
                        selectedItem={newspaper}
                        setSelectedItem={setNewspaper}
                        items={newspapers}
                        params={["name"]}
                      />
                    </>
                  )}

                  <label htmlFor="dateLastRelance">
                    {language && language === "english"
                      ? "Date last follow-up"
                      : "Date de la dernière relance"}
                  </label>
                  <input
                    type="date"
                    id="dateLastRelance"
                    value={formatDateForInput(dateLastRelance)}
                    onChange={(event) => setDateLastRelance(event.target.value)}
                    className="inputClass"
                  />
                  <label htmlFor="dateNextRelance">
                    {language && language === "english"
                      ? "Date next follow-up"
                      : "Date de la prochaine relance"}
                  </label>
                  <input
                    type="date"
                    id="dateNextRelance"
                    value={formatDateForInput(dateNextRelance)}
                    onChange={(event) => setDateNextRelance(event.target.value)}
                    className="inputClass"
                  />
                  <p>Mission *</p>
                  <SelectSimple
                    selectedItem={mission}
                    setSelectedItem={setMission}
                    items={missions}
                    params={["name"]}
                  />
                  <p>
                    {language && language === "english"
                      ? "Interest"
                      : "Intérêt"}
                  </p>
                  <StarRating rating={interest} setRating={setInterest} />
                  <p>
                    {language && language === "english"
                      ? "Comments"
                      : "Commentaires"}
                  </p>

                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="inputClass"
                  />
                  <FormButton
                    updateMode={updateMode}
                    cancelUpdate={cancelUpdate}
                  />
                </FormFieldset>
              </form>
            </FormMask>
          </section>
          <Message message={message} />
          {/* ************************************* LISTE ********************************************** */}
          <section className="flexV">
            {datas.map((data) => {
              return (
                <CardHoriz
                  key={data._id + "cardHoriz"}
                  itemReduced={{
                    Nom:
                      data.journalist.firstname +
                      " " +
                      data.journalist.lastname,
                    Mission: data.mission.name,
                    Intérêt: starConvert(data.interest, 5),
                  }}
                  item={data}
                  deleteItem={deleteRelance}
                  loadForm={selectItem}
                >
                  {/* <p>
                   <h4 className="h4Bold">Intitulé :</h4> {data.title}
                </p> */}
                  {data.mission && (
                    <>
                      <h4 className="h4Bold">Mission :</h4>
                      <p>{data.mission.name}</p>
                    </>
                  )}
                  {data.journalist && (
                    <>
                      <h4 className="h4Bold">
                        {language && language === "english"
                          ? "Journalist"
                          : "Journaliste"}{" "}
                        :
                      </h4>

                      <p>
                        {data.journalist.firstname} {data.journalist.lastname}
                      </p>
                    </>
                  )}
                  {data.newspaper && (
                    <>
                      <h4 className="h4Bold">
                        {language && language === "english"
                          ? "Newspaper"
                          : "Journal"}{" "}
                        :
                      </h4>

                      <p>{data.newspaper.name}</p>
                    </>
                  )}
                  {data.dateLastRelance && (
                    <>
                      <h4 className="h4Bold">
                        {language && language === "english"
                          ? "Last follow-up"
                          : "Dernière relance"}{" "}
                        :{" "}
                      </h4>
                      <p>
                        {data.dateLastRelance &&
                          formatDate(data.dateLastRelance)}
                      </p>
                    </>
                  )}
                  {data.dateNextRelance && (
                    <>
                      <h4 className="h4Bold">
                        {language && language === "english"
                          ? "Next follow-up"
                          : "Prochaine relance"}{" "}
                        :{" "}
                      </h4>
                      <p>
                        {data.dateNextRelance &&
                          formatDate(data.dateNextRelance)}
                      </p>
                    </>
                  )}
                  {data.interest > 0 && (
                    <>
                      <h4 className="h4Bold">
                        {language && language === "english"
                          ? "Interest"
                          : "Intérêt"}{" "}
                        :{" "}
                      </h4>
                      <p>
                        {data.interest >= 0 && starConvert(data.interest, 5)}
                      </p>
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
            language && language === "english"
              ? "Please login to display the content of this page"
              : "Veuillez vous connecter pour afficher le contenu de cette page"
          }
        />
      )}
    </>
  );
}
