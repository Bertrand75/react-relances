import React, { useState, useContext } from "react";
import axios from "axios";
import Context from "../../Context/Context";
import UserContext from "../../Context/UserContext";
import LanguageContext from "../../Context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormFieldset from "../FormFieldset/FormFieldset";

// FORMULAIRE D'INSRIPTION
export default function FormUser() {
  // Récupération du token
  const { token, setToken } = useContext(Context);
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  // Récupération de l'utilisateur loggé
  const { user, setUser } = useContext(UserContext);
  // Pour la redirection
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      userName: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string()
        .min(
          2,
          language && language === "english"
            ? "At least 2 characters please"
            : "Le prénom doit posséder 2 caractères au minimum"
        )
        .max(
          20,
          language && language === "english"
            ? "Maximum of 20 characters please"
            : "Le prénom ne doit pas dépasser 20 caractères"
        )
        .required(
          language && language === "english"
            ? "User name is required"
            : "Le pseudo est obligatoire"
        ),
      firstname: Yup.string()
        .min(
          2,
          language && language === "english"
            ? "At least 2 characters please"
            : "Le prénom doit posséder 2 caractères au minimum"
        )
        .max(
          20,
          language && language === "english"
            ? "Maximum of 20 characters please"
            : "Le prénom ne doit pas dépasser 20 caractères"
        ),
      lastname: Yup.string()
        .min(
          2,
          language && language === "english"
            ? "At least 2 characters please"
            : "Le nom doit posséder 2 caractères au minimum"
        )
        .max(
          20,
          language && language === "english"
            ? "Maximum of 20 characters please"
            : "Le nom ne doit pas dépasser 20 caractères"
        ),
      email: Yup.string()
        .email(
          language && language === "english"
            ? "Invalid email"
            : "Adresse email invalide"
        )
        .required(
          language && language === "english"
            ? "Email is required"
            : "L'email est obligatoire"
        ),
      password: Yup.string()
        .required(
          language && language === "english"
            ? "Password is required"
            : "Mot de passe obligatoire"
        )
        .min(
          8,
          language && language === "english"
            ? "At least 8 characters please"
            : "Le mot de passe doit contenir au moins 8 caractères"
        )
        .max(
          30,
          language && language === "english"
            ? "Maximum of 30 characters please"
            : "Le mot de passe ne doit pas contenir plus de 30 caractères"
        ),
      passwordCheck: Yup.string().oneOf(
        [Yup.ref("password")],
        language && language === "english"
          ? "Both passwords must be identical"
          : "Les deux mots de passe doivent être identiques"
      ),
    }),
    onSubmit: (values) => {
      let body = {
        pseudo: values.userName,
        email: values.email,
        password: values.password,
      };
      if (values.firstname) body.nom = values.lastname;
      if (values.firstname) body.prenom = values.firstname;
      axios
        .post(process.env.REACT_APP_API_LINK_USER + "signup", body)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          setToken(response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setUser(response.data.user);
        })
        .catch((error) => {
          console.log(error);
        });
      navigate("/");
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flexV">
      <FormFieldset
        title={
          language && language === "english"
            ? "Sign up form"
            : "Formulaire d'inscription"
        }
      >
        <label htmlFor="nickname">
          {language && language === "english" ? "User name" : "Pseudo"} * :{" "}
        </label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          placeholder={
            language && language === "english"
              ? "Your user name"
              : "Votre pseudo"
          }
          value={formik.values.userName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="inputClass"
        />
        <label htmlFor="lastname">
          {language && language === "english" ? "Last Name" : "Nom"} :{" "}
        </label>
        <input
          id="lastname"
          name="lastname"
          type="text"
          placeholder={
            language && language === "english" ? "Your last name" : "Votre nom"
          }
          value={formik.values.lastname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="inputClass"
        />
        {formik.touched.lastname && formik.errors.lastname ? (
          <p className="formikAlert">{formik.errors.lastname}</p>
        ) : null}
        <label htmlFor="firstname">
          {language && language === "english" ? "First Name" : "Prénom"} :{" "}
        </label>
        <input
          id="firstname"
          name="firstname"
          type="text"
          placeholder={
            language && language === "english"
              ? "Your first name"
              : "Votre prénom"
          }
          value={formik.values.firstname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="inputClass"
        />
        {formik.touched.firstname && formik.errors.firstname ? (
          <p className="formikAlert">{formik.errors.firstname}</p>
        ) : null}
        <label htmlFor="email">Email * : </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder={
            language && language === "english" ? "Your email" : "Votre email"
          }
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="inputClass"
        />
        {formik.touched.email && formik.errors.email ? (
          <p className="formikAlert">{formik.errors.email}</p>
        ) : null}
        <label htmlFor="password">
          {language && language === "english" ? "Password" : "Mot de passe"} * :{" "}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder={
            language && language === "english"
              ? "Your password"
              : "Votre mot de passe"
          }
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="inputClass"
        />
        {formik.touched.password && formik.errors.password ? (
          <p className="formikAlert">{formik.errors.password}</p>
        ) : null}
        <label htmlFor="passwordCheck">
          {language && language === "english"
            ? "Password confirmation"
            : "Confirmation du mot de passe"}{" "}
          * :{" "}
        </label>
        <input
          id="passwordCheck"
          name="passwordCheck"
          type="password"
          placeholder={
            language && language === "english"
              ? "Password confirmation"
              : "Confirmez votre mot de passe"
          }
          value={formik.values.passwordCheck}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="inputClass"
        />
        {formik.touched.passwordCheck && formik.errors.passwordCheck ? (
          <p className="formikAlert">{formik.errors.passwordCheck}</p>
        ) : null}
        <input
          type="submit"
          value={language && language === "english" ? "Sign up" : "Inscription"}
          className="loginSubmit"
        />
      </FormFieldset>
    </form>
  );
}
