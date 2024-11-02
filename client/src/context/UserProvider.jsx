import { UserContext } from "./UserContext";
import { useState } from "react";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");

  // Function to update the user information
  const loginUser = (id, email, username) => {
    const newUser = { id, email, username };
    setUser(newUser);
  };

  const logoutUser = () => {
    setUser({ id: null, email: null, username: null });
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
