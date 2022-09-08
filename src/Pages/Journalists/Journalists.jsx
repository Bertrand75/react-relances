import React, { useEffect, useState, useContext } from "react";
import Context from "../../Context/Context";
import LanguageContext from "../../Context/LanguageContext";
import MissionContext from "../../Context/MissionContext";
import {
  createItem,
  createItemWithPicture,
  updateItemWidthPicture,
  deleteItem,
  getAllItems,
} from "../../Utilities/CrudFunctions";
import userDefault from "./../../Images/user_default.svg";
import FormMask from "../../Components/FormMask/FormMask";
import SelectMultiple from "../../Components/SelectMultiple/SelectMultiple";
import FormFieldset from "../../Components/FormFieldset/FormFieldset";
import SearchBar from "../../Components/SearchBar/SearchBar";
//import ModalDisplay from "../../Components/ModalDisplay/ModalDisplay";
import Message from "../../Components/Message/Message";
//import Journalist from "../Journalist/Journalist";
import CardHoriz from "../../Components/CardHoriz/CardHoriz";
import InfoContent from "../../Components/InfoContent/InfoContent";
import SelectAll from "../../Components/SelectAll/SelectAll";
import EmptyPage from "../../Components/EmptyPage/EmptyPage";
import CurrentMission from "../../Components/CurrentMission/CurrentMission";
import styles from "./Journalists.module.css";

export default function Journalists() {
  // Récupération du token
  const { token } = useContext(Context);
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  // On nomme la page
  document.title =
    language && language === "english" ? "Journalists" : "Journalistes";
  // Récupération de la mission courante
  const { currentMission } = useContext(MissionContext);
  // Liste des journalistes
  const [datas, setDatas] = useState([]);
  // Liste des journalistes affichés (en fonction des recherches notamment)
  const [visibleDatas, setVisibleDatas] = useState([]);
  // Liste des journalistes à ajouter à la mission courante
  const [currentMissionJournalists, setCurrentMissionJounalists] = useState([]);
  // Journaliste dont les détails sont affichés dans une modal
  //const [modalJournalist, setModalJournalist] = useState({});
  // Affichage ou non d'une modale
  //const [modalDisplay, setModalDisplay] = useState(false);
  // Contenu vide d'un objet journalist
  const emptyJournalistContent = {
    lastname: "",
    firstname: "",
    genre: "",
    email: "",
    photo: userDefault,
    phoneNumber: "",
    phoneNumberDirect: "",
    comment: "",
  };
  // Journaliste du formulaire
  const [journalist, setJournalist] = useState(emptyJournalistContent);

  // Préview stocke une url pour l'affichage de la photo uploadée
  const [preview, setPreview] = useState("");

  // Elements (des components selects) qui sont selectionnés au niveau du formulaire
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedNewspapers, setSelectedNewspapers] = useState([]);

  // Update mode (par opposition à mode création)
  const [updateMode, setUpdateMode] = useState(false);
  // Items sélectionnés pour suppressions
  const [journalistsToDelete, setJournalistsToDelete] = useState([]);
  // Affichage du formulaire
  const [displayOn, setDisplayOn] = useState(false);
  // Message informatif (BDD)
  const [message, setMessage] = useState({ content: "", status: "" });

  // CREATION FICHE JOURNALISTE

  const createJournalist = (event) => {
    // On empeche à la page de se recharger
    event.preventDefault();
    // On crée le corps de la requete
    let body = { lastname: journalist.lastname };
    // On y ajoute les champs qui ont été remplis
    journalist.firstname && (body.firstname = journalist.firstname);
    journalist.genre && (body.genre = journalist.genre);
    journalist.email && (body.email = journalist.email);
    selectedTopics.length >= 1 && (body.topics = selectedTopics);
    journalist.phoneNumber && (body.phoneNumber = journalist.phoneNumber);
    journalist.phoneNumberDirect &&
      (body.phoneNumberDirect = journalist.phoneNumberDirect);
    selectedNewspapers.length >= 1 && (body.newspapers = selectedNewspapers);
    journalist.comment && (body.comment = journalist.comment);
    // On appelle la fonction de création avec image

    createItemWithPicture(
      process.env.REACT_APP_API_LINK_JOURNALIST,
      token,
      body,
      journalist.photo,
      setDatas,
      setVisibleDatas,
      setMessage
    );
    cancelItem();
  };

  // MISE A JOUR FICHE JOURNALISTE
  const updateJournalist = (event) => {
    event.preventDefault();

    let body = { ...journalist };
    body.topics = selectedTopics;
    body.newspapers = selectedNewspapers;
    let photo = journalist.photo;
    delete body.photo;
    updateItemWidthPicture(
      journalist._id,
      process.env.REACT_APP_API_LINK_JOURNALIST,
      token,
      body,
      photo,
      setDatas,
      setVisibleDatas,
      setMessage
    );
    setUpdateMode(false);
    setJournalist(emptyJournalistContent);
    setSelectedTopics([]);
    setSelectedNewspapers([]);
    setPreview("");
  };

  // Charger le formulaire (pour modifications)
  const selectItem = (journalistItem) => {
    // On vide le formulaire
    setJournalist(emptyJournalistContent);
    setPreview("");
    // On passe en mode update
    setUpdateMode(true);
    // On rempli les champs des propriétés du journaliste

    setJournalist({ ...journalist, ...journalistItem });
    journalistItem.topics &&
      setSelectedTopics(journalistItem.topics.map((topic) => topic._id));

    journalistItem.newspapers &&
      setSelectedNewspapers(
        journalistItem.newspapers.map((newspaper) => newspaper._id)
      );

    if (journalistItem.photo) {
      // setPhoto(journalistItem.photo);
      setPreview(journalistItem.photo);
    } else {
      // setPhoto(userDefault);
      setPreview(userDefault);
    }

    // On affiche le formulaire s'il n'est pas déjà apparent
    setDisplayOn(true);

    // On remonte au niveau du formulaire
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  // Vider le formulaire
  const cancelItem = () => {
    setJournalist(emptyJournalistContent);
    setSelectedTopics([]);
    setSelectedNewspapers([]);
    setPreview("");
    setUpdateMode(false);
  };

  // Supprimer une fiche journaliste

  const deleteJournalist = (journalistId) => {
    // Supprimer le journaliste
    deleteItem(
      journalistId,
      process.env.REACT_APP_API_LINK_JOURNALIST,
      token,
      setDatas,
      setMessage
    );
    setJournalistsToDelete((journalistsToDelete) =>
      journalistsToDelete.filter((idToDelete) => idToDelete !== journalistId)
    );
  };

  // Ajouter un journaliste à la liste de ceux qui seront ajoutés à la mission en cours
  const addJournalistToCurrentMissionList = (journalistId) => {
    setCurrentMissionJounalists((currentMissionJournalists) => [
      ...currentMissionJournalists,
      journalistId,
    ]);
  };

  // Retirer un journaliste de la liste de ceux qui seront ajoutés à la mission en cours
  const removeJournalistFromCurrentMissionList = (journalistId) => {
    setCurrentMissionJounalists(
      currentMissionJournalists.filter((itemId) => itemId !== journalistId)
    );
  };

  // Toggle Ajout/suppression en fonction des cas
  const toggleJournalistToCurrentMissionList = (journalistId) => {
    if (currentMissionJournalists.includes(journalistId)) {
      removeJournalistFromCurrentMissionList(journalistId);
    } else {
      addJournalistToCurrentMissionList(journalistId);
    }
  };
  //  Selectionner (cocher) tous les journalistes visibles (cad éventuellement filtrés par une selection)
  const checkAllVisibleJournalists = () => {
    visibleDatas.forEach((element) => {
      let selectBox = document.getElementById("checkbox" + element._id);
      if (!selectBox.checked) {
        selectBox.checked = true;
        addJournalistToCurrentMissionList(element._id);
      }
    });
  };

  // Déselectionner (décocher) tous les journalistes visibles (cad éventuellement filtrés par une selection)
  const uncheckAllVisibleJournalists = () => {
    visibleDatas.forEach((element) => {
      let selectBox = document.getElementById("checkbox" + element._id);
      if (selectBox.checked) {
        selectBox.checked = false;
      }
    });
    setCurrentMissionJounalists([]);
  };

  // Selectionner ou Déselectionner tous les journalistes visibles
  const toggleCheckAllVisibleJournalists = (event) => {
    if (event.target.checked) {
      checkAllVisibleJournalists();
    } else {
      uncheckAllVisibleJournalists();
    }
  };

  // Ajouter les journalistes sélectionnés à la mission en cours
  const addJournalistsToCurrentMission = () => {
    currentMissionJournalists.forEach((journalist) => {
      let body = {
        journalist: journalist,
        mission: currentMission,
      };
      createItem(process.env.REACT_APP_API_LINK_RELANCE, body, token);
    });
  };

  // Récupérer la liste des journalistes
  useEffect(() => {
    if (token) {
      let abortController;
      abortController = new AbortController();
      const fetchDatas = async () => {
        let signal = abortController.signal;
        let journalists = await getAllItems(
          process.env.REACT_APP_API_LINK_JOURNALIST,
          token,
          signal
        );
        if (journalists) {
          // La condition permet d'éviter les undefined
          setDatas(journalists);
          setVisibleDatas(journalists);
        }
      };
      fetchDatas();

      return () => abortController.abort();
    } else {
      setDatas([]);
      setVisibleDatas([]);
    }
  }, [token]);

  return (
    <>
      {token ? (
        <div className="positRel">
          <CurrentMission />
          <h1>
            {" "}
            {language && language === "english"
              ? "Journalists"
              : "Journalistes"}
          </h1>
          {/* ********************************************************* */}
          {/* ******************** SECTION FORMULAIRE ***************** */}
          {/* ********************************************************* */}

          <section>
            <FormMask
              title={
                language && language === "english"
                  ? "Journalists management form"
                  : "Formulaire de gestion des journalistes"
              }
              displayOn={displayOn}
              setDisplayOn={setDisplayOn}
            >
              <form
                onSubmit={updateMode ? updateJournalist : createJournalist}
                className="flexV"
              >
                <FormFieldset
                  title={
                    language && language === "english"
                      ? "Creation, addition, deletion of journalists"
                      : "Création, ajout, suppression de journalistes"
                  }
                >
                  <div className="flexHForm">
                    <div className="flexV">
                      <div className={styles.divGenre}>
                        <input
                          name="genre"
                          id="Mme"
                          type="radio"
                          value="MME"
                          checked={journalist.genre === "MME"}
                          onChange={(event) =>
                            setJournalist({
                              ...journalist,
                              genre: event.target.value,
                            })
                          }
                        ></input>
                        <label htmlFor="Mme" className={styles.inputRadioLabel}>
                          {language && language === "english" ? "Mrs" : "Mme"}
                        </label>
                        <input
                          name="genre"
                          id="M"
                          type="radio"
                          value="M."
                          checked={journalist.genre === "M."}
                          onChange={(event) =>
                            setJournalist({
                              ...journalist,
                              genre: event.target.value,
                            })
                          }
                          className={styles.inputRadio}
                        ></input>
                        <label htmlFor="M" className={styles.inputRadioLabel}>
                          {language && language === "english" ? "Mr" : "M."}
                        </label>
                      </div>
                      <label htmlFor="journalist-lastname">
                        {language && language === "english"
                          ? "Lastname"
                          : "Nom"}{" "}
                        *
                      </label>
                      <input
                        id="journalist-lastname"
                        type="text"
                        placeholder={
                          language && language === "english"
                            ? "Journalist's lastname"
                            : "Nom du journaliste"
                        }
                        value={journalist.lastname}
                        onChange={(event) =>
                          setJournalist({
                            ...journalist,
                            lastname: event.target.value,
                          })
                        }
                        className="inputClass"
                      />

                      <label htmlFor="journalist-firstname">
                        {language && language === "english"
                          ? "Firstname"
                          : "Prénom"}
                      </label>
                      <input
                        id="journalist-firstname"
                        type="text"
                        placeholder={
                          language && language === "english"
                            ? "Journalist's firstname"
                            : "Prénom du journaliste"
                        }
                        value={journalist.firstname}
                        onChange={(event) =>
                          setJournalist({
                            ...journalist,
                            firstname: event.target.value,
                          })
                        }
                        className="inputClass"
                      />
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        placeholder={
                          language && language === "english"
                            ? "Journalist's email"
                            : "Email du journaliste"
                        }
                        value={journalist.email}
                        onChange={(event) =>
                          setJournalist({
                            ...journalist,
                            email: event.target.value,
                          })
                        }
                        className="inputClass"
                      />
                      <label htmlFor="file">
                        {language && language === "english"
                          ? "Import picture"
                          : "Importer une photo"}
                      </label>
                      <img
                        src={preview ? preview : journalist.photo}
                        alt="Le journaliste"
                        className={styles.photoJournalist}
                      />
                      <input
                        id="file"
                        type="file"
                        onChange={(event) => {
                          setJournalist({
                            ...journalist,
                            photo: event.target.files[0],
                          });
                          setPreview(
                            URL.createObjectURL(event.target.files[0])
                          );
                        }}
                        className="inputClass"
                      />
                      <label htmlFor="topics">
                        {language && language === "english"
                          ? "Covered topics"
                          : "Sujets traités"}
                      </label>
                      <SelectMultiple
                        id="topics"
                        selectedItems={selectedTopics}
                        setSelectedItems={setSelectedTopics}
                        itemsType="topic"
                      />
                    </div>
                    <div className="flexV">
                      <label htmlFor="phone">
                        {language && language === "english"
                          ? "Phone number"
                          : "Téléphone"}
                      </label>
                      <input
                        id="phone"
                        type="text"
                        placeholder={
                          language && language === "english"
                            ? "Journalist's phone number"
                            : "Téléphone du journaliste"
                        }
                        value={journalist.phoneNumber}
                        onChange={(event) =>
                          setJournalist({
                            ...journalist,
                            phoneNumber: event.target.value,
                          })
                        }
                        className="inputClass"
                      />
                      <label htmlFor="phone-direct">
                        {language && language === "english"
                          ? "Direct phone number"
                          : "Téléphone direct"}
                      </label>
                      <input
                        id="phone-direct"
                        type="text"
                        placeholder={
                          language && language === "english"
                            ? "Journalist's direct phone number"
                            : "Téléphone direct du journaliste"
                        }
                        value={journalist.phoneNumberDirect}
                        onChange={(event) =>
                          setJournalist({
                            ...journalist,
                            phoneNumberDirect: event.target.value,
                          })
                        }
                        className="inputClass"
                      />
                      <label htmlFor="newspapers">
                        {language && language === "english"
                          ? "Newspapers"
                          : "Journaux"}
                      </label>
                      <SelectMultiple
                        id="newspapers"
                        selectedItems={selectedNewspapers}
                        setSelectedItems={setSelectedNewspapers}
                        itemsType="newspaper"
                      />
                      <label htmlFor="comment">
                        {language && language === "english"
                          ? "Comments"
                          : "Commentaires"}
                      </label>
                      <textarea
                        id="comment"
                        placeholder={
                          language && language === "english"
                            ? "Comments"
                            : "Commentaires"
                        }
                        value={journalist.comment}
                        onChange={(event) =>
                          setJournalist({
                            ...journalist,
                            comment: event.target.value,
                          })
                        }
                        className="inputClass"
                      />
                      <input
                        type="submit"
                        value={
                          updateMode
                            ? language === "english"
                              ? "Modify journalist"
                              : "Modifier la fiche"
                            : language === "english"
                            ? "Create journalist"
                            : "Créer la fiche"
                        }
                        className="loginSubmit"
                      />
                      {updateMode ? (
                        <button
                          onClick={() => cancelItem()}
                          className="loginSubmit"
                        >
                          {language && language === "english"
                            ? "Empty form"
                            : "Vider le formulaire"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </FormFieldset>
              </form>
            </FormMask>
          </section>
          <Message message={message} />
          {/* ********************************************************* */}
          {/* ********************** SECTION LISTE ******************** */}
          {/* ********************************************************* */}
          <section className="flexV">
            <SearchBar
              datas={datas}
              setDatas={setDatas}
              visibleDatas={visibleDatas}
              setVisibleDatas={setVisibleDatas}
              searchParams={
                language && language === "english"
                  ? [
                      ["firstname", "Firstname"],
                      ["lastname", "Lastname"],
                      ["phoneNumber", "Phone"],
                    ]
                  : [
                      ["firstname", "Prénom"],
                      ["lastname", "Nom"],
                      ["phoneNumber", "Téléphone"],
                    ]
              }
            ></SearchBar>
            <SelectAll
              datas={datas}
              deleteData={deleteJournalist}
              itemsToDelete={journalistsToDelete}
              setItemsToDelete={setJournalistsToDelete}
            />
            {currentMission ? (
              <div className={styles.addToMissionModule}>
                {/* <div className={styles.selectAll}> */}
                <label
                  htmlFor="checkboxSelectAll"
                  className={styles.disappear768}
                >
                  {language && language === "english"
                    ? "Select every journalists"
                    : "Sélectionner tous les journalistes"}{" "}
                </label>
                <label htmlFor="checkboxSelectAll" className={styles.appear768}>
                  {language && language === "english"
                    ? "Select everything"
                    : "Tout sélectionner"}{" "}
                </label>
                <input
                  type="checkbox"
                  name="checkboxSelectAll"
                  id="checkboxSelectAll"
                  value="Tout sélectionner"
                  onChange={(e) => toggleCheckAllVisibleJournalists(e)}
                  className={styles.checkboxInput}
                />
                <button
                  onClick={
                    currentMissionJournalists.length > 0
                      ? addJournalistsToCurrentMission
                      : () =>
                          alert(
                            "Vous devez d'abord choisir un (ou plusieurs journalistes)"
                          )
                  }
                  className={
                    currentMissionJournalists.length > 0 ? "clickable" : ""
                  }
                  disabled={currentMissionJournalists.length === 0}
                >
                  {language && language === "english"
                    ? "Add to current mission"
                    : "Ajouter à la mission en cours"}
                </button>
              </div>
            ) : (
              <InfoContent
                textInfo={
                  language && language === "english"
                    ? "You first need to select a mission to be able to add journalists to it"
                    : "Veuillez d'abord sélectionner une mission pour pouvoir y ajouter les journalistes"
                }
              />
            )}

            {datas.map((data) => {
              if (visibleDatas.includes(data)) {
                return (
                  <div key={data._id} className={styles.divHoriz}>
                    <CardHoriz
                      itemReduced={{
                        Nom: data.firstname
                          ? data.firstname + " " + data.lastname
                          : data.lastname,
                        Email: data.email,
                        Téléphone: data.phoneNumber,
                      }}
                      item={data}
                      logo={
                        data.photo
                          ? process.env.REACT_APP_SERVER + data.photo
                          : userDefault
                      }
                      deleteItem={deleteJournalist}
                      loadForm={selectItem}
                      itemsToDelete={journalistsToDelete}
                      setItemsToDelete={setJournalistsToDelete}
                    >
                      <img
                        src={
                          data.photo
                            ? process.env.REACT_APP_SERVER + data.photo
                            : userDefault
                        }
                        alt="Le journaliste"
                        className={styles.photoJournalist}
                      />
                      <h4 className="h4Bold">
                        {language && language === "english"
                          ? "Lastname"
                          : "Nom"}{" "}
                        :
                      </h4>
                      <p>
                        {data.genre} {data.firstname} {data.lastname}
                      </p>
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

                      {data.phoneNumberDirect && (
                        <>
                          <h4 className="h4Bold">
                            {language && language === "english"
                              ? "Direct phone number"
                              : "Téléphone direct"}{" "}
                            :
                          </h4>
                          <p> {data.phoneNumberDirect}</p>
                        </>
                      )}

                      {data.newspapers.length > 0 && (
                        <div>
                          <h4 className="h4Bold">
                            {language && language === "english"
                              ? "Newspapers"
                              : "Journaux"}{" "}
                            :
                          </h4>
                          {data.newspapers.map((newspaper) => {
                            return <p key={newspaper._id}>{newspaper.name}</p>;
                          })}
                        </div>
                      )}
                      {data.topics.length > 0 && (
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
                        <>
                          <h4 className="h4Bold">Description :</h4>
                          <p>{data.comment}</p>
                        </>
                      )}

                      {/* <div className={styles.details}>
                        <BiDetail
                          size="3em"
                          onClick={() => {
                            setModalJournalist(data);
                            setModalDisplay(true);
                          }}
                          className="clickable"
                        />
                      </div> */}
                    </CardHoriz>
                    {currentMission && (
                      <div className={styles.selectOne}>
                        <input
                          type="checkbox"
                          name={"checkbox" + data._id}
                          id={"checkbox" + data._id}
                          onChange={() => {
                            toggleJournalistToCurrentMissionList(data._id);
                          }}
                          className={styles.checkboxInput}
                        />
                      </div>
                    )}

                    {/* DETAILS JOURNALIST MODAL */}
                    {/* {modalJournalist === data && (
                      <ModalDisplay
                        modalDisplay={modalDisplay}
                        setModalDisplay={setModalDisplay}
                        width="1000px"
                        height="900px"
                        color="#5e7497"
                      >
                        <Journalist id={data._id} />
                      </ModalDisplay>
                    )} */}
                  </div>
                );
              }
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
