import { useEffect, useState } from "react";
import { db } from "../db/db";
import { evaluate } from "mathjs";

import AddWorkForm from "./AddWork";

export default function Estimate() {
  const [works, setWorks] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [editingWork, setEditingWork] = useState(null);

  const loadWorks = async () => {
    const savedWorks = await db.works.toArray();
    setWorks(savedWorks);
  };

  useEffect(() => {
    loadWorks();
  }, []);

  const addRow = () => {
    setTableRows([
      ...tableRows,
      {
        id: tableRows.length + 1,
        work: null,
        formula: "",
        unit: "",
        quantity: "",
        priceForUnit: 0,
        result: 0,
      },
    ]);

    console.log(tableRows);
  };

  const handleWorkSelect = (rowId, workId) => {
    const selectedWork = works.find((w) => w.id === Number(workId));

    setTableRows(
      tableRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              workId: selectedWork.id,
              workName: selectedWork.name,
              formula: selectedWork.formula,
              unit: selectedWork.unit,
              priceForUnit: selectedWork.priceForUnit || 0,
              result: calculateFormula(selectedWork.formula, {
                a: 1,
                U: selectedWork.priceForUnit,
              }),
            }
          : row
      )
    );
  };

  const handleInputChange = (rowId, field, value) => {
    setTableRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [field]: value === "" ? "" : Number(value),
              result: calculateFormula(row.formula, {
                a:
                  field === "quantity" ? Number(value) || 0 : row.quantity || 0,
                U:
                  field === "priceForUnit"
                    ? Number(value) || 0
                    : row.priceForUnit || 0,
              }),
            }
          : row
      )
    );
  };

  const calculateFormula = (formula, variables) => {
    if (!formula) return 0;
    try {
      return evaluate(formula, variables);
    } catch (error) {
      return "Помилка";
    }
  };

  const removeRow = (rowId) => {
    setTableRows(tableRows.filter((row) => row.id !== rowId));
  };

  const handleEdit = (workId) => {
    const workToEdit = works.find((w) => w.id === workId);
    setEditingWork(workToEdit);
  };

  const handleDelete = async (workId) => {
    await db.works.delete(workId);
    setWorks((prevWorks) => prevWorks.filter((w) => w.id !== workId));
    setTableRows((prevRows) =>
      prevRows.map((row) =>
        row.workId === workId
          ? {
              ...row,
              workId: "",
              workName: "",
              formula: "",
              unit: "",
              priceForUnit: "",
              result: "",
            }
          : row
      )
    );
  };

  return (
    <>
      <AddWorkForm onWorkAdded={loadWorks} editingWork={editingWork} setEditingWork={setEditingWork} />
      <div className="p-4 border rounded-lg shadow-lg bg-white mt-6">
        <h2 className="text-xl font-bold mb-4">Розрахунок роботи</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Formula</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Price for Unit</th>
              <th className="border p-2">Result</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row) => (
              <tr key={row.id} className="border">
                <td className="border p-2">{row.id === 0 ? "1" : row.id}</td>
                <td className="border p-2">
                  <select
                    className="border p-2 w-full"
                    onChange={(e) => handleWorkSelect(row.id, e.target.value)}
                    value={row.workId || ""}
                  >
                    <option value="">Choose a work</option>
                    {works.map((work) => (
                      <option key={work.id} value={work.id}>
                        {work.name}
                      </option>
                    ))}
                  </select>

                  {row.workId && (
                    <div className="flex mt-2 space-x-2">
                      <button
                        className=""
                        onClick={() => handleEdit(row.workId)}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(row.workId)}>
                        Delete
                      </button>
                    </div>
                  )}
                </td>
                <td className="border p-2">{row.formula}</td>
                <td className="border p-2">{row.unit}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    className="border p-2 w-full"
                    value={row.quantity === "" ? "" : row.quantity}
                    onChange={(e) =>
                      handleInputChange(row.id, "quantity", e.target.value)
                    }
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    className="border p-2 w-full"
                    value={row.priceForUnit === "" ? "" : row.priceForUnit}
                    onChange={(e) =>
                      handleInputChange(row.id, "priceForUnit", e.target.value)
                    }
                  />
                </td>
                <td className="border p-2">{row.result}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => removeRow(row.id)}
                    className="text-black hover:text-red-800 cursor-pointer"
                  >
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addRow}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer"
        >
          Add Row
        </button>
      </div>
    </>
  );
}
