import { useEffect, useState } from "react";
import { db } from "../db/db";
import { evaluate } from "mathjs";

import AddWorkForm from "./AddWork";
import { useParams } from "react-router-dom";
import generatePDF from "../utils/generatePDF";

import { IoMdAdd } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin2Fill } from "react-icons/ri";
import formatDate from "../utils/formatDate";

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
      console.log("Current estimateId:", estimateId);
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
      return "Error";
    }
  };

  const removeRow = (rowId) => {
    setTableRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
  };

  const handleEdit = (row) => {
    setEditingRow(row);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingRow || !editingRow.workId) {
      console.error("Invalid editingRow or workId:", editingRow);
      return;
    }

    const selectedWork = works.find((w) => w.id === editingRow.workId);

    if (!selectedWork) {
      console.error("Work not found:", editingRow.workId);
      return;
    }

    await db.works.update(editingRow.workId, {
      name: editingRow.workName,
      formula: editingRow.formula,
      unit: editingRow.unit,
      priceForUnit: editingRow.priceForUnit,
    });

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
                a: row.quantity || 1,
                U: selectedWork.priceForUnit,
              }),
            }
          : row
      )
    );

    setIsEditModalOpen(false);
  };

  const handleDelete = async (workId) => {
    if (confirm("Are you sure you want to delete this work?")) {
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
      await db.works.delete(workId);
    } else {
      return;
    }
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
    <div className="mx-38 border-x border-gray-700 px-4 py-8 overflow-hidden relative bg-gray-950/[2.5%] after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-gray-950/5 bg-[radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-300)]">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{estimate.name}</h1>
        <p className="text-cyan-500">
          Created: {formatDate(new Date(estimate.dateCreated))}
        </p>
        <AddWorkForm
          onWorkAdded={loadWorks}
          editingWork={editingWork}
          setEditingWork={setEditingWork}
        />
      </div>

      {/* <h2 className="text-2xl">Estimate Calculator</h2> */}

      <div className="p-4 border bg-white mt-6">
        <h2 className="text-xl font-bold mb-4">Estimate Calculator</h2>

        <table className="w-full">
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
                <td className="border p-2 text-center">
                  {row.id === 0 ? "1" : row.id}
                </td>
                <td className="p-2 flex gap-2 flex-wrap justify-between items-center">
                  <select
                    className="border rounded p-2 flex items-center justify-center"
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
                    <div className="flex space-x-4">
                      <button
                        className="cursor-pointer text-2xl"
                        onClick={() => handleEdit(row)}
                        title="Edit"
                      >
                        <MdModeEdit />
                      </button>
                      <button
                        className="cursor-pointer text-2xl"
                        onClick={() => handleDelete(row.workId)}
                        title="Delete"
                      >
                        <RiDeleteBin2Fill />
                      </button>
                    </div>
                  )}
                </td>
                <td className="border p-2 text-center">{row.formula}</td>
                <td className="border p-2 text-center">{row.unit}</td>
                <td className="border">
                  <input
                    type="number"
                    className="p-2 w-24 outline-none"
                    value={row.quantity === "" ? "" : row.quantity}
                    onChange={(e) =>
                      handleInputChange(row.id, "quantity", e.target.value)
                    }
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    className="p-2 w-32 outline-none"
                    value={row.priceForUnit === "" ? "" : row.priceForUnit}
                    onChange={(e) =>
                      handleInputChange(row.id, "priceForUnit", e.target.value)
                    }
                  />
                </td>
                <td className="border p-2 text-center">{row.result}</td>
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

        <div className="flex items-center justify-center">
          <button
            onClick={addRow}
            className="bg-cyan-800 hover:bg-cyan-700 text-white py-2 px-24 rounded-2xl m-2 cursor-pointer"
          >
            <IoMdAdd size={18} className="" />
          </button>
        </div>

        <div className="">
          <div className="flex justify-between items-center">
            <h3>Total:</h3>
            <h3>{total.toFixed(2)} €</h3>
          </div>

          <div className="flex justify-between items-center">
            <label>Tax (%):</label>
            <input
              type="number"
              className="border p-2 w-16 outline-none"
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

          <div className="flex flex-row gap-4">
            <button
              className="bg-cyan-800 hover:bg-cyan-600 text-white py-2 px-4 rounded cursor-pointer mt-4"
              onClick={handleSaveEstimate}
            >
              Save Estimate
            </button>
            <button
              className="bg-cyan-800 hover:bg-cyan-600 text-white py-2 px-4 rounded cursor-pointer mt-4"
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
                  onClick={handleSaveEdit}
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
