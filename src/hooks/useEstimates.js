import { useState, useEffect } from "react";
import { db } from "../db/db";
import { useDialog } from "../context/DialogContext";

export default function useEstimates({ t }) {
  const [estimates, setEstimates] = useState([]);
  const { showDialog } = useDialog();

  const loadEstimates = async () => {
    try {
      const storedEstimates = await db.estimates.toArray();
      setEstimates(storedEstimates);
    } catch (error) {
      console.error("Error loading estimates:", error);
      await showDialog({
        message: "Error loading estimates",
        type: "alert",
        duration: 3000,
      });
    }
  };

  const addEstimate = async (newEstimate) => {
    try {
      const id = await db.estimates.add(newEstimate);
      await loadEstimates();
      return id;
    } catch (error) {
      console.error("Error adding estimate:", error);
      await showDialog({
        message: "Error loading estimate",
        type: "alert",
        duration: 3000,
      });
    }
  };

  const deleteEstimate = async (estimateId) => {
    try {
      const confirmed = await showDialog({
        message:
          t("deleteEstimateConfirmation") ||
          "Are you sure you want to delete this estimate?",
        type: "confirm",
      });
      if (confirmed) {
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
        await showDialog({
          message:
            t("estimateDeletedSuccess") || "Estimate deleted successfully!",
          type: "alert",
          duration: 3000,
        });
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
