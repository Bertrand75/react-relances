import React, { useContext } from "react";

import Context from "../../Context/Context";
import LanguageContext from "../../Context/LanguageContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormMask from "../FormMask/FormMask";
import FormFieldset from "../FormFieldset/FormFieldset";
import FormButton from "./../FormButton/FormButton";
import { createItem, updateItem } from "../../Utilities/CrudFunctions";

// FORMULAIRE D'AJOUT DE CLIENTS
export default function FormClient(props) {
  // Récupération du token
  const { token } = useContext(Context);
  // Récupération de la langue
  const { language } = useContext(LanguageContext);

  let {
    setDatas,
    dataToModif,
    setDataToModif,
    updateMode,
    setUpdateMode,
    displayOn,
    setDisplayOn,
    setMessage,
  } = props;

  const formik = useFormik({
    initialValues: {
      clientName: dataToModif.nom,
      clientContactLastname: dataToModif.nomContact,
      clientContactFirstname: dataToModif.prenomContact,
      clientPhoneNumber: dataToModif.phoneNumber,
      clientEmail: dataToModif.email,
      clientDescription: dataToModif.comment,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      clientName: Yup.string()
        .min(2, "Le nom du client doit contenir 2 caractères au minimum")
        .max(40, "Le nom du client ne doit pas dépasser 40 caractères")
        .required("L'intitulé est obligatoire"),
      clientContactLastname: Yup.string()
        .min(2, "Le nom du contact doit contenir 2 caractères au minimum")
        .max(40, "Le nom du contact ne doit pas dépasser 40 caractères"),
      clientContactFirstname: Yup.string()
        .min(2, "Le prénom du contact doit contenir 2 caractères au minimum")
        .max(40, "Le prénom du contact ne doit pas dépasser 40 caractères"),
      clientPhoneNumber: Yup.string(),
      clientEmail: Yup.string().email("Il faut saisir un email valide"),
      clientDescription: Yup.string().max(
        400,
        "La description ne doit pas dépasser 400 caractères"
      ),
    }),
    onSubmit: (values) => {
      // Cas ou l'on fait une MODIFICATION
      if (updateMode === true) {
        let body = {
          nom: values.clientName,
          nomContact: values.clientContactLastname,
          prenomContact: values.clientContactFirstname,
          phoneNumber: values.clientPhoneNumber,
          comment: values.clientDescription,
        };
        // L'email doit être unique
        // Pour qu'il n'y ait pas un null (qui crérait une erreur "déjà existant"), on ne l'upload que s'il contient quelque chose
        if (values.clientEmail) {
          body.email = values.clientEmail;
        }
        updateItem(
          dataToModif._id,
          process.env.REACT_APP_API_LINK_CLIENT,
          body,
          token,
          setDatas,
          setMessage
        );
        setDataToModif({
          nom: "",
          nomContact: "",
          prenomContact: "",
          phoneNumber: "",
          email: "",
          comment: "",
        });
        setUpdateMode(false);
      } else {
        // Cas ou l'on fait une CREATION
        let body = {
          nom: values.clientName,
          nomContact: values.clientContactLastname,
          prenomContact: values.clientContactFirstname,
          phoneNumber: values.clientPhoneNumber,
          comment: values.clientDescription,
        };
        // L'email doit être unique; pour qu'il n'y ait pas un null (déjà existant), on ne l'upload que s'il contient quelque chose
        if (values.clientEmail) {
          body.email = values.clientEmail;
        }
        createItem(
          process.env.REACT_APP_API_LINK_CLIENT,
          body,
          token,
          setDatas,
          undefined,
          setMessage
        );
      }
    },
  });

  // Fonction de vidage du formulaire et retour en mode création pour le boutton "vider le formulaire"
  const cancelUpdateMode = () => {
    setDataToModif({
      nom: "",
      nomContact: "",
      prenomContact: "",
      phoneNumber: "",
      email: "",
      comment: "",
    });
    setUpdateMode(false);
  };

  return (
    <FormMask
      title={
        language && language === "english"
          ? "Customers management form"
          : "Formulaire de gestion des clients"
      }
      displayOn={displayOn}
      setDisplayOn={setDisplayOn}
    >
      <form onSubmit={formik.handleSubmit} className="flexV">
        <FormFieldset
          title={
            language && language === "english"
              ? "Creation, addition, deletion of customers"
              : "Création, ajout, suppression des clients"
          }
        >
          <label htmlFor="clientName">
            {language && language === "english"
              ? "Customer's name"
              : "Nom du client"}{" "}
            *
          </label>
          <input
            id="clientName"
            name="clientName"
            type="text"
            placeholder="Nom du client"
            value={formik.values.clientName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="inputClass"
          />
          {formik.touched.clientName && formik.errors.clientName ? (
            <p className="formikAlert">{formik.errors.clientName}</p>
          ) : null}
          <label htmlFor="clientContactLastname">
            {language && language === "english"
              ? "Contact's lastname"
              : "Nom du contact"}
          </label>
          <input
            id="clientContactLastname"
            name="clientContactLastname"
            type="text"
            placeholder={
              language && language === "english"
                ? "Contact's lastname"
                : "Nom du contact"
            }
            value={formik.values.clientContactLastname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="inputClass"
          />
          {formik.touched.clientContactLastname &&
          formik.errors.clientContactLastname ? (
            <p className="formikAlert">{formik.errors.clientContactLastname}</p>
          ) : null}
          <label htmlFor="clientContactFirstname">
            {language && language === "english"
              ? "Contact's firstname"
              : "Prénom du contact"}
          </label>
          <input
            id="clientContactFirstname"
            name="clientContactFirstname"
            type="text"
            placeholder={
              language && language === "english"
                ? "Contact's firstname"
                : "Prénom du contact"
            }
            value={formik.values.clientContactFirstname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="inputClass"
          />
          {formik.touched.clientContactFirstname &&
          formik.errors.clientContactFirstname ? (
            <p className="formikAlert">
              {formik.errors.clientContactFirstname}
            </p>
          ) : null}
          <label htmlFor="clientPhoneNumber">
            {language && language === "english"
              ? "Contact's phone number"
              : "Téléphone du contact"}
          </label>
          <input
            id="clientPhoneNumber"
            name="clientPhoneNumber"
            type="text"
            placeholder={
              language && language === "english"
                ? "Contact's phone number"
                : "Téléphone du contact"
            }
            value={formik.values.clientPhoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="inputClass"
          />
          {formik.touched.clientPhoneNumber &&
          formik.errors.clientPhoneNumber ? (
            <p className="formikAlert">{formik.errors.clientPhoneNumber}</p>
          ) : null}
          <label htmlFor="clientEmail">
            {language && language === "english"
              ? "Contact's email"
              : "Email du contact"}
          </label>
          <input
            id="clientEmail"
            name="clientEmail"
            type="text"
            placeholder={
              language && language === "english"
                ? "Contact's email"
                : "Email du contact"
            }
            value={formik.values.clientEmail ? formik.values.clientEmail : ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="inputClass"
          />
          {formik.touched.clientEmail && formik.errors.clientEmail ? (
            <p className="formikAlert">{formik.errors.clientEmail}</p>
          ) : null}
          <label htmlFor="clientDescription">
            {language && language === "english" ? "Comments" : "Commentaires"}
          </label>
          <textarea
            id="clientDescription"
            name="clientDescription"
            type="text"
            placeholder={
              language && language === "english" ? "Comments" : "Commentaires"
            }
            value={formik.values.clientDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="inputClass"
          />
          {formik.touched.clientDescription &&
          formik.errors.clientDescription ? (
            <p className="formikAlert">{formik.errors.clientDescription}</p>
          ) : null}

          <FormButton updateMode={updateMode} cancelUpdate={cancelUpdateMode} />
        </FormFieldset>
      </form>
    </FormMask>
  );
}
