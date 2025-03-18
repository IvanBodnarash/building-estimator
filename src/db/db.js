import Dexie from "dexie";

export const db = new Dexie("BuildingCostDB");

db.version(2).stores({
  works:
    "++id, name, category, formula, unit, priceForUnit, translations, variables",
  units: "++id, name",
  estimates: "++id, dateCreated, name",
  estimateWorks: "++id, estimateId, workId, quantity, priceForUnit, result",
  categories: "++id, estimateId, categoryName, translations",
});

async function initializeDB() {
  const existingWorks = await db.works.count();

  if (existingWorks === 0) {
    await db.works.bulkAdd(standardWorksDB);
  }
}

initializeDB();
