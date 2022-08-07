import React, { createContext, useState } from "react";

const LanguageContext = createContext();
export default LanguageContext;

export const LanguageContextProvider = ({ children }) => {
  let initLanguage = localStorage.getItem("language");

  const [language, setLanguage] = useState(initLanguage);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
