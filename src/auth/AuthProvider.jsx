import { useState, useEffect } from 'react';
import React from 'react'
import { API_URL } from '../api/api';
import AuthContext from './AuthContext';
import Loading from '../pages/Common/Loading.jsx';

//Proveedor de autenticación que maneja el estado de autenticación del usuario
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);

  async function getUserInfo(token) {
    try {
      const response = await fetch(`${API_URL}/usuarios/profile`, {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json',
          "Authorization": `Token ${token}`
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
    }
    return null;
  }

  // Establece el token de acceso en el estado
  function getAccessToken() {
    return accessToken;
  }

  // Obtiene el token de acceso del almacenamiento local
  function getRefreshToken() {
    const token = localStorage.getItem('token');
    if (token) {
      //const refreshToken = JSON.parse(token);
      return token;
    }
    return null;
  }

  // Guarda el usuario en el estado y en el almacenamiento local
  function saveUser(userData) {
    setUser(userData);
  }

  // Guarda el token de acceso en el estado y en el almacenamiento local
  // y establece el estado de autenticación
  function saveTokenUser(userData) {
    const user = JSON.parse(userData);
    setAccessToken(user.token);
    localStorage.setItem('token', user.token);
    setIsAuthenticated(true);
    setUser(user.usuario);
  }

  // Obtiene el usuario del estado
  function getUser() {
    return user;
  }

  function signout(){
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setAccessToken('');
    setUser('');
  }

  // Verifica si el usuario está autenticado al cargar el componente
  async function checkAuth() {
    const token = getRefreshToken();
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
      const userInfo = await getUserInfo(token);
      if (userInfo) {
        saveUser(userInfo);
      }
      console.log("Token de acceso encontrado, el usuario está autenticado.");
    } else {
      // No esta logueado
      setIsAuthenticated(false);
      console.log("No hay token de acceso, el usuario no está autenticado.");
    }
    setLoading(false);
  }

  useEffect(() => {
    // Verifica si el usuario está autenticado al cargar el componente
    checkAuth();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={
      { 
        isAuthenticated,
         getAccessToken, 
         saveTokenUser, 
         getRefreshToken, 
         saveUser,
         getUser,
         signout}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;