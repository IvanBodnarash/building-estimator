import { useEffect, useState } from "react";
import { db } from "../db/db";

import classes from "./AddWork.module.css";

export default function AddWorkForm({
  onWorkAdded,
  editingWork,
  setEditingWork,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [workName, setWorkName] = useState("");
  const [formula, setFormula] = useState("a * b");
  const [unit, setUnit] = useState("m2");
  const [works, setWorks] = useState([]);
  const [priceForUnit, setPriceForUnit] = useState();
  const [variables, setVariables] = useState([]);

  useEffect(() => {
    if (unit === "m2" || unit === "hr" || unit === "m3") {
      setFormula("a * U");
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

  const toggleComponentOpening = () => {
    setIsOpen((prev) => !prev);
  };

  const exactVariables = (formula) => {
    const matches = formula.match(/[a-zA-Z]+/g) || [];
    return [...new Set(matches)];
  };

  const handleFormulaChange = (e) => {
    const newFormula = e.target.value;
    setFormula(newFormula);
    setVariables(exactVariables(newFormula));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!workName.trim() || !formula.trim()) return;

    if (editingWork) {
      await db.works.update(editingWork.id, {
        name: workName,
        formula,
        unit,
        priceForUnit,
        variables,
      });
    } else {
      const newWork = {
        name: workName,
        formula,
        unit,
        priceForUnit,
        variables,
      };
      const id = await db.works.add(newWork);
      setWorks((prevWorks) => [...prevWorks, { ...newWork, id }]);
    }

    setWorkName("");
    setFormula("a * U");
    setUnit("m2");
    setPriceForUnit("");
    setVariables([]);
    setEditingWork(null);

    if (onWorkAdded) {
      onWorkAdded();
    }
  };

  return (
    <>
      <button
        className="bg-cyan-900 p-4 text-white cursor-pointer w-42 rounded-md"
        onClick={toggleComponentOpening}
      >
        {isOpen ? "Collapse" : "Add New Work"}
      </button>
      {isOpen && (
        <div
          className={`p-4 border rounded-lg shadow-lg bg-white mt-4 ${
            isOpen ? classes.open : classes.close
          }`}
        >
          <h2 className="text-xl font-bold mb-4">Add New Work</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-row justify-between gap-4">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="workName">Work Name</label>
                <input
                  type="text"
                  id="workName"
                  placeholder="Work Name"
                  className="border p-2 w-full"
                  value={workName}
                  onChange={(e) => setWorkName(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="unit">Unit</label>
                <select
                  className="border h-10 cursor-pointer"
                  name="unit"
                  id=""
                  onChange={(e) => setUnit(e.target.value)}
                  required
                >
                  <option value="m2">m2</option>
                  <option value="m3">m3</option>
                  <option value="hr">hr</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="formula">Formula</label>
                <input
                  type="text"
                  id="formula"
                  placeholder="Formula (e.g: a * U)"
                  className="border p-2 w-full"
                  value={formula}
                  onChange={handleFormulaChange}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="priceForUnit">Price For Unit (U)</label>
                <input
                  type="text"
                  id="priceForUnit"
                  placeholder="Price For Unit"
                  className="border p-2 w-full"
                  value={priceForUnit}
                  onChange={(e) => setPriceForUnit(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {variables.length > 0 && (
              <div className="mt-2 p-2 bg-gray-100 rounded">
                <h3 className="font-bold">Знайдені змінні:</h3>
                <p>{variables.join(", ")}</p>
              </div>
            )}

            <button
              type="submit"
              className="bg-cyan-900 text-white p-2 rounded w-full cursor-pointer hover:bg-cyan-700 hover:shadow-2xl transition-all"
            >
              Add Work
            </button>
          </form>
        </div>
      )}
    </>
  );
}
