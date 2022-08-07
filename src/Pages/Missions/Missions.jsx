import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import Context from "../../Context/Context";
import MissionContext from "../../Context/MissionContext";
import LanguageContext from "../../Context/LanguageContext";
import SelectMultiple from "../../Components/SelectMultiple/SelectMultiple";
import SelectSimple from "../../Components/SelectSimple/SelectSimple";
import CurrentMission from "../../Components/CurrentMission/CurrentMission";
import {
  getAllItems,
  deleteItem,
  createItemWithPicture,
  updateItemWidthPicture,
} from "../../Utilities/CrudFunctions";
import missionDefault from "./../../Images/logo-generic.png";
import { formatDate, formatDateForInput } from "../../Utilities/FormatDate";
import FormButton from "../../Components/FormButton/FormButton";
import FormMask from "../../Components/FormMask/FormMask";
import FormFieldset from "../../Components/FormFieldset/FormFieldset";
import CardHoriz from "../../Components/CardHoriz/CardHoriz";
import { MdArrowForwardIos } from "react-icons/md";
import Message from "../../Components/Message/Message";
import EmptyPage from "../../Components/EmptyPage/EmptyPage";
import styles from "./Missions.module.css";

export default function Missions() {
  document.title = "Missions";
  // Récupérer le token du contexte
  const { token } = useContext(Context);
  // Récupération de la mission en cours
  const { currentMission, setCurrentMission } = useContext(MissionContext);
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  const [datas, setDatas] = useState([]);
  // const [topics, setTopics] = useState([]);
  const [clients, setClients] = useState([]);
  //const [journalists, setJournalists] = useState([]);
  const [missionId, setMissionId] = useState("");
  const [missionName, setMissionName] = useState("");
  const [missionDateStart, setMissionDateStart] = useState("");
  const [missionDateEnd, setMissionDateEnd] = useState("");
  const [missionDescription, setMissionDescription] = useState("");
  const [logo, setLogo] = useState(missionDefault);
  // Préview stocke une url pour l'affichage de la photo uploadée
  const [preview, setPreview] = useState("");
  //const [selectedMission, setSelectedMission] = useState({});
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedJournalists, setSelectedJournalists] = useState([]);
  const [updateMode, setUpdateMode] = useState(false);
  const [displayOn, setDisplayOn] = useState(false);
  // Message informatif sur les échanges avec la BDD
  // const [message, setMessage] = useState({ content: "", status: "" });
  const [message, setMessage] = useState({ content: "", status: "" });

  // Lorsqu'une mission est sélectionnée (afin de la modifier)
  const selectItem = (data) => {
    // Passer en mode update (pour que les boutons update et cancel apparaissent)
    setUpdateMode(true);
    // Charger le formulaire (pour modifications) en modifiant les useState
    setMissionId(data._id);
    setMissionName(data.name);
    data.client ? setSelectedClient(data.client) : setSelectedClient("");
    data.journalists
      ? setSelectedJournalists(
          data.journalists.map((journalist) => journalist._id)
        )
      : setSelectedJournalists([]);
    data.topics
      ? setSelectedTopics(data.topics.map((topic) => topic._id))
      : setSelectedTopics([]);
    data.dateStart
      ? setMissionDateStart(data.dateStart)
      : setMissionDateStart("");
    data.dateEnd ? setMissionDateEnd(data.dateEnd) : setMissionDateEnd("");
    data.comment
      ? setMissionDescription(data.comment)
      : setMissionDescription("");
    data.logo ? setLogo(data.logo) : setLogo(missionDefault);

    // On affiche le formulaire
    setDisplayOn(true);
    // On remonte au niveau du formulaire
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Supprimer un élément
  const deleteMission = (id) => {
    deleteItem(
      id,
      process.env.REACT_APP_API_LINK_MISSION,
      token,
      setDatas,
      setMessage
    );
  };

  // Vider le formulaire
  const emptyForm = () => {
    setMissionId("");
    setMissionName("");
    setSelectedClient("");
    setSelectedJournalists([]);
    setSelectedTopics([]);
    setMissionDateStart("");
    setMissionDateEnd("");
    setMissionDescription("");
    setLogo(missionDefault);
    setPreview("");
  };

  // Repasser en mode création (si on était en mode update)
  const cancelUpdate = () => {
    // Sortir du mode update
    setUpdateMode(false);
    // Vider les champs du formulaire
    emptyForm();
  };
  // Récupération de la liste de missions
  useEffect(() => {
    if (token) {
      let abortController;
      abortController = new AbortController();
      const fetchDatas = async () => {
        let signal = abortController.signal;
        let missions = await getAllItems(
          process.env.REACT_APP_API_LINK_MISSION,
          token,
          signal
        );
        missions && setDatas(missions);
      };
      fetchDatas();
      return () => abortController.abort();
    } else {
      setDatas([]);
    }
  }, [token]);

  // Récupération de la liste des clients pour le selectSimple
  useEffect(() => {
    if (token) {
      let abortController;
      abortController = new AbortController();
      const fetchDatasClients = async () => {
        let signal = abortController.signal;
        let clientsData = await getAllItems(
          process.env.REACT_APP_API_LINK_CLIENT,
          token,
          signal
        );
        clientsData && setClients(clientsData);
      };
      fetchDatasClients();
      return () => abortController.abort();
    } else {
      setClients([]);
    }
  }, [token]);

  return (
    <>
      {token ? (
        <div className="positRel">
          <CurrentMission />
          <h1>Missions</h1>
          <section>
            <FormMask
              title={
                language && language === "english"
                  ? "Missions management form"
                  : "Formulaire de gestion des missions"
              }
              displayOn={displayOn}
              setDisplayOn={setDisplayOn}
            >
              <form
                className="flexV"
                onSubmit={(event) => {
                  if (updateMode) {
                    event.preventDefault();

                    let body = {
                      name: missionName,
                      client: selectedClient._id,
                    };
                    if (selectedJournalists)
                      body.journalists = selectedJournalists;
                    if (selectedTopics) body.topics = selectedTopics;
                    if (missionDateStart) body.dateStart = missionDateStart;
                    if (missionDateEnd) body.dateEnd = missionDateEnd;
                    if (missionDescription) body.comment = missionDescription;
                    updateItemWidthPicture(
                      missionId,
                      process.env.REACT_APP_API_LINK_MISSION,
                      token,
                      body,
                      logo,
                      setDatas,
                      undefined,
                      setMessage
                    );

                    cancelUpdate();
                  } else {
                    event.preventDefault();

                    let body = {
                      name: missionName,
                      client: selectedClient._id,
                    };
                    if (selectedJournalists.length > 0)
                      body.journalists = selectedJournalists;
                    if (selectedTopics.length > 0) body.topics = selectedTopics;
                    if (missionDateStart) body.dateStart = missionDateStart;
                    if (missionDateEnd) body.dateEnd = missionDateEnd;
                    if (missionDescription) body.comment = missionDescription;

                    createItemWithPicture(
                      process.env.REACT_APP_API_LINK_MISSION,
                      token,
                      body,
                      logo,
                      setDatas,
                      undefined,
                      setMessage
                    );
                    emptyForm();
                  }
                }}
              >
                <FormFieldset
                  title={
                    language && language === "english"
                      ? "Creation, addition, deletion of missions"
                      : "Création, ajout, suppression de missions"
                  }
                >
                  <div className="flexHForm">
                    <div className="flexV">
                      <label htmlFor="file">
                        {language && language === "english"
                          ? "Import logo "
                          : "Importer un logo"}
                      </label>
                      <img
                        src={preview ? preview : logo}
                        alt={
                          language && language === "english"
                            ? "Mission's logo "
                            : "Logo de la mission"
                        }
                        className={styles.logo}
                      />
                      <input
                        id="file"
                        type="file"
                        onChange={(event) => {
                          setLogo(event.target.files[0]);
                          setPreview(
                            URL.createObjectURL(event.target.files[0])
                          );
                        }}
                        className="inputClass"
                      />
                      <label htmlFor="intitulé">
                        {language && language === "english"
                          ? "Mission's title"
                          : "Nom de la mission"}{" "}
                        *
                      </label>
                      <input
                        id="intitulé"
                        type="text"
                        placeholder={
                          language && language === "english"
                            ? "Title"
                            : "Intitulé"
                        }
                        value={missionName}
                        onChange={(event) => setMissionName(event.target.value)}
                        className="inputClass"
                      />
                      <label htmlFor="client">
                        {language && language === "english"
                          ? "Customer"
                          : "Client"}{" "}
                        *
                      </label>

                      <SelectSimple
                        id="client"
                        selectedItem={selectedClient}
                        setSelectedItem={setSelectedClient}
                        items={clients}
                        params={["nom"]}
                      />
                      <label htmlFor="dateStart">
                        {language && language === "english"
                          ? "Mission start date"
                          : "Date de début de mission"}
                      </label>
                      <input
                        type="date"
                        id="dateStart"
                        value={formatDateForInput(missionDateStart)}
                        onChange={(event) =>
                          setMissionDateStart(event.target.value)
                        }
                        className="inputClass"
                      />
                      <label htmlFor="dateEnd">
                        {language && language === "english"
                          ? "Mission end date"
                          : "Date de fin de mission"}
                      </label>
                      <input
                        type="date"
                        id="dateEnd"
                        value={formatDateForInput(missionDateEnd)}
                        onChange={(event) =>
                          setMissionDateEnd(event.target.value)
                        }
                        className="inputClass"
                      />
                    </div>
                    <div className="flexV">
                      <label htmlFor="topic">
                        {language && language === "english"
                          ? "Themes"
                          : "Thématiques"}
                      </label>
                      <SelectMultiple
                        id="topic"
                        selectedItems={selectedTopics}
                        setSelectedItems={setSelectedTopics}
                        itemsType="topic"
                      />
                      <label htmlFor="journalist">
                        {language && language === "english"
                          ? "Journalists"
                          : "Journalistes"}
                      </label>
                      <SelectMultiple
                        id="journalist"
                        selectedItems={selectedJournalists}
                        setSelectedItems={setSelectedJournalists}
                        itemsType="journalist"
                      />
                      <label htmlFor="description">
                        {language && language === "english"
                          ? "Comments"
                          : "Commentaires"}
                      </label>
                      <textarea
                        id="description"
                        value={missionDescription}
                        onChange={(event) =>
                          setMissionDescription(event.target.value)
                        }
                        className="inputClass"
                      />
                      <FormButton
                        updateMode={updateMode}
                        cancelUpdate={cancelUpdate}
                      />
                    </div>
                  </div>
                </FormFieldset>
              </form>
            </FormMask>
          </section>
          <Message message={message} />
          <section className="flexV">
            {datas.map((data) => {
              return (
                <CardHoriz
                  key={data._id}
                  itemReduced={{ Nom: data.name, Client: data.client.nom }}
                  item={data}
                  logo={
                    data.logo
                      ? process.env.REACT_APP_SERVER + data.logo
                      : missionDefault
                  }
                  deleteItem={deleteMission}
                  loadForm={selectItem}
                >
                  <div className={styles.logoContainer}>
                    <img
                      src={
                        data.logo
                          ? process.env.REACT_APP_SERVER + data.logo
                          : missionDefault
                      }
                      alt="Logo de la mission"
                      className={styles.logo}
                    />
                  </div>
                  <h4 className="h4Bold">
                    {language && language === "english" ? "Title" : "Nom"} :
                  </h4>
                  <p>{data.name}</p>
                  <h4 className="h4Bold">
                    {language && language === "english" ? "Customer" : "Client"}{" "}
                    :
                  </h4>
                  <p>{data.client.nom}</p>
                  {(data.dateStart || data.dateEnd) && (
                    <>
                      <h4 className="h4Bold">
                        {language && language === "english"
                          ? "Duration"
                          : "Durée"}{" "}
                        :
                      </h4>
                      <p>
                        du {data.dateStart && formatDate(data.dateStart)} au{" "}
                        {data.dateEnd && formatDate(data.dateEnd)}
                      </p>
                    </>
                  )}
                  {data.journalists && data.journalists.length > 0 && (
                    <div>
                      <h4 className="h4Bold">
                        {language && language === "english"
                          ? "Journalists"
                          : "Journalistes"}{" "}
                        :
                      </h4>
                      {data.journalists.map((journalist) => {
                        return (
                          <p key={journalist._id}>
                            {journalist.firstname} {journalist.lastname}
                          </p>
                        );
                      })}
                    </div>
                  )}
                  {data.topics && data.topics.length > 0 && (
                    <div>
                      <h4 className="h4Bold">
                        {language && language === "english"
                          ? "Topics"
                          : "Sujets"}{" "}
                        :
                      </h4>
                      {data.topics.map((topic) => {
                        return <p key={topic._id}>{topic.name}</p>;
                      })}
                    </div>
                  )}
                  {data.comment && (
                    <div>
                      <h4 className="h4Bold">Description :</h4>
                      <p className={styles.spaceUnder}>{data.comment}</p>
                    </div>
                  )}
                  <div className={styles.divRight}>
                    <NavLink
                      to={"/missions/current/"}
                      className={styles.missionLink}
                      onClick={() => {
                        setCurrentMission(data);
                        localStorage.setItem(
                          "currentMission",
                          JSON.stringify(data)
                        );
                      }}
                    >
                      {language && language === "english"
                        ? "Select this mission"
                        : "Sélectionnez cette mission"}
                      <MdArrowForwardIos
                        size="1.2em"
                        style={{
                          position: "relative",
                          top: "4px",
                          left: "3px",
                        }}
                      />
                    </NavLink>
                  </div>
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
