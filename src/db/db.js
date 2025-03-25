import Dexie from "dexie";

export const db = new Dexie("BuildingCostDB");

db.version(2).stores({
  works: "++id, name, category, formula, unit, priceForUnit, translations, variables",
  units: "++id, name",
  estimates: "++id, dateCreated, name",
  categories: "++id, estimateId, categoryName",
  estimateWorks: "++id, estimateId, workId, quantity, priceForUnit, result",
});
