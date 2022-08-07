import { createContext, useState, useEffect } from "react";
import { basicAccess } from "../../src/Utilities/Access";

const Context = createContext();
export default Context;

export const ContextProvider = ({ children }) => {
  // Récupérer le token stocké
  let initToken = localStorage.getItem("token");

  const [token, setToken] = useState(null);

  useEffect(() => {
    const tokenVerif = async () => {
      // Vérifier que le token récupéré est valide
      const accessOk = await basicAccess(initToken);
      // Si oui, on le met en context
      if (accessOk) setToken(initToken);
    };
    tokenVerif();
  }, [initToken]);
  return (
    <Context.Provider value={{ token, setToken }}>{children}</Context.Provider>
  );
};
