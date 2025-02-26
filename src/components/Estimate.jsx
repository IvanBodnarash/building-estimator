import { useEffect, useState } from "react";
import { db } from "../db/db";
import { evaluate } from "mathjs";

export default function Estimate() {
  const [works, setWorks] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    const loadWorks = async () => {
      const savedWorks = await db.works.toArray();
      setWorks(savedWorks);
    };
    loadWorks();
  }, []);

  // const handleSelectWork = (id) => {
  //   const work = works.find((w) => w.id === Number(id));
  //   setSelectedWork(work);
  //   const initialValues = work.variables.reduce((acc, variable) => {
  //     acc[variable] = 0;
  //     return acc;
  //   }, {});
  //   setValues(initialValues);

  //   console.log(work);
  // };

  const addRow = () => {
    setTableRows([
      ...tableRows,
      {
        id: tableRows.length + 1,
        work: null,
        formula: "",
        unit: "",
        quntity: 1,
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
              formula: selectedWork.formula,
              unit: selectedWork.unit,
              priceForUnit: selectedWork.priceForUnit || 0,
              result: calculateFormula(selectedWork.formula, {
                a: 1,
                b: selectedWork.priceForUnit,
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
              [field]: value,
              result: calculateFormula(row.formula, {
                a: value,
                b: row.priceForUnit,
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

  // const handleInputChange = (e, variable) => {
  //   const newValues = { ...values, [variable]: Number(e.target.value) };
  //   setValues(newValues);
  // };

  // const calculateFormula = () => {
  //   if (!selectedWork) return;

  //   try {
  //     const formula = selectedWork.formula.replace(/(\w+)/g, (match) =>
  //       values.hasOwnProperty(match) ? values[match] : match
  //     );
  //     const resultValue = new Function("return " + formula)();
  //     setResult(resultValue);
  //   } catch (error) {
  //     setResult("Помилка у формулі");
  //   }
  // };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white mt-6">
      <h2 className="text-xl font-bold mb-4">Розрахунок роботи</h2>

      <button
        onClick={addRow}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      >
        Add Row
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Formula</th>
            <th>Unit</th>
            <th>Quantity</th>
            <th>Price for Unit</th>
            <th>Result</th>
            <th>Actions</th>
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
                  value={row.work ? row.work.id : ""}
                >
                  <option value="">Choose a work</option>
                  {works.map((work) => (
                    <option key={work.id} value={work.id}>
                      {work.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border p-2">{row.formula}</td>
              <td className="border p-2">{row.unit}</td>
              <td className="border p-2">
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={row.quantity}
                  onChange={(e) =>
                    handleInputChange(
                      row.id,
                      "quantity",
                      Number(e.target.value)
                    )
                  }
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={row.priceForUnit}
                  onChange={(e) =>
                    handleInputChange(
                      row.id,
                      "priceForUnit",
                      Number(e.target.value)
                    )
                  }
                />
              </td>
              <td className="border p-2">{row.result}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => removeRow(row.id)}
                  className="text-red-500"
                >
                  ✖
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
