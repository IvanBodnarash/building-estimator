import { useEffect, useState } from "react";
import { db } from "../db/db";

export default function AddWorkForm({ onWorkAdded }) {
  const [workName, setWorkName] = useState("");
  const [formula, setFormula] = useState("a * b");
  const [unit, setUnit] = useState("m2");
  const [works, setWorks] = useState([]);
  const [priceForUnit, setPriceForUnit] = useState();

  useEffect(() => {
    if (unit === "m2" || unit === "hr") {
      setFormula("a * U");
    } else if (unit === "m3") {
      setFormula("a * b * U");
    } else {
      setFormula("");
    }
  }, [unit]);

  useEffect(() => {
    const loadWorks = async () => {
      const savedWorks = await db.works.toArray();
      setWorks(savedWorks);
    };

    loadWorks();
    console.log(db);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!workName.trim()) return;

    const newWork = { name: workName, formula, unit, priceForUnit };
    await db.works.add(newWork);
    setWorks([...works, newWork]);
    setWorkName("");
    setFormula("a * b");
    setUnit("m2");
    setPriceForUnit();

    onWorkAdded();
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Add New Work</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <label htmlFor="workName">Work Name</label>
            <input
              type="text"
              id="workName"
              placeholder="Work Name"
              className="border p-2 w-full"
              value={workName}
              onChange={(e) => setWorkName(e.target.value)}
            />
          </div>

          <select className="border h-10 cursor-pointer" name="unit" id="" onChange={(e) => setUnit(e.target.value)}>
            <option value="m2">m2</option>
            <option value="m3">m3</option>
            <option value="hr">hr</option>
            <option value="custom">Custom</option>
          </select>

          <div className="flex flex-col">
            <label htmlFor="formula">Formula</label>
            <input
              type="text"
              id="formula"
              placeholder="Formula (e.g: a * U)"
              className="border p-2 w-full"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="priceForUnit">Price For Unit (U)</label>
            <input
              type="text"
              id="priceForUnit"
              placeholder="Price For Unit"
              className="border p-2 w-full"
              value={priceForUnit}
              onChange={(e) => setPriceForUnit(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-cyan-900 text-white p-2 rounded w-full cursor-pointer hover:bg-cyan-700 hover:shadow-2xl transition-all"
        >
          Add Work
        </button>
      </form>
    </div>
  );
}
