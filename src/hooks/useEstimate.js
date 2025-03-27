import { useState, useEffect } from "react";
import { db } from "../db/db";

export default function useEstimate(estimateId) {
  const [estimate, setEstimate] = useState(null);
  const [tableRows, setTableRows] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const loadEstimate = async () => {
    const storedEstimate = await db.estimates.get(Number(estimateId));
    if (!storedEstimate) {
      alert(t("estimateNotFound"));
      return;
    }
    setEstimate(storedEstimate);
    setTableRows(storedEstimate.works || []);
    setSelectedCategories(storedEstimate.categories || []);
  };

  useEffect(() => {
    loadEstimate();
  }, [estimateId]);

  return {
    estimate,
    setEstimate,
    tableRows,
    setTableRows,
    selectedCategories,
    setSelectedCategories,
    loadEstimate,
  };
}
