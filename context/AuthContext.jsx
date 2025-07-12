import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Crear el contexto con valores iniciales
const AuthContext = createContext({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

// Constante para la clave de almacenamiento
const STORAGE_KEY = '@user';

export const AuthProvider = ({ children }) => {
  // Estado unificado para user y isLoading
  const [authState, setAuthState] = useState({
    user: null,
    isLoading: true,
  });

  // Cargar usuario al iniciar
  const loadUser = useCallback(async () => {
    try {
      const savedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        setAuthState(prev => ({ ...prev, user: { email: savedUser } }));
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Función para login
  const login = useCallback(async (email, password) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      await AsyncStorage.setItem(STORAGE_KEY, email);
      setAuthState({ user: { email }, isLoading: false });
    } catch (error) {
      console.error('Error en login:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  // Función para logout
  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setAuthState({ user: null, isLoading: false });
    } catch (error) {
      console.error('Error en logout:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  // Valor del contexto
  const contextValue = {
    user: authState.user,
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