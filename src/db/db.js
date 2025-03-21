import Dexie from "dexie";
// import { categories } from "./categoriesDB";

export const db = new Dexie("BuildingCostDB");

db.version(2).stores({
  works: "++id, name, category, formula, unit, priceForUnit, translations, variables",
  units: "++id, name",
  estimates: "++id, dateCreated, name",
  categories: "++id, estimateId, categoryName",
  estimateWorks: "++id, estimateId, workId, quantity, priceForUnit, result",
});

// async function initializeDB() {
//   const existingWorks = await db.works.count();

//   if (existingEstimates === 0) {
//     console.log("✅ Database initialized, no existing estimates found.");
//   }
// }

// initializeDB();
