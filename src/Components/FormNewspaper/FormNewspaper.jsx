import React, { useContext } from "react";
import Context from "../../Context/Context";
import LanguageContext from "../../Context/LanguageContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormMask from "../FormMask/FormMask";
import FormFieldset from "../FormFieldset/FormFieldset";
import FormButton from "../FormButton/FormButton";
import { createItem, updateItem } from "../../Utilities/CrudFunctions";

export default function FormNewspaper(props) {
  // Récupération des props
  let {
    setDatas,
    setVisibleDatas,
    selectedItem,
    setSelectedItem,
    updateMode,
    setUpdateMode,
    displayOn,
    setDisplayOn,
    setMessage,
  } = props;

  const API_LINK_NEWSPAPER = process.env.REACT_APP_API_LINK_NEWSPAPER;
  // Récupération du token
  const { token } = useContext(Context);
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  // Vider le formulaire
  const emptyForm = () => {
    setSelectedItem({
      name: "",
      email: "",
      phoneNumber: "",
      description: "",
    });
  };

  const formik = useFormik({
    initialValues: {
      newspaperName: selectedItem.name,
      newspaperEmail: selectedItem.email,
      newspaperPhone: selectedItem.phoneNumber,
      newspaperDescription: selectedItem.description,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      newspaperName: Yup.string()
        .min(2, "Le nom du journal doit contenir 2 caractères au minimum")
        .max(50, "Le nom du journal ne doit pas dépasser 50 caractères")
        .required("Le nom du journal est obligatoire"),
      newspaperEmail: Yup.string().email(
        "Il faut entrer une adresse email valide"
      ),
      newspaperPhone: Yup.string().matches(
        phoneRegExp,
        "Numéro de téléphone invalide"
      ),
      newspaperDescription: Yup.string()
        .min(2, "La description doit posséder 2 caractères au minimum")
        .max(400, "La description ne doit pas dépasser 400 caractères"),
    }),
    onSubmit: (values) => {
      // Cas ou l'on fait une MODIFICATION
      if (updateMode === true) {
        const body = {
          name: values.newspaperName,
          email: values.newspaperEmail,
          phoneNumber: values.newspaperPhone,
          description: values.newspaperDescription,
        };
        updateItem(
          selectedItem._id,
          API_LINK_NEWSPAPER,
          body,
          token,
          setDatas,
          setMessage
        );
        emptyForm();
        setUpdateMode(false);
      } else {
        // Cas ou l'on fait une CREATION
        let body = {
          name: values.newspaperName,
        };
        if (values.newspaperEmail) body.email = values.newspaperEmail;
        if (values.newspaperPhone) body.phoneNumber = values.newspaperPhone;
        if (values.newspaperDescription)
          body.description = values.newspaperDescription;
        createItem(
          API_LINK_NEWSPAPER,
          body,
          token,
          setDatas,
          setVisibleDatas,
          setMessage
        );
        emptyForm();
      }
    },
  });

  // Annuler le mode update (pour repasser en mode création)
  const cancelUpdate = () => {
    // Vider les champs du formulaire
    emptyForm();
    // Annuler le mode update
    setUpdateMode(false);
  };
  return (
    <FormMask
      title={
        language && language === "english"
          ? "Newspapers management form"
          : "Formulaire de gestion des journaux"
      }
      displayOn={displayOn}
      setDisplayOn={setDisplayOn}
    >
      <form className="flexV" onSubmit={formik.handleSubmit}>
        <FormFieldset
          title={
            language && language === "english"
              ? "Creation, addition, deletion of newspapers"
              : "Création, ajout, suppression de journaux"
          }
        >
          <label htmlFor="newspaperName">
            {language && language === "english" ? "Name" : "Nom"} *
          </label>
          <input
            id="newspaperName"
            name="newspaperName"
            type="text"
            placeholder={
              language && language === "english"
                ? "Newspaper's name"
                : "Nom du journal"
            }
            value={formik.values.newspaperName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="inputClass"
          />
          {formik.touched.newspaperName && formik.errors.newspaperName ? (
            <p className="formikAlert">{formik.errors.newspaperName}</p>
          ) : null}
          <label htmlFor="newspaperEmail">Email</label>
          <input
            id="newspaperEmail"
            name="newspaperEmail"
            type="email"
            placeholder={
              language && language === "english"
                ? "Newspaper's email"
                : "Email du journal"
            }
            value={formik.values.newspaperEmail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="inputClass"
          />
          {formik.touched.newspaperEmail && formik.errors.newspaperEmail ? (
            <p className="formikAlert">{formik.errors.newspaperEmail}</p>
          ) : null}
          <label htmlFor="newspaperPhone">
            {language && language === "english" ? "Phone number" : "Téléphone"}
          </label>
          <input
            id="newspaperPhone"
            name="newspaperPhone"
            type="text"
            placeholder={
              language && language === "english"
                ? "Newspaper's phone number"
                : "Numéro de téléphone"
            }
            value={formik.values.newspaperPhone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="inputClass"
          />
          {formik.touched.newspaperPhone && formik.errors.newspaperPhone ? (
            <p className="formikAlert">{formik.errors.newspaperPhone}</p>
          ) : null}
          <label htmlFor="newspaperDescription">
            {language && language === "english"
              ? "Additional Information"
              : "Informations supplémentaires"}
          </label>
          <textarea
            id="newspaperDescription"
            name="newspaperDescription"
            placeholder="Description"
            value={formik.values.newspaperDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="inputClass"
          />
          {formik.touched.newspaperDescription &&
          formik.errors.newspaperDescription ? (
            <p className="formikAlert">{formik.errors.newspaperDescription}</p>
          ) : null}

          <FormButton
            updateMode={updateMode}
            cancelUpdate={cancelUpdate}
          ></FormButton>

          {/* <p>{message}</p> */}
        </FormFieldset>
      </form>
    </FormMask>
  );
}
