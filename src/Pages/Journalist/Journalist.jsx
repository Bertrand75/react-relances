import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Context from "../../Context/Context";
import userDefault from "./../../Images/user_default.svg";
import { getOneItem } from "../../Utilities/CrudFunctions";
import styles from "./Journalist.module.css";

export default function Journalist(props) {
  // Props ou pas
  const [propUse, setPropUse] = useState(false);
  // Cas d'utilisation via la navigation
  let { id } = useParams();
  // Cas d'utilisation avec un props
  // if (props.id) {
  //   id = props.id;
  //   setPropUse(true);
  // } else {
  //   setPropUse(false);
  // }
  const { token } = useContext(Context);
  const [journalistData, setJournalistData] = useState({});
  document.title = `${journalistData.firstname} ${journalistData.lastname}`;

  useEffect(() => {
    if (props.id) {
      id = props.id;
      setPropUse(true);
    } else {
      setPropUse(false);
    }
    if (token) {
      async function fetchDatas() {
        let abortController;
        abortController = new AbortController();
        let signal = abortController.signal;
        let response = await getOneItem(
          id,
          process.env.REACT_APP_API_LINK_JOURNALIST,
          token,
          signal
        );
        setJournalistData(response);
        return () => abortController.abort();
      }
      fetchDatas();
    } else {
      setJournalistData({});
    }
  }, [token]);
  return (
    <div className={styles.container}>
      <img
        src={
          journalistData.photo
            ? process.env.REACT_APP_SERVER + journalistData.photo
            : userDefault
        }
        className={styles.photoJournalist}
        alt="Le journaliste"
      />
      <div className={styles.journalistBasics}>
        <div className={styles.journalistName}>
          {journalistData.genre && journalistData.genre}{" "}
          {journalistData.firstname && journalistData.firstname}{" "}
          {journalistData.lastname && journalistData.lastname}
        </div>
        <div className={styles.journalistMainJournal}>
          {journalistData.newspapers &&
            journalistData.newspapers[0] &&
            journalistData.newspapers[0].name}
        </div>
        <div className={styles.journalistMainTopic}>
          {journalistData.topics &&
            journalistData.topics[0] &&
            journalistData.topics[0].name}
        </div>
      </div>
      <div className={styles.journalistContact}>
        <div className={styles.flex + " " + styles.journalistEmail}>
          <h4 className={styles.h4}>Email :</h4>
          <p>{journalistData.email}</p>
        </div>
        <div className={styles.flex + " " + styles.journalistTel}>
          <h4 className={styles.h4}>Téléphone :</h4>
          <p>{journalistData.phoneNumber}</p>
        </div>

        <div className={styles.flex + " " + styles.journalistTelDirect}>
          <h4 className={styles.h4}>Téléphone direct :</h4>
          <p>{journalistData.phoneNumberDirect}</p>
        </div>
      </div>

      <div className={styles.journalistNewspapers}>
        <h4 className={styles.h4}>Journaux :</h4>
        {journalistData.newspapers
          ? journalistData.newspapers.map((newspaper) => {
              return (
                <div key={newspaper._id} className={styles.item}>
                  {newspaper.name}
                </div>
              );
            })
          : "NC"}
      </div>

      <div className={styles.journalistTopics}>
        <h4 className={styles.h4}>Sujets :</h4>
        {journalistData.topics
          ? journalistData.topics.map((topic) => {
              return (
                <div key={topic._id} className={styles.item}>
                  {topic.name}
                </div>
              );
            })
          : "NC"}
      </div>

      <div
        className={
          propUse
            ? styles.journalistDescription + " " + styles.maxWidth
            : styles.journalistDescription
        }
      >
        <h4 className={styles.h4}>Description :</h4>
        <p>{journalistData.comment}</p>
      </div>
    </div>
  );
}
