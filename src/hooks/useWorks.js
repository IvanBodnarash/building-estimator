import { useState, useEffect } from "react";
import { db } from "../db/db";
import standardWorksDB from "../db/standardWorksDB";

export default function useWorks() {
  const [works, setWorks] = useState([]);

  const loadWorks = async () => {
    let savedWorks = await db.works.toArray();
    if (savedWorks.length === 0) {
      await db.works.bulkAdd(standardWorksDB);
      savedWorks = await db.works.toArray();
      console.log("✅ Standard works added!");
    }
    setWorks(savedWorks);
    console.log(works);
  };

  useEffect(() => {
    loadWorks();
  }, []);

  return {
    works,
    setWorks,
    loadWorks,
  };
}
