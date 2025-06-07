import {useContext, createContext, useState, useEffect} from 'react';
import React from 'react'

const AuthContext = createContext({
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
});

const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <AuthContext.Provider value={{isAuthenticated,}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
export const useAuth = () => useContext(AuthContext);