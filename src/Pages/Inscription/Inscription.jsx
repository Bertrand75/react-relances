import React, { useContext } from "react";
import LanguageContext from "../../Context/LanguageContext";
import FormUser from "../../Components/FormUser/FormUser";

export default function Inscription() {
  // Récupération de la langue
  const { language } = useContext(LanguageContext);
  document.title =
    language && language === "english" ? "Sign Up" : "Inscription";

  return (
    <>
      <h1>
        {language && language === "english" ? "Sign Up" : "Inscrivez-vous"}
      </h1>
      <FormUser />
    </>
  );
}
