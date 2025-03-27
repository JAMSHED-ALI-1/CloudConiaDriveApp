import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData } from '../../helper/functionHelper';
 // Update the path as needed

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user data from AsyncStorage when the app starts
  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getData();
      if (userData) {
        setUser(userData);
      }
    };
    loadUserData();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
