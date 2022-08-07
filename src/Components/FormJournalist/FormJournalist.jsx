import React, { useState, useEffect, useContext } from "react";
import { getAllItems } from "../../Utilities/CrudFunctions";
import axios from "axios";
import Context from "../../Context/Context";
import LanguageContext from "../../../Context/LanguageContext";
import FormMask from "../FormMask/FormMask";

// FORMULAIRE DE GESTION DES FICHES JOURNALISTES

export default function FormJournalist(props) {
  let { datas, setDatas, setMessage } = props;
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [genre, setGenre] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [topics, setTopics] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newspapers, setNewspapers] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedNewspapers, setSelectedNewspapers] = useState([]);
  const [comment, setComment] = useState("");
  // Récupération du token
  const { token } = useContext(Context);
  // Récupération de la langue
  const { language } = useContext(LanguageContext);

  const createJournalist = (event) => {
    event.preventDefault();
    let bodyFormData = new FormData();
    bodyFormData.append("lastname", lastname);
    bodyFormData.append("firstname", firstname);
    bodyFormData.append("genre", genre);
    bodyFormData.append("email", email);
    bodyFormData.append("photo-server", photo);
    //bodyFormData.append("topics", selectedTopics);
    bodyFormData.append("phoneNumber", phoneNumber);
    //bodyFormData.append("newspapers", selectedNewspapers);
    bodyFormData.append("comment", comment);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(process.env.REACT_APP_API_LINK_JOURNALIST, bodyFormData, config)
      .then((response) => {
        console.log(response);
        setDatas((datas) => [response.data.item, ...datas]);
        setMessage({
          content: response.data.message,
          status: response.status,
        });
      })
      .catch((error) => {
        setMessage({
          content: error.response.data.message,
          status: error.response.status,
        });
      });
  };

  // Fonction qui permet de récupérer un tableau des id des valeurs selectionnées à partir d'une HTML collection
  // Utilisée pour récupérer les données des select à choix multiples
  const preSetSelectedItems = (htmlCollec, fonction) => {
    let newValues = [];
    for (let index = 0; index < htmlCollec.length; index++) {
      newValues.push(htmlCollec[index].value);
    }
    fonction(newValues);
  };

  // Récupérer les sujets, journaux au chargement de la page

  useEffect(() => {
    if (token) {
      let abortController;
      abortController = new AbortController();
      let signal = abortController.signal;
      const fetchDatas = async () => {
        let topicsData = await getAllItems(
          process.env.REACT_APP_API_LINK_TOPIC,
          token,
          signal
        );
        setTopics(topicsData);
      };
      fetchDatas();
      return () => abortController.abort();
    } else {
      setTopics([]);
    }
  }, [token]);
  useEffect(() => {
    if (token) {
      let abortController;
      abortController = new AbortController();
      let signal = abortController.signal;
      const fetchDatas = async () => {
        let newspapersData = await getAllItems(
          process.env.REACT_APP_API_LINK_NEWSPAPER,
          token,
          signal
        );
        setNewspapers(newspapersData);
      };
      fetchDatas();
      return () => abortController.abort();
    } else {
      setNewspapers([]);
    }
  }, [token]);

  return (
    <FormMask title={"Gestion des journalistes"}>
      <form onSubmit={createJournalist} className="flexV">
        <div onChange={(event) => setGenre(event.target.value)}>
          <input name="genre" id="Mme" type="radio" value="Mme"></input>
          <label htmlFor="Mme">
            {language && language === "english" ? "Mrs" : "Mme"}
          </label>
          <input name="genre" id="M" type="radio" value="M."></input>
          <label htmlFor="M">
            {language && language === "english" ? "Mr" : "M."}
          </label>
        </div>
        <input
          type="text"
          placeholder="Nom du journaliste"
          value={lastname}
          onChange={(event) => setLastname(event.target.value)}
          className="inputClass"
        />
        <input
          type="text"
          placeholder="Prénom du journaliste"
          value={firstname}
          onChange={(event) => setFirstname(event.target.value)}
          className="inputClass"
        />
        <input
          type="email"
          placeholder="Email du journaliste"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="inputClass"
        />
        <input
          type="file"
          onChange={(event) => setPhoto(event.target.files[0])}
          className="inputClass"
        />
        <select
          multiple
          onChange={(event) =>
            preSetSelectedItems(event.target.selectedOptions, setSelectedTopics)
          }
          className="selectClass"
        >
          {topics.map((topic) => {
            return (
              <option key={topic._id} value={topic._id}>
                {topic.name}
              </option>
            );
          })}
        </select>
        <input
          type="text"
          placeholder="Téléphone du journaliste"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          className="inputClass"
        />
        <select
          multiple
          onChange={(event) =>
            preSetSelectedItems(
              event.target.selectedOptions,
              setSelectedNewspapers
            )
          }
          className="selectClass"
        >
          {newspapers.map((newspaper) => {
            return (
              <option key={newspaper._id} value={newspaper._id}>
                {newspaper.name}
              </option>
            );
          })}
        </select>
        <textarea
          placeholder="Commentaires"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />{" "}
        <input type="submit" value="Créer la fiche" className="loginSubmit" />
      </form>
    </FormMask>
  );
}
