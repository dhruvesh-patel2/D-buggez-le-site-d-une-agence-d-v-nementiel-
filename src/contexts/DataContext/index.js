import PropTypes from "prop-types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const response = await fetch("/events.json");
    return response.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      setData(await api.loadData());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (data) return;
    getData();
  }, [data, getData]);
  
  const last = useMemo(() => 
    Array.isArray(data?.events) && data.events.length > 0
      ? [...data.events].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      : null
  , [data]);

  const contextValue = useMemo(() => ({
    data,
    error,
    loading,
    last,
  }), [data, error, loading, last]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;