import React, { createContext, useContext, useEffect, useState } from 'react';
import { initDatabase } from '../services/DatabaseService';

type DatabaseStatusType = {
  isDataLoading: boolean;
  isConfigured: boolean;
  error: string | null;
};

const DatabaseState = createContext<DatabaseStatusType>({
  isDataLoading: true,
  isConfigured: false,
  error: null,
});

export const useDatabaseState = () => useContext(DatabaseState);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDataLoading, setisDataLoading] = useState(true);
  const [isConfigured, setisConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();
        setisConfigured(true);
        setError(null);
      } catch (err) {
        setError('Database initialization failed. Try refreshing the page or opening the link in a new tab.');
      } finally {
        setisDataLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <DatabaseState.Provider value={{ isDataLoading, isConfigured, error }}>
      {children}
    </DatabaseState.Provider>
  );
};
