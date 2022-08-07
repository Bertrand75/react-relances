import React, { useState, useContext, useEffect } from "react";
import FormClient from "../../Components/FormClient/FormClient";
import Context from "../../Context/Context";
import LanguageContext from "../../Context/LanguageContext";
import { getAllItems, deleteItem } from "./../../Utilities/CrudFunctions";
import Message from "../../Components/Message/Message";
import CardHoriz from "../../Components/CardHoriz/CardHoriz";
import EmptyPage from "../../Components/EmptyPage/EmptyPage";
import CurrentMission from "../../Components/CurrentMission/CurrentMission";

export default function Customers() {
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  // Titre de la page
  document.title = language && language === "english" ? "Customers" : "Clients";
  // Liste des clients
  const [items, setItems] = useState([]);
  // Client sélectionné
  const [selectedItem, setSelectedItem] = useState({
    nom: "",
    nomContact: "",
    prenomContact: "",
    phoneNumber: "",
    email: "",
    comment: "",
  });
  // Pour distinguer le mode update et le mode create
  const [updateMode, setUpdateMode] = useState(false);
  // Pour gérer l'ouverture du masque de formulaire
  const [formDisplay, setFormDisplay] = useState(false);
  // Message informatif pour les échanges avec la BDD
  const [message, setMessage] = useState({ content: "", status: "" });

  // Recuperation du token du contexte
  const { token } = useContext(Context);

  // Fonction de suppression du client sélectionné
  const deleteCustomer = (id) => {
    deleteItem(
      id,
      process.env.REACT_APP_API_LINK_CLIENT,
      token,
      setItems,
      setMessage
    );
  };

  // Fonction de remplissage du formulaire avec les données du client sélectionné + passage en mode de mise à jour
  const fillForm = (customer) => {
    setSelectedItem(customer);
    setUpdateMode(true);
    setFormDisplay(true);
  };

  // Récupération de la liste des clients
  useEffect(() => {
    if (token) {
      let abortController;
      abortController = new AbortController();
      const fetchDatas = async () => {
        let signal = abortController.signal;
        let clientsData = await getAllItems(
          process.env.REACT_APP_API_LINK_CLIENT,
          token,
          signal
        );
        clientsData && setItems(clientsData);
      };
      fetchDatas();
      return () => abortController.abort();
    } else {
      setItems([]);
    }
  }, [token]);
  return (
    <>
      {token ? (
        <div className="positRel">
          <CurrentMission />
          <h1>
            {language && language === "english" ? "Customers" : "Clients"}
          </h1>
          {/* Le formulaire */}
          <section>
            <FormClient
              setDatas={setItems}
              dataToModif={selectedItem}
              setDataToModif={setSelectedItem}
              updateMode={updateMode}
              setUpdateMode={setUpdateMode}
              displayOn={formDisplay}
              setDisplayOn={setFormDisplay}
              setMessage={setMessage}
            ></FormClient>
          </section>
          <Message message={message} />
          {/* La liste */}
          <section className="flexV">
            {items &&
              items.map((item) => (
                <CardHoriz
                  key={item._id + "cardHoriz"}
                  itemReduced={{
                    Nom: item.nom,
                    Email: item.email,
                    Telephone: item.phoneNumber,
                  }}
                  item={item}
                  deleteItem={deleteCustomer}
                  loadForm={fillForm}
                >
                  <h4 className="h4Bold">
                    {language && language === "english" ? "Name" : "Nom"} :
                  </h4>
                  <p>{item.nom}</p>
                  {item.nomContact && (
                    <>
                      <h4 className="h4Bold">
                        {language && language === "english"
                          ? "Contact lastname"
                          : "Nom du contact"}{" "}
                        :
                      </h4>
                      <p>{item.nomContact}</p>
                    </>
                  )}

                  {item.prenomContact && (
                    <>
                      <h4 className="h4Bold">
                        {" "}
                        {language && language === "english"
                          ? "Contact firstname"
                          : "Prénom du contact"}{" "}
                        :
                      </h4>
                      <p> {item.prenomContact}</p>
                    </>
                  )}

                  {item.phoneNumber && (
                    <>
                      <h4 className="h4Bold">
                        {" "}
                        {language && language === "english"
                          ? "Phone number"
                          : "Téléphone"}{" "}
                        :
                      </h4>
                      <p>{item.phoneNumber}</p>
                    </>
                  )}

                  {item.email && (
                    <>
                      <h4 className="h4Bold">Email :</h4>
                      <p>{item.email}</p>
                    </>
                  )}

                  {item.comment && (
                    <>
                      <h4 className="h4Bold">
                        {" "}
                        {language && language === "english"
                          ? "Comments"
                          : "Commentaires"}{" "}
                        :
                      </h4>
                      <p>{item.comment}</p>
                    </>
                  )}
                </CardHoriz>
              ))}
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
