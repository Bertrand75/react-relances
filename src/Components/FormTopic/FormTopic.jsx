import React, { useContext, useEffect } from "react";
import axios from "axios";
import Context from "../../Context/Context";
import LanguageContext from "../../Context/LanguageContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormMask from "../FormMask/FormMask";
import FormFieldset from "../FormFieldset/FormFieldset";
import FormButton from "../FormButton/FormButton";
import { createItem, updateItem } from "../../Utilities/CrudFunctions";
import styles from "./FormTopic.module.css";

// FORMULAIRE D'AJOUT DE SUJETS
export default function FormTopic(props) {
  // Récupération du token
  const { token } = useContext(Context);
  // Récupération de la langue
  const { language } = useContext(LanguageContext);

  let {
    datas,
    setDatas,
    dataToModif,
    setDataToModif,
    updateMode,
    setUpdateMode,
    displayOn,
    setDisplayOn,
    setMessage,
    setVisibleDatas,
  } = props;

  const formik = useFormik({
    initialValues: {
      topicTitle: dataToModif.name,
      topicDescription: dataToModif.description,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      topicTitle: Yup.string()
        .min(2, "Le sujet doit contenir 2 caractères au minimum")
        .max(50, "Le sujet ne doit pas dépasser 50 caractères")
        .required("L'intitulé du sujet est obligatoire"),
      topicDescription: Yup.string()
        .min(2, "La description doit posséder 2 caractères au minimum")
        .max(1000, "La description ne doit pas dépasser 1000 caractères"),
    }),
    onSubmit: (values) => {
      // Cas ou l'on fait une MODIFICATION
      if (updateMode === true) {
        const body = {
          name: values.topicTitle,
          description: values.topicDescription,
        };
        const config = {
          headers: {
            "content-type": "Application/json",
            authorization: `Bearer ${token}`,
          },
        };
        axios
          .patch(
            process.env.REACT_APP_API_LINK_TOPIC + dataToModif._id,
            body,
            config
          )
          .then((response) => {
            // mise à jour de l'affichage
            let newDatas = datas.filter((data) => {
              return data._id !== dataToModif._id;
            });

            setDatas([...newDatas, response.data.item]);
            setMessage({
              content: response.data.message,
              status: response.status,
            });
            setDataToModif({ name: "", description: "" });
            setUpdateMode(false);
          })
          .catch((error) => {
            console.log(error);
            setDataToModif({ name: "", description: "" });
          });
      } else {
        // Cas ou l'on fait une CREATION
        let body = {
          name: values.topicTitle,
        };
        if (values.topicDescription) body.description = values.topicDescription;
        createItem(
          process.env.REACT_APP_API_LINK_TOPIC,
          body,
          token,
          setDatas,
          setVisibleDatas,
          setMessage
        );
      }
    },
  });

  // Annuler le mode update (pour repasser en mode création)
  const cancelUpdate = () => {
    // Vider les champs du formulaire
    setDataToModif({ name: "", description: "" });
    // Annuler le mode update
    setUpdateMode(false);
  };

  return (
    <FormMask
      title={
        language && language === "english"
          ? "Topics management form"
          : "Formulaire de gestion des topics"
      }
      displayOn={displayOn}
      setDisplayOn={setDisplayOn}
    >
      <form onSubmit={formik.handleSubmit} className="flexV">
        <FormFieldset
          title={
            language && language === "english"
              ? "Creation, addition, deletion of topics"
              : "Création, ajout, suppression des sujets"
          }
        >
          <div>
            <label htmlFor="topicTitle">
              {language && language === "english"
                ? "Topic title"
                : "Intitulé du sujet"}{" "}
              *{" "}
            </label>
            <input
              id="topicTitle"
              name="topicTitle"
              type="text"
              placeholder={
                language && language === "english"
                  ? "Topic title"
                  : "Intitulé du sujet"
              }
              value={formik.values.topicTitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="inputClass"
            />
            {formik.touched.topicTitle && formik.errors.topicTitle ? (
              <p className="formikAlert">{formik.errors.topicTitle}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="topicDescription">
              {language && language === "english"
                ? "Topic description"
                : "Description du sujet"}
            </label>
            <textarea
              id="topicDescription"
              name="topicDescription"
              type="text"
              placeholder={
                language && language === "english"
                  ? "Explanations"
                  : "Explications"
              }
              value={formik.values.topicDescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="inputClass"
            />
            {formik.touched.topicDescription &&
            formik.errors.topicDescription ? (
              <p className="formikAlert">{formik.errors.topicDescription}</p>
            ) : null}
          </div>
          <FormButton
            updateMode={updateMode}
            cancelUpdate={cancelUpdate}
          ></FormButton>
        </FormFieldset>
      </form>
    </FormMask>
  );
}
