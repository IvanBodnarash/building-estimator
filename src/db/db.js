import Dexie from "dexie";

export const db = new Dexie("BuildingCostDB");

db.version(1).stores({
    works: "++id, name, formula, unit, priceForUnit, variables",
    units: "++id, name",
    estimates: "++id, dateCreated, name",
    estimateWorks: "++id, estimateId, workId, quantity, priceForUnit, result",
});