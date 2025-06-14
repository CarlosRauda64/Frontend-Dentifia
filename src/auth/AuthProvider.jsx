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

  // Establece el token de acceso en el estado
  function getAccessToken() {
    return accessToken;
  }

  function getRefreshToken() {
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    }
    return null;
  }

  // Guarda el token en el estado y en el almacenamiento local
  function saveToken(token, user) {
    setAccessToken(token.access);
    setUser(user)
    localStorage.setItem('token', token.refresh);
    setIsAuthenticated(true);
  }

  async function requestNewAccessToken(refreshToken) {
    try {
      const response = await fetch(`${API_URL}/usuarios/token/refresh`, {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json',
          "Authorization": `Bearer ${refreshToken}`
        },body: JSON.stringify({
          refresh: refreshToken
        })
      })
      if (response.ok) {
        const data = await response.json()
        if (data) {
          return data.access;
        } else {
          throw new Error("No se pudo obtener un nuevo token de acceso");
        }
      } else {
        console.error("Error al solicitar un nuevo token de acceso:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error al solicitar un nuevo token de acceso:", error);
      return null;
    }
  }

  // Obtiene el usuario del estado
  async function getUserInfo(accessToken) {
    try {
      const response = await fetch(`${API_URL}/usuarios/profile`, {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json',
          "Authorization": `Bearer ${accessToken}`
        },
      })
      if (response.ok) {
        const data = await response.json()
        if (data) {
          return data;
        } else {
          throw new Error("No se pudo obtener un nuevo token de acceso");
        }
      } else {
        console.error("Error al solicitar un nuevo token de acceso:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error al solicitar un nuevo token de acceso:", error);
      return null;
    }
  }


  // ----------------------------------------------------------------------------


  // Guarda el token de acceso en el estado y en el almacenamiento local
  // y establece el estado de autenticación

  function getUser() {
    return user;
  }

  function signout() {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setAccessToken('');
    setUser('');
  }

  // Verifica si el usuario está autenticado al cargar el componente
  async function checkAuth() {
    if (!accessToken) {
      const token = getRefreshToken();
      if (token) {
        const newAccessToken = await requestNewAccessToken(token);
        if (newAccessToken) {
          const userData = await getUserInfo(newAccessToken);
          if (userData) {
            console.log("Usuario autenticado:", userData);
            saveSessionInfo(userData, newAccessToken, token);
            setIsAuthenticated(true);
            setLoading(false);
          }
        }else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }else {
        // Usuario no identificado
        setIsAuthenticated(false);
        setLoading(false);
      }
    }
  }

  function saveSessionInfo(userInfo, accessToken, refreshToken) {
    setAccessToken(accessToken);
    localStorage.setItem('token', refreshToken);
    setUser(userInfo);
    setIsAuthenticated(true);
  }

  useEffect(() => {
    // Verifica si el usuario está autenticado al cargar el componente
    checkAuth();
  }, []);


  return (
    <AuthContext.Provider value={
      {
        isAuthenticated,
        getAccessToken,
        getRefreshToken,
        getUserInfo,
        saveToken,
        getUser,
        signout
      }}>
      {loading ? <Loading />: children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;