import React from "react";
import PropTypes from "prop-types";
import userDefault from "./../../Images/user_default.svg";
import { FaWindowClose, FaPenSquare } from "react-icons/fa";
import styles from "./CardJournalist.module.css";

export default function CardJournalist({
  data,
  setDatas,
  deleteItem,
  selectItem,
  token,
  API_LINK_JOURNALIST,
}) {
  return (
    <div key={data._id} className={styles.card}>
      <img
        src={
          data.photo ? process.env.REACT_APP_SERVER + data.photo : userDefault
        }
        alt="Le journaliste"
      />
      <p>
        <strong>Genre :</strong> {data.genre}
      </p>
      <p>
        <strong>Nom :</strong> {data.lastname}
      </p>
      <p>
        <strong>Prénom :</strong> {data.firstname}
      </p>
      <p>
        <strong>Email :</strong> {data.email}
      </p>
      <p>
        <strong>Téléphone :</strong> {data.phoneNumber}
      </p>
      <p>
        <strong>Téléphone direct :</strong> {data.phoneNumberDirect}
      </p>
      <div>
        <strong>Journaux :</strong>
        {data.newspapers.map((newspaper) => {
          return <p key={newspaper._id}>{newspaper.name}</p>;
        })}
      </div>
      <div>
        <strong>sujets :</strong>
        {data.topics.map((topic) => {
          return <p key={topic._id}>{topic.name}</p>;
        })}
      </div>
      <p>
        <strong>Description :</strong> {data.comment}
      </p>
      <FaWindowClose
        onClick={() => {
          // deleteJournalist(data);
          deleteItem(data._id, API_LINK_JOURNALIST, token, setDatas);
        }}
      />
      <FaPenSquare
        onClick={() => {
          selectItem(data);
        }}
      />
    </div>
  );
}
CardJournalist.propTypes = {
  data: PropTypes.object,
  setDatas: PropTypes.func,
  deleteItem: PropTypes.func,
  selectItem: PropTypes.func,
  token: PropTypes.string.isRequired,
  API_LINK_JOURNALIST: PropTypes.string.isRequired,
};
