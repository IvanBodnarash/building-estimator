import { useState, useEffect } from "react";
import { db } from "../db/db";

export default function useEstimates({ t }) {
  const [estimates, setEstimates] = useState([]);

  const loadEstimates = async () => {
    try {
      const storedEstimates = await db.estimates.toArray();
      setEstimates(storedEstimates);
    } catch (error) {
      console.error("Error loading estimates:", error);
    }
  };

  const addEstimate = async (newEstimate) => {
    try {
      const id = await db.estimates.add(newEstimate);
      await loadEstimates();
      return id;
    } catch (error) {
      console.error("Error adding estimate:", error);
    }
  };

  const deleteEstimate = async (estimateId) => {
    try {
      if (confirm(t("deleteEstimateConfirmation"))) {
        await db.estimates.delete(estimateId);
        if (db.estimateWorks) {
          await db.estimateWorks
            .where("estimateId")
            .equals(estimateId)
            .delete();
        }
        setEstimates((prevEstimates) =>
          prevEstimates.filter((estimate) => estimate.id !== estimateId)
        );
      }
    } catch (error) {
      console.error("Error deleting estimate:", error);
    }
  };

  useEffect(() => {
    loadEstimates();
  }, []);

  return { estimates, loadEstimates, addEstimate, deleteEstimate };
}
