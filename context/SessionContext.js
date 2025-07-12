import React, { createContext, useState, useContext } from 'react';

const SessionContext = createContext({
  session: null,
  setSession: () => {},
});

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};