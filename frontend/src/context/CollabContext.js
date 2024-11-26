import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CollabContext = createContext();

export function CollabProvider({ children }) {
  const [collabs, setCollabs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch collabs from MongoDB
  useEffect(() => {
    fetchCollabs();
  }, []);

  const fetchCollabs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/collabs");
      if (response.data.success) {
        setCollabs(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching collabs:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCollab = async (newCollab) => {
    setCollabs((prevCollabs) => [newCollab, ...prevCollabs]);
  };

  const deleteCollab = async (collabId) => {
    try {
      await axios.delete(`http://localhost:5000/api/collabs/${collabId}`);
      setCollabs((prevCollabs) =>
        prevCollabs.filter((collab) => collab._id !== collabId)
      );
    } catch (error) {
      console.error("Error deleting collab:", error);
    }
  };

  return (
    <CollabContext.Provider
      value={{
        collabs,
        addCollab,
        deleteCollab,
        loading,
        refreshCollabs: fetchCollabs,
      }}
    >
      {children}
    </CollabContext.Provider>
  );
}

export function useCollabs() {
  return useContext(CollabContext);
}
