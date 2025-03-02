import { useEffect, useState } from "react";
import { db } from "../db/db";
import { evaluate } from "mathjs";

import AddWorkForm from "./AddWork";
import { useParams } from "react-router-dom";
import generatePDF from "../utils/generatePDF";

export default function Estimate() {
  const [works, setWorks] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [editingWork, setEditingWork] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [total, setTotal] = useState(0);
  const [taxRate, setTaxRate] = useState(10);
  const [taxAmount, setTaxAmount] = useState(0);

  const { estimateId } = useParams();
  const [estimate, setEstimate] = useState(null);

  const loadWorks = async () => {
    const savedWorks = await db.works.toArray();
    setWorks(savedWorks);
  };

  useEffect(() => {
    loadWorks();
  }, []);

  useEffect(() => {
    async function loadEstimate() {
      const storedEstimate = await db.estimates.get(Number(estimateId));
      if (!storedEstimate) {
        alert("Estimate not found.");
        return;
      }
      setEstimate(storedEstimate);
      setTableRows(storedEstimate.works || []);
    }

    loadEstimate();
  }, [estimateId]);

  useEffect(() => {
    const newTotal = tableRows.reduce((sum, row) => sum + (row.result || 0), 0);
    setTotal(newTotal);

    const newTaxAmount = newTotal * (taxRate / 100);
    setTaxAmount(newTaxAmount);
  }, [tableRows, taxRate]);

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
    // setTableRows(tableRows.filter((row) => row.id !== rowId));
    setTableRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
  };

  const handleEdit = (row) => {
    // const workToEdit = works.find((w) => w.id === workId);
    // setEditingWork(workToEdit);
    setEditingRow(row);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingRow) return;

    await db.works.update(editingRow.workId, {
      name: editingRow.workName,
      formula: editingRow.formula,
      unit: editingRow.unit,
      priceForUnit: editingRow.priceForUnit,
    });

    // setWorks((prevWorks) =>
    //   prevWorks.map((row) =>
    //     row.workId === editingRow.workId ? { ...editingRow } : row
    //   )
    // );

    loadWorks();

    setTableRows((prevRows) =>
      prevRows.map((row) =>
        row.workId === editingRow.workId
          ? {
              ...row,
              workName: editingRow.workName,
              formula: editingRow.formula,
              unit: editingRow.unit,
              priceForUnit: editingRow.priceForUnit,
              result: calculateFormula(selectedWork.formula, {
                a: 1,
                U: selectedWork.priceForUnit,
              }),
            }
          : row
      )
    );

    setIsEditModalOpen(false);
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

  const handleSaveEstimate = async () => {
    if (!estimate || tableRows.length === 0) {
      alert("Please add at least one work to the estimate.");
      return;
    }

    const updatedEstimate = {
      ...estimate,
      works: tableRows,
    };

    await db.estimates.update(Number(estimateId), updatedEstimate);
    alert("Estimate saved successfully!");
  };

  if (!estimate) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{estimate.name}</h1>
      <p className="text-cyan-400">
        Created: {new Date(estimate.dateCreated).toLocaleString()}
      </p>

      <h2 className="text-2xl">Estimate Calculator</h2>

      <AddWorkForm
        onWorkAdded={loadWorks}
        editingWork={editingWork}
        setEditingWork={setEditingWork}
      />
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
                <td className="p-2 flex gap-2 justify-between items-center">
                  <select
                    className="border p-2 flex items-center justify-center"
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
                      <button className="" onClick={() => handleEdit(row)}>
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

        <div className="border-t">
          <div className="flex justify-between items-center">
            <h3>Total:</h3>
            <h3>{total.toFixed(2)} €</h3>
          </div>

          <div className="flex justify-between items-center">
            <label>Tax (%):</label>
            <input
              type="number"
              className="border p-2 w-full"
              value={taxRate === null ? "" : taxRate}
              onChange={(e) =>
                setTaxRate(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <h3>Tax Amount:</h3>
            <h3>{taxAmount.toFixed(2)} €</h3>
          </div>

          <div className="flex justify-between items-center mt-4 p-2 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-bold">Total (With Tax):</h3>
            <span className="text-xl text-green-600 font-bold">
              {(total + taxAmount).toFixed(2)} €
            </span>
          </div>

          <div className="flex flex-row">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer mt-4"
              onClick={handleSaveEstimate}
            >
              Save Estimate
            </button>
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded cursor-pointer mt-4"
              onClick={() =>
                generatePDF(estimate, tableRows, total, taxRate, taxAmount)
              }
            >
              Generate Document
            </button>
          </div>
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl">Edit Work</h2>
              <label htmlFor="name">Work Name</label>
              <input
                type="text"
                name="name"
                className="border p-2 w-full mb-2"
                value={editingRow?.workName || ""}
                onChange={(e) =>
                  setEditingRow((prev) => ({
                    ...prev,
                    workName: e.target.value,
                  }))
                }
              />
              <label htmlFor="formula">Formula</label>
              <input
                type="text"
                name="formula"
                className="border p-2 w-full mb-2"
                value={editingRow?.formula || ""}
                onChange={(e) =>
                  setEditingRow((prev) => ({
                    ...prev,
                    formula: e.target.value,
                  }))
                }
              />
              <label htmlFor="unit">Unit</label>
              <select
                className="border p-2 w-full cursor-pointer"
                name="unit"
                value={editingRow?.unit || ""}
                onChange={(e) =>
                  setEditingRow((prev) => ({
                    ...prev,
                    unit: e.target.value,
                  }))
                }
              >
                <option value="m2">m2</option>
                <option value="m3">m3</option>
                <option value="hr">hr</option>
                <option value="custom">Custom</option>
              </select>
              <label htmlFor="priceForUnit">Price For Unit</label>
              <input
                type="number"
                name="priceForUnit"
                className="border p-2 w-full mb-2"
                value={editingRow?.priceForUnit || ""}
                onChange={(e) =>
                  setEditingRow((prev) => ({
                    ...prev,
                    priceForUnit: Number(e.target.value),
                  }))
                }
              />
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 rounded mr-2"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded mr-2"
                  onClick={() => handleSaveEdit()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
