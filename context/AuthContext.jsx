import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Crear el contexto con valores iniciales
const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

// Constantes para las claves de almacenamiento
const USER_STORAGE_KEY = '@user';
const TOKEN_STORAGE_KEY = '@token';

// URL base de la API
const API_BASE_URL = 'https://comunajoven.com.ve/api';

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    isLoading: true,
  });

  // Cargar datos de autenticación al iniciar
  const loadAuthData = useCallback(async () => {

    


    try {
      const [savedUser, savedToken] = await Promise.all([
        AsyncStorage.getItem(USER_STORAGE_KEY),
        AsyncStorage.getItem(TOKEN_STORAGE_KEY),
      ]);

      if (savedUser && savedToken) {
        setAuthState({
          user: JSON.parse(savedUser),
          token: savedToken,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error al cargar datos de autenticación:', error);
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    loadAuthData();
  }, [loadAuthData]);

  // Función para login
const login = useCallback(async (email, password) => {
  setAuthState(prev => ({ ...prev, isLoading: true }));

  try {

     



    const response = await fetch(
      `${API_BASE_URL}/loguin?correo=${encodeURIComponent(email)}&contraseña=${encodeURIComponent(password)}`,
      {
        headers: {
          'Authorization': 'Bearer 5c0d5fe9-b3ae-4e09-b754-f7bf8f9023ac',
          'Accept': 'application/json',
        }
      }
    );

    // 1. Obtener respuesta como texto
    const responseText = await response.text();
    
    // 2. Eliminar BOM si existe (carácter ﻿ al inicio)
    const sanitizedResponse = responseText.replace(/^\uFEFF/, '');
    
    // 3. Parsear a JSON
    const responseData = JSON.parse(sanitizedResponse);

    if (!response.ok || !responseData.success) {
      throw new Error(responseData.message || 'Error en la autenticación');
    }

    // Guardar datos del usuario
    const userData = {
      id: responseData.data.id_usuario,
      email: responseData.data.email,
      cedula: responseData.data.cedula,
      rol: responseData.data.id_rol,
      token: responseData.data.token,
      success: responseData.data.success
    };



    await AsyncStorage.multiSet([
      [USER_STORAGE_KEY, JSON.stringify(userData)],
      [TOKEN_STORAGE_KEY, responseData.data.token],
    ]);

    setAuthState({
      user: userData,
      token: responseData.data.token,
      isLoading: false,
    });

    return { success: true, user: userData };

  } catch (error) {
    // console.error('Error en login:', error);
    setAuthState(prev => ({ ...prev, isLoading: false }));
    throw error;
  }
}, []);

  // Función para logout
  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      await Promise.all([
        AsyncStorage.removeItem(USER_STORAGE_KEY),
        AsyncStorage.removeItem(TOKEN_STORAGE_KEY),
      ]);
      setAuthState({ user: null, token: null, isLoading: false });
    } catch (error) {
      // console.error('Error en logout:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  // Valor del contexto
  const contextValue = {
    user: authState.user,
    token: authState.token,
    isLoading: authState.isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};