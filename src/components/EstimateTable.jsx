import React, { useMemo } from "react";
import { db } from "../db/db";
import { normalizedRowsHelper } from "../helpers/estimateTableHelpers";
import WorkSelector from "./WorkSelector";

import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin2Fill } from "react-icons/ri";

export default function EstimateTable({
  estimateT,
  selectedCategories,
  tableRows,
  setTableRows,
  works,
  setWorks,
  setSelectedCategories,
  estimateLanguage,
  t,
  calculateFormula,
  setIsEditModalOpen,
  setEditingRow,
  allCategories,
}) {
  const addRow = (categoryId) => {
    const worksInCategory = tableRows.filter(
      (row) => Number(row.categoryId) !== Number(categoryId)
    );

    const newRow = {
      id: tableRows.length + 1,
      categoryId,
      workId: null,
      workName: "",
      formula: "",
      unit: "",
      quantity: "",
      priceForUnit: 0,
      result: 0,
      workNumber: `${categoryId}.${worksInCategory.length + 1}`,
    };

    setTableRows((prev) => [...prev, newRow]);
  };

  const handleWorkSelect = (rowId, workId) => {
    let selectedWork;
    let parentCategory;
    for (const cat of works) {
      const found = cat.works.find((work) => work.id === workId);
      if (found) {
        selectedWork = found;
        parentCategory = cat;
        break;
      }
    }
    if (!selectedWork) {
      console.error("Work not found for id:", workId);
      return;
    }

    setTimeout(() => {
      setTableRows((prevRows) =>
        prevRows.map((row) =>
          row.id === rowId
            ? {
                ...row,
                workId: selectedWork.id,
                workName:
                  selectedWork.translations[estimateLanguage] ||
                  selectedWork.workName ||
                  "Unnamed Work",
                categoryId:
                  selectedCategories.find(
                    (cat) => cat.category === parentCategory.category
                  )?.id || row.categoryId,
                formula: selectedWork.formula,
                unit: selectedWork.unit,
                priceForUnit: selectedWork.priceForUnit || 0,
                result: calculateFormula(selectedWork.formula, {
                  a: 1,
                  U: selectedWork.priceForUnit,
                }),
                translations: selectedWork.translations,
              }
            : row
        )
      );
    }, 100);
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

  const removeCategory = (categoryId) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.filter((cat) => cat.id !== categoryId)
    );
    setTableRows((prevRows) =>
      prevRows.filter((row) => Number(row.categoryId) !== Number(categoryId))
    );
  };

  const removeRow = (rowId) => {
    setTableRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
  };

  const handleEdit = (row) => {
    let updatedTranslations = {};
    if (row.workId) {
      updatedTranslations = row.translations || {};
    } else {
      updatedTranslations = row.translations || {};
    }
    setEditingRow({
      ...row,
      translations: updatedTranslations,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (workId) => {
    if (confirm(t("deleteWorkConfirmation"))) {
      setWorks((prevWorks) => prevWorks.filter((w) => w.id !== workId));
      setTableRows((prevRows) =>
        prevRows.map((row) =>
          row.workId === workId
            ? {
                ...row,
                workId: "",
                workName: "",
                category: "",
                formula: "",
                unit: "",
                priceForUnit: "",
                result: "",
              }
            : row
        )
      );
      await db.works.delete(workId);
    }
  };

  const normalizedRows = useMemo(
    () => normalizedRowsHelper(tableRows),
    [tableRows]
  );

  return (
    <table className="w-full min-w-max border-collapse">
      <thead>
        <tr className="opacity-70 lg:text-lg md:text-md sm:text-sm text-xs">
          <th className="border p-2">ID</th>
          <th className="border p-2">{estimateT("workName")}</th>
          <th className="border p-2">{estimateT("formula")}</th>
          <th className="border p-2">{estimateT("unit")}</th>
          <th className="border p-2">{estimateT("quantity")}</th>
          <th className="border p-2">{estimateT("priceForUnit")}</th>
          <th className="border p-2">{estimateT("result")}</th>
          <th className="border p-2">{estimateT("actions")}</th>
        </tr>
      </thead>
      <tbody className="sm:table-row-group lg:text-lg md:text-md sm:text-sm text-xs transition-all">
        {selectedCategories.map((category, categoryIndex) => (
          <React.Fragment key={category.id}>
            <tr className="bg-gray-200 font-bold">
              <td colSpan="8" className="p-2 border">
                {`${categoryIndex + 1} ${
                  allCategories.find(
                    (cat) => cat.category === category.category
                  )?.translations?.[estimateLanguage] || category.category
                }`}
                <button
                  onClick={() => removeCategory(category.id)}
                  className="text-black hover:text-red-800 cursor-pointer ml-4"
                  title={t("delete")}
                >
                  ✖
                </button>
              </td>
            </tr>

            {normalizedRows
              .filter((row) => Number(row.categoryId) === Number(category.id))
              .map((row, workIndex) => (
                <tr key={row.id} className="border">
                  <td className="border p-2 text-center">
                    {`${categoryIndex + 1}.${workIndex + 1}`}
                  </td>
                  <td className="p-2 flex flex-row gap-2 justify-between items-center">
                    <WorkSelector
                      key={`${row.id}-${estimateLanguage}`}
                      works={works}
                      categories={allCategories}
                      estimateLanguage={estimateLanguage}
                      handleWorkSelect={handleWorkSelect}
                      row={row}
                    />

                    {row.workId && (
                      <div className="flex md:space-x-4 space-x-2">
                        <button
                          className="cursor-pointer text-2xl"
                          onClick={() => handleEdit(row)}
                          title={t("edit")}
                        >
                          <MdModeEdit className="lg:text-xl md:text-lg sm:text-md text-sm" />
                        </button>
                        <button
                          className="cursor-pointer text-2xl"
                          onClick={() => handleDelete(row.workId)}
                          title={t("delete")}
                        >
                          <RiDeleteBin2Fill className="lg:text-xl md:text-lg sm:text-md text-sm text-red-500" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="border p-2 text-center">{row.formula}</td>
                  <td className="border p-2 text-center">{row.unit}</td>
                  <td className="flex justify-center">
                    <input
                      type="number"
                      className="p-2 w-16 text-center outline-none"
                      value={row.quantity === "" ? "" : row.quantity}
                      onChange={(e) =>
                        handleInputChange(row.id, "quantity", e.target.value)
                      }
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      className="p-2 w-18 outline-none"
                      value={row.priceForUnit === "" ? "" : row.priceForUnit}
                      onChange={(e) =>
                        handleInputChange(
                          row.id,
                          "priceForUnit",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td className="border p-2 text-center">{row.result}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => removeRow(row.id)}
                      className="text-black hover:text-red-800 cursor-pointer"
                      title={t("delete")}
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}

            <tr>
              <td colSpan="8" className="">
                <button
                  onClick={() => addRow(category.id)}
                  className="bg-cyan-600 text-white py-1 px-4 cursor-pointer rounded-b-xl border-t-3 mb-2 transition-all hover:bg-cyan-500"
                >
                  + {t("addWork")}
                </button>
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
