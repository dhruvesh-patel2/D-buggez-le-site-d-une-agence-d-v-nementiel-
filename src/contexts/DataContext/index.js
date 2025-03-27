import { createContext, useContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/events.json");
        if (!response.ok) throw new Error("Erreur de chargement des données");
        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (fetchError) {
        setError(fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const last = useMemo(() => 
    Array.isArray(data?.events) && data.events.length > 0
      ? [...data.events].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      : null
  , [data]);
  

  const contextValue = useMemo(() => ({ data, error, loading, last }), [data, error, loading, last]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
