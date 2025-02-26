import Dexie from "dexie";

export const db = new Dexie("BuildingCostDB");

db.version(1).stores({
    works: "++id, name, formula, unit, priceForUnit",
    units: "++id, name",
});