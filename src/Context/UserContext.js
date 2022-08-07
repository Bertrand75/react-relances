import { createContext, useState } from "react";

const UserContext = createContext();
export default UserContext;

export const UserContextProvider = ({ children }) => {
  let initUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(initUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
