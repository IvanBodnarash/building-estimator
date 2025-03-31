import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { motion } from "framer-motion";

import { categories as allCategories } from "../db/categoriesDB";
import { db } from "../db/db";

import formatDate from "../utils/formatDate";

import { LanguageContext } from "../context/LanguageContext";

import useWorks from "../hooks/useWorks";
import useEstimate from "../hooks/useEstimate";
import { calculateFormula } from "../helpers/estimateTableHelpers";

import AddWorkForm from "../components/AddWork";
import EstimateTable from "../components/EstimateTable";
import EditWorkModal from "../components/EditWorkModal";
import EstimateHeader from "../components/EstimateHeader";
import AddCategories from "../components/AddCategories";
import EstimateTotal from "../components/EstimateTotal";
import ActionButtons from "../components/ActionButtons";

export default function Estimate() {
  // const [works, setWorks] = useState([]);

  // const [selectedCategories, setSelectedCategories] = useState([]);
  // const [tableRows, setTableRows] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [editingWork, setEditingWork] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [total, setTotal] = useState(0);
  const [taxRate, setTaxRate] = useState(10);
  const [taxAmount, setTaxAmount] = useState(0);

  const { estimateId } = useParams();
  // const [estimate, setEstimate] = useState(null);

  const { estimateLanguage, setEstimateLanguage, t, estimateT } =
    useContext(LanguageContext);

  const langTranslations = t("language");

  const { works, setWorks, loadWorks } = useWorks();
  const {
    estimate,
    setEstimate,
    tableRows,
    setTableRows,
    selectedCategories,
    setSelectedCategories,
    loadEstimate,
  } = useEstimate(estimateId);

  useEffect(() => {
    const newTotal = tableRows.reduce((sum, row) => sum + (row.result || 0), 0);
    setTotal(newTotal);

    const newTaxAmount = newTotal * (taxRate / 100);
    setTaxAmount(newTaxAmount);
  }, [tableRows, taxRate]);

  useEffect(() => {
    setTableRows((prevRows) =>
      prevRows.map((row) => {
        if (row.workId) {
          let foundWork = null;
          for (const category of works) {
            if (category.works) {
              foundWork = category.works.find(
                (work) => String(work.id) === String(row.workId)
              );
              if (foundWork) break;
            }
          }
          return foundWork
            ? {
                ...row,
                workName:
                  foundWork.translations[estimateLanguage] ||
                  foundWork.workName ||
                  "Unnamed Work",
              }
            : row;
        } else if (row.translations) {
          return {
            ...row,
            workName: row.translations?.[estimateLanguage] || row.workName,
          };
        }
        return row;
      })
    );
  }, [estimateLanguage, works]);

  if (!estimate)
    return (
      <div className="h-screen lg:mx-38 md:mx-24 sm:mx-14 mx-4 border-x border-gray-700 px-4 py-8 overflow-hidden relative">
        {t("loading")}
      </div>
    );

  return (
    <div className="lg:mx-38 md:mx-24 sm:mx-14 h-screen mx-4 border-x border-gray-700 px-4 py-8 overflow-hidden relative bg-gray-950/[2.5%] after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-gray-950/5 bg-[radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-300)]">
      <div className="flex flex-col lg:gap-4 md:gap-3 sm:gap-2 gap-1">
        <h1 className="lg:text-4xl md:text-3xl sm:text-2xl text-xl text-cyan-950/80 font-bold whitespace-normal break-words">
          {estimate.name}
        </h1>
        <p className="lg:text-xl md:text-lg sm:text-base text-sm font-bold text-cyan-800/60">
          {t("created")}: {formatDate(new Date(estimate.dateCreated))}
        </p>
        <AddWorkForm
          onWorkAdded={loadWorks}
          editingWork={editingWork}
          setEditingWork={setEditingWork}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 border border-slate-500 bg-white mt-6 mb-8 overflow-x-auto"
      >
        <EstimateHeader
          estimateLanguage={estimateLanguage}
          setEstimateLanguage={setEstimateLanguage}
          t={t}
        />

        <EstimateTable
          estimateT={estimateT}
          selectedCategories={selectedCategories}
          tableRows={tableRows}
          setTableRows={setTableRows}
          works={works}
          setWorks={setWorks}
          setSelectedCategories={setSelectedCategories}
          estimateLanguage={estimateLanguage}
          t={t}
          calculateFormula={calculateFormula}
          setIsEditModalOpen={setIsEditModalOpen}
          setEditingRow={setEditingRow}
          allCategories={allCategories}
        />

        <AddCategories
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          allCategories={allCategories}
          t={t}
          estimateLanguage={estimateLanguage}
        />

        <div className="opacity-80 lg:text-lg md:text-md sm:text-sm text-xs">
          <EstimateTotal
            total={total}
            taxRate={taxRate}
            setTaxRate={setTaxRate}
            taxAmount={taxAmount}
            t={t}
          />
          {/* <div className="flex justify-between items-center">
            <h3>Total:</h3>
            <h3>{total.toFixed(2)} €</h3>
          </div>

          <div className="flex justify-between items-center">
            <label>{t("tax")} (%):</label>
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
            <h3>{t("taxAmount")}:</h3>
            <h3>{taxAmount.toFixed(2)} €</h3>
          </div>

          <div className="flex justify-between items-center mt-4 p-2 bg-gray-100 rounded-lg">
            <h3 className="lg:text-xl md:text-lg sm:text-md text-sm font-bold">
              {t("totalWithTax")}:
            </h3>
            <span className="text-green-600 font-bold">
              {(total + taxAmount).toFixed(2)} €
            </span>
          </div> */}

          <ActionButtons
            estimate={estimate}
            tableRows={tableRows}
            total={total}
            taxRate={taxRate}
            taxAmount={taxAmount}
            estimateLanguage={estimateLanguage}
            selectedCategories={selectedCategories}
            loadEstimate={loadEstimate}
            t={t}
            estimateId={estimateId}
          />

          {/* <div className="flex flex-row md:gap-4 gap-2 lg:text-lg md:text-md sm:text-sm text-xs">
            <button
              className="bg-cyan-800 hover:bg-cyan-600 text-white py-2 px-4 rounded cursor-pointer mt-4"
              onClick={handleSaveEstimate}
            >
              {t("saveEstimate")}
            </button>
            <button
              className="bg-cyan-800 hover:bg-cyan-600 text-white py-2 px-4 rounded cursor-pointer mt-4"
              onClick={() =>
                generatePDF(
                  estimate,
                  tableRows,
                  total,
                  taxRate,
                  taxAmount,
                  estimateLanguage,
                  selectedCategories
                )
              }
            >
              {t("generateDocument")}
            </button>
          </div> */}
        </div>

        {isEditModalOpen && (
          <EditWorkModal
            t={t}
            langTranslations={langTranslations}
            estimateLanguage={estimateLanguage}
            editingRow={editingRow}
            setEditingRow={setEditingRow}
            allCategories={allCategories}
            works={works}
            setTableRows={setTableRows}
            setIsEditModalOpen={setIsEditModalOpen}
            calculateFormula={calculateFormula}
            db={db}
            loadWorks={loadWorks}
          />
        )}
      </motion.div>
    </div>
  );
}
// import React, { useContext, useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";

// import { evaluate } from "mathjs";
// import { motion } from "framer-motion";

// import standardWorksDB from "../db/standardWorksDB";
// import { categories as allCategories, categories } from "../db/categoriesDB";
// import { db } from "../db/db";

// import formatDate from "../utils/formatDate";
// import generatePDF from "../utils/generatePDF";

// import { LanguageContext } from "../context/LanguageContext";

// import { MdModeEdit } from "react-icons/md";
// import { RiDeleteBin2Fill } from "react-icons/ri";

// import AddWorkForm from "../components/AddWork";
// import WorkSelector from "../components/WorkSelector";

// export default function Estimate() {
//   const [works, setWorks] = useState([]);

//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [tableRows, setTableRows] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");

//   const [editingWork, setEditingWork] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editingRow, setEditingRow] = useState(null);

//   const [total, setTotal] = useState(0);
//   const [taxRate, setTaxRate] = useState(10);
//   const [taxAmount, setTaxAmount] = useState(0);

//   const { estimateId } = useParams();
//   const [estimate, setEstimate] = useState(null);

//   const { estimateLanguage, setEstimateLanguage, t, estimateT } =
//     useContext(LanguageContext);

//   const langTranslations = t("language");

//   const loadWorks = async () => {
//     let savedWorks = await db.works.toArray();
//     if (savedWorks.length === 0) {
//       await db.works.bulkAdd(standardWorksDB);
//       savedWorks = await db.works.toArray();
//       console.log("✅ Standard works added!");
//     }
//     setWorks(savedWorks);
//     console.log(works);
//   };

//   const loadEstimate = async () => {
//     const storedEstimate = await db.estimates.get(Number(estimateId));
//     if (!storedEstimate) {
//       alert(t("estimateNotFound"));
//       return;
//     }
//     setEstimate(storedEstimate);
//     setTableRows(storedEstimate.works || []);
//     setSelectedCategories(storedEstimate.categories || []);
//   };

//   useEffect(() => {
//     loadWorks();
//   }, []);

//   useEffect(() => {
//     loadEstimate();
//   }, [estimateId]);

//   console.log(selectedCategories);

//   useEffect(() => {
//     const newTotal = tableRows.reduce((sum, row) => sum + (row.result || 0), 0);
//     setTotal(newTotal);

//     const newTaxAmount = newTotal * (taxRate / 100);
//     setTaxAmount(newTaxAmount);
//   }, [tableRows, taxRate]);

//   useEffect(() => {
//     setTableRows((prevRows) =>
//       prevRows.map((row) => {
//         if (row.workId) {
//           let foundWork = null;
//           for (const category of works) {
//             if (category.works) {
//               foundWork = category.works.find(
//                 (work) => String(work.id) === String(row.workId)
//               );
//               if (foundWork) break;
//             }
//           }
//           return foundWork
//             ? {
//                 ...row,
//                 workName:
//                   foundWork.translations[estimateLanguage] ||
//                   foundWork.workName ||
//                   "Unnamed Work",
//               }
//             : row;
//         } else if (row.translations) {
//           return {
//             ...row,
//             workName: row.translations?.[estimateLanguage] || row.workName,
//           };
//         }
//         return row;
//       })
//     );
//   }, [estimateLanguage, works]);

//   const addCategory = () => {
//     if (!selectedCategory) return;

//     if (selectedCategories.some((cat) => cat.category === selectedCategory))
//       return;

//     const maxId =
//       selectedCategories.length > 0
//         ? Math.max(...selectedCategories.map((cat) => cat.id))
//         : 0;

//     const newCategory = {
//       id: maxId + 1,
//       category: selectedCategory,
//     };

//     setSelectedCategories((prev) => [...prev, newCategory]);
//     setSelectedCategory("");
//   };

//   const removeCategory = (categoryId) => {
//     setSelectedCategories((prevCategories) =>
//       prevCategories.filter((cat) => cat.id !== categoryId)
//     );
//     setTableRows((prevRows) =>
//       prevRows.filter((row) => Number(row.categoryId) !== Number(categoryId))
//     );
//   };

//   const addRow = (categoryId) => {
//     const worksInCategory = tableRows.filter(
//       (row) => Number(row.categoryId) !== Number(categoryId)
//     );

//     const newRow = {
//       id: tableRows.length + 1,
//       categoryId,
//       workId: null,
//       workName: "",
//       formula: "",
//       unit: "",
//       quantity: "",
//       priceForUnit: 0,
//       result: 0,
//       workNumber: `${categoryId}.${worksInCategory.length + 1}`,
//     };

//     setTableRows((prev) => [...prev, newRow]);
//   };

//   console.log(editingRow);

//   const handleWorkSelect = (rowId, workId) => {
//     let selectedWork;
//     let parentCategory;
//     for (const cat of works) {
//       const found = cat.works.find((work) => work.id === workId);
//       if (found) {
//         selectedWork = found;
//         parentCategory = cat;
//         break;
//       }
//     }
//     if (!selectedWork) {
//       console.error("Work not found for id:", workId);
//       return;
//     }

//     setTimeout(() => {
//       setTableRows((prevRows) =>
//         prevRows.map((row) =>
//           row.id === rowId
//             ? {
//                 ...row,
//                 workId: selectedWork.id,
//                 workName:
//                   selectedWork.translations[estimateLanguage] ||
//                   selectedWork.workName ||
//                   "Unnamed Work",
//                 categoryId:
//                   selectedCategories.find(
//                     (cat) => cat.category === parentCategory.category
//                   )?.id || row.categoryId,
//                 formula: selectedWork.formula,
//                 unit: selectedWork.unit,
//                 priceForUnit: selectedWork.priceForUnit || 0,
//                 result: calculateFormula(selectedWork.formula, {
//                   a: 1,
//                   U: selectedWork.priceForUnit,
//                 }),
//                 translations: selectedWork.translations,
//               }
//             : row
//         )
//       );
//     }, 100);
//   };

//   const handleInputChange = (rowId, field, value) => {
//     setTableRows((prevRows) =>
//       prevRows.map((row) =>
//         row.id === rowId
//           ? {
//               ...row,
//               [field]: value === "" ? "" : Number(value),
//               result: calculateFormula(row.formula, {
//                 a:
//                   field === "quantity" ? Number(value) || 0 : row.quantity || 0,
//                 U:
//                   field === "priceForUnit"
//                     ? Number(value) || 0
//                     : row.priceForUnit || 0,
//               }),
//             }
//           : row
//       )
//     );
//   };

//   const calculateFormula = (formula, variables) => {
//     if (!formula) return 0;
//     try {
//       return evaluate(formula, variables);
//     } catch (error) {
//       return "Error";
//     }
//   };

//   const removeRow = (rowId) => {
//     setTableRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
//   };

//   const handleEdit = (row) => {
//     let updatedTranslations = {};
//     if (row.workId) {
//       updatedTranslations = row.translations || {};
//     } else {
//       updatedTranslations = row.translations || {};
//     }
//     setEditingRow({
//       ...row,
//       translations: updatedTranslations,
//     });
//     setIsEditModalOpen(true);
//   };

//   const handleSaveEdit = async () => {
//     if (!editingRow || !editingRow.workId) {
//       console.error("Invalid editingRow or workId:", editingRow);
//       return;
//     }

//     try {
//       const parentCategory = works.find(
//         (cat) =>
//           cat.works &&
//           cat.works.some((w) => String(w.id) === String(editingRow.workId))
//       );
//       if (!parentCategory) {
//         console.error(
//           "Parent category not found for work ID:",
//           editingRow.workId
//         );
//         return;
//       }

//       const workIndex = parentCategory.works.findIndex(
//         (w) => String(w.id) === String(editingRow.workId)
//       );
//       if (workIndex === -1) {
//         console.error(
//           "Work not found in parent category for work ID:",
//           editingRow.workId
//         );
//         return;
//       }

//       const selectedWork = parentCategory.works[workIndex];

//       const updatedWork = {
//         ...selectedWork,
//         workName: editingRow.workName,
//         translations: editingRow.translations,
//         formula: editingRow.formula,
//         unit: editingRow.unit,
//         priceForUnit: editingRow.priceForUnit,
//       };

//       const updatedWorksArray = [...parentCategory.works];
//       updatedWorksArray[workIndex] = updatedWork;

//       await db.works.update(parentCategory.id, { works: updatedWorksArray });

//       await loadWorks();

//       setTableRows((prevRows) =>
//         prevRows.map((row) =>
//           String(row.workId) === String(editingRow.workId)
//             ? {
//                 ...row,
//                 workName:
//                   updatedWork.translations[estimateLanguage] ||
//                   updatedWork.workName ||
//                   "Unnamed Work",
//                 category: editingRow.category,
//                 formula: editingRow.formula,
//                 unit: editingRow.unit,
//                 priceForUnit: editingRow.priceForUnit,
//                 result: calculateFormula(updatedWork.formula, {
//                   a: row.quantity || 1,
//                   U: updatedWork.priceForUnit,
//                 }),
//               }
//             : row
//         )
//       );

//       setIsEditModalOpen(false);
//     } catch (error) {
//       console.error("Error updating work:", error);
//     }
//   };

//   const handleDelete = async (workId) => {
//     if (confirm(t("deleteWorkConfirmation"))) {
//       setWorks((prevWorks) => prevWorks.filter((w) => w.id !== workId));
//       setTableRows((prevRows) =>
//         prevRows.map((row) =>
//           row.workId === workId
//             ? {
//                 ...row,
//                 workId: "",
//                 workName: "",
//                 category: "",
//                 formula: "",
//                 unit: "",
//                 priceForUnit: "",
//                 result: "",
//               }
//             : row
//         )
//       );
//       await db.works.delete(workId);
//     }
//   };

//   const handleSaveEstimate = async () => {
//     if (!estimate || tableRows.length === 0) {
//       alert(t("addingOneWorkAlert"));
//       return;
//     }

//     const updatedEstimate = {
//       ...estimate,
//       works: tableRows,
//       categories: selectedCategories,
//     };

//     await db.estimates.update(Number(estimateId), updatedEstimate);
//     await db.categories.where("estimateId").equals(Number(estimateId)).delete();
//     await db.categories.bulkAdd(
//       selectedCategories.map((cat) => ({
//         estimateId: Number(estimateId),
//         categoryName: cat.category,
//       }))
//     );

//     loadEstimate();
//     alert(t("savingEstimateSuccess"));
//   };

//   const normalizedRows = useMemo(() => {
//     return tableRows.reduce((acc, row) => {
//       if (row.works && Array.isArray(row.works)) {
//         row.works.forEach((work) => {
//           acc.push({
//             ...work,
//             categoryId: row.id,
//           });
//         });
//       } else {
//         acc.push(row);
//       }
//       return acc;
//     }, []);
//   }, [tableRows]);

//   if (!estimate)
//     return (
//       <div className="h-screen lg:mx-38 md:mx-24 sm:mx-14 mx-4 border-x border-gray-700 px-4 py-8 overflow-hidden relative">
//         {t("loading")}
//       </div>
//     );

//   return (
//     <div className="lg:mx-38 md:mx-24 sm:mx-14 mx-4 border-x border-gray-700 px-4 py-8 overflow-hidden relative bg-gray-950/[2.5%] after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-gray-950/5 bg-[radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-300)]">
//       <div className="flex flex-col lg:gap-4 md:gap-3 sm:gap-2 gap-1">
//         <h1 className="lg:text-4xl md:text-3xl sm:text-2xl text-xl text-cyan-950/80 font-bold whitespace-normal break-words">
//           {estimate.name}
//         </h1>
//         <p className="lg:text-xl md:text-lg sm:text-base text-sm font-bold text-cyan-800/60">
//           {t("created")}: {formatDate(new Date(estimate.dateCreated))}
//         </p>
//         <AddWorkForm
//           onWorkAdded={loadWorks}
//           editingWork={editingWork}
//           setEditingWork={setEditingWork}
//         />
//       </div>

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="p-4 border border-slate-500 bg-white mt-6 mb-8 overflow-x-auto"
//       >
//         <div className="flex opacity-80 justify-between items-center mb-4">
//           <h2 className="lg:text-xl md:text-lg sm:text-base text-sm font-bold">
//             {t("estimateCalculator")}
//           </h2>

//           <div className="">
//             <label className="mr-2 lg:text-lg md:text-md sm:text-sm text-xs">
//               {t("estimateLanguage")}:
//             </label>
//             <select
//               className="sm:p-2 p-0 outline-none lg:text-lg md:text-md sm:text-sm text-xs cursor-pointer"
//               value={estimateLanguage}
//               onChange={(e) => setEstimateLanguage(e.target.value)}
//             >
//               <option value="en">EN</option>
//               <option value="es">ES</option>
//               <option value="uk">UK</option>
//               <option value="ru">RU</option>
//             </select>
//           </div>
//         </div>

//         <table className="w-full min-w-max border-collapse">
//           <thead>
//             <tr className="opacity-70 lg:text-lg md:text-md sm:text-sm text-xs">
//               <th className="border p-2">ID</th>
//               <th className="border p-2">{estimateT("workName")}</th>
//               <th className="border p-2">{estimateT("formula")}</th>
//               <th className="border p-2">{estimateT("unit")}</th>
//               <th className="border p-2">{estimateT("quantity")}</th>
//               <th className="border p-2">{estimateT("priceForUnit")}</th>
//               <th className="border p-2">{estimateT("result")}</th>
//               <th className="border p-2">{estimateT("actions")}</th>
//             </tr>
//           </thead>
//           <tbody className="sm:table-row-group lg:text-lg md:text-md sm:text-sm text-xs transition-all">
//             {selectedCategories.map((category, categoryIndex) => (
//               <React.Fragment key={category.id}>
//                 <tr className="bg-gray-200 font-bold">
//                   <td colSpan="8" className="p-2 border">
//                     {`${categoryIndex + 1} ${
//                       allCategories.find(
//                         (cat) => cat.category === category.category
//                       )?.translations?.[estimateLanguage] || category.category
//                     }`}
//                     <button
//                       onClick={() => removeCategory(category.id)}
//                       className="text-black hover:text-red-800 cursor-pointer ml-4"
//                       title={t("delete")}
//                     >
//                       ✖
//                     </button>
//                   </td>
//                 </tr>

//                 {normalizedRows
//                   .filter(
//                     (row) => Number(row.categoryId) === Number(category.id)
//                   )
//                   .map((row, workIndex) => (
//                     <tr key={row.id} className="border">
//                       <td className="border p-2 text-center">
//                         {`${categoryIndex + 1}.${workIndex + 1}`}
//                       </td>
//                       <td className="p-2 flex flex-row gap-2 justify-between items-center">
//                         <WorkSelector
//                           key={`${row.id}-${estimateLanguage}`}
//                           works={works}
//                           categories={allCategories}
//                           estimateLanguage={estimateLanguage}
//                           handleWorkSelect={handleWorkSelect}
//                           row={row}
//                         />

//                         {row.workId && (
//                           <div className="flex md:space-x-4 space-x-2">
//                             <button
//                               className="cursor-pointer text-2xl"
//                               onClick={() => handleEdit(row)}
//                               title={t("edit")}
//                             >
//                               <MdModeEdit className="lg:text-xl md:text-lg sm:text-md text-sm" />
//                             </button>
//                             <button
//                               className="cursor-pointer text-2xl"
//                               onClick={() => handleDelete(row.workId)}
//                               title={t("delete")}
//                             >
//                               <RiDeleteBin2Fill className="lg:text-xl md:text-lg sm:text-md text-sm text-red-500" />
//                             </button>
//                           </div>
//                         )}
//                       </td>
//                       <td className="border p-2 text-center">{row.formula}</td>
//                       <td className="border p-2 text-center">{row.unit}</td>
//                       <td className="flex justify-center">
//                         <input
//                           type="number"
//                           className="p-2 w-16 text-center outline-none"
//                           value={row.quantity === "" ? "" : row.quantity}
//                           onChange={(e) =>
//                             handleInputChange(
//                               row.id,
//                               "quantity",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </td>
//                       <td className="border p-2">
//                         <input
//                           type="number"
//                           className="p-2 w-18 outline-none"
//                           value={
//                             row.priceForUnit === "" ? "" : row.priceForUnit
//                           }
//                           onChange={(e) =>
//                             handleInputChange(
//                               row.id,
//                               "priceForUnit",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </td>
//                       <td className="border p-2 text-center">{row.result}</td>
//                       <td className="border p-2 text-center">
//                         <button
//                           onClick={() => removeRow(row.id)}
//                           className="text-black hover:text-red-800 cursor-pointer"
//                           title={t("delete")}
//                         >
//                           ✖
//                         </button>
//                       </td>
//                     </tr>
//                   ))}

//                 <tr>
//                   <td colSpan="8" className="">
//                     <button
//                       onClick={() => addRow(category.id)}
//                       className="bg-cyan-600 text-white py-1 px-4 cursor-pointer rounded-b-xl border-t-3 mb-2 transition-all hover:bg-cyan-500"
//                     >
//                       + {t("addWork")}
//                     </button>
//                   </td>
//                 </tr>
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//         <div className="flex flex-wrap gap-4 items-center my-4 lg:text-lg md:text-md sm:text-sm text-xs">
//           <select
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="border p-2 rounded cursor-pointer outline-none"
//           >
//             <option className="bg-gray-200" value="">
//               {t("selectCategory")}
//             </option>
//             {allCategories.map((cat) => (
//               <option key={cat.category} value={cat.category}>
//                 {cat.translations[estimateLanguage] || cat.category}
//               </option>
//             ))}
//           </select>
//           <button
//             onClick={addCategory}
//             className="bg-cyan-800 hover:bg-cyan-600 text-white py-2 px-4 rounded cursor-pointer"
//           >
//             + {t("addCategory")}
//           </button>
//         </div>

//         <div className="opacity-80 lg:text-lg md:text-md sm:text-sm text-xs">
//           <div className="flex justify-between items-center">
//             <h3>Total:</h3>
//             <h3>{total.toFixed(2)} €</h3>
//           </div>

//           <div className="flex justify-between items-center">
//             <label>{t("tax")} (%):</label>
//             <input
//               type="number"
//               className="border p-2 w-16 outline-none"
//               value={taxRate === null ? "" : taxRate}
//               onChange={(e) =>
//                 setTaxRate(
//                   e.target.value === "" ? null : Number(e.target.value)
//                 )
//               }
//             />
//           </div>

//           <div className="flex justify-between items-center">
//             <h3>{t("taxAmount")}:</h3>
//             <h3>{taxAmount.toFixed(2)} €</h3>
//           </div>

//           <div className="flex justify-between items-center mt-4 p-2 bg-gray-100 rounded-lg">
//             <h3 className="lg:text-xl md:text-lg sm:text-md text-sm font-bold">
//               {t("totalWithTax")}:
//             </h3>
//             <span className="text-green-600 font-bold">
//               {(total + taxAmount).toFixed(2)} €
//             </span>
//           </div>

//           <div className="flex flex-row md:gap-4 gap-2 lg:text-lg md:text-md sm:text-sm text-xs">
//             <button
//               className="bg-cyan-800 hover:bg-cyan-600 text-white py-2 px-4 rounded cursor-pointer mt-4"
//               onClick={handleSaveEstimate}
//             >
//               {t("saveEstimate")}
//             </button>
//             <button
//               className="bg-cyan-800 hover:bg-cyan-600 text-white py-2 px-4 rounded cursor-pointer mt-4"
//               onClick={() =>
//                 generatePDF(
//                   estimate,
//                   tableRows,
//                   total,
//                   taxRate,
//                   taxAmount,
//                   estimateLanguage,
//                   selectedCategories
//                 )
//               }
//             >
//               {t("generateDocument")}
//             </button>
//           </div>
//         </div>

//         {isEditModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 h-screen overflow-scroll pt-48 pb-8 flex justify-center items-center z-[9999]">
//             <div className="bg-white p-6 rounded-lg shadow-lg md:w-2/3 w-4/5">
//               <h2 className="text-xl">{t("editWork")}</h2>
//               <label htmlFor="name">{t("workName")}</label>
//               <input
//                 type="text"
//                 name="name"
//                 className="border p-2 w-full mb-2"
//                 value={editingRow?.workName || ""}
//                 onChange={(e) =>
//                   setEditingRow((prev) => ({
//                     ...prev,
//                     workName: e.target.value,
//                   }))
//                 }
//               />
//               <label htmlFor="category" className="block font-medium mb-2">
//                 {t("category")}
//               </label>
//               <select
//                 className="border p-2 w-full rounded mb-4"
//                 name="category"
//                 value={editingRow?.category || ""}
//                 onChange={(e) =>
//                   setEditingRow((prev) => ({
//                     ...prev,
//                     category: e.target.value,
//                   }))
//                 }
//               >
//                 {allCategories.map((cat) => (
//                   <option key={cat.category} value={cat.category}>
//                     {cat.translations?.[estimateLanguage] || cat.category}
//                   </option>
//                 ))}
//               </select>

//               <label className="block font-medium mb-2">
//                 {t("translations")}
//               </label>
//               <div className="border p-3 rounded bg-gray-50 flex md:flex-row flex-col gap-2">
//                 {["en", "es", "uk", "ru"].map((lang) => (
//                   <div key={lang} className="">
//                     <label htmlFor={`name-${lang}`}>
//                       {langTranslations[lang]}
//                     </label>
//                     <input
//                       type="text"
//                       className="border p-2 w-full mb-2"
//                       value={editingRow?.translations?.[lang] ?? ""}
//                       onChange={(e) =>
//                         setEditingRow((prev) => ({
//                           ...prev,
//                           translations: {
//                             ...prev.translations,
//                             [lang]: e.target.value,
//                           },
//                         }))
//                       }
//                     />
//                   </div>
//                 ))}
//               </div>

//               <label htmlFor="formula">{t("formula")}</label>
//               <input
//                 type="text"
//                 name="formula"
//                 className="border p-2 w-full mb-2"
//                 value={editingRow?.formula || ""}
//                 onChange={(e) =>
//                   setEditingRow((prev) => ({
//                     ...prev,
//                     formula: e.target.value,
//                   }))
//                 }
//               />
//               <label htmlFor="unit">{t("unit")}</label>
//               <select
//                 className="border p-2 w-full cursor-pointer"
//                 name="unit"
//                 value={editingRow?.unit || ""}
//                 onChange={(e) =>
//                   setEditingRow((prev) => ({
//                     ...prev,
//                     unit: e.target.value,
//                   }))
//                 }
//               >
//                 <option value="m2">m2</option>
//                 <option value="m3">m3</option>
//                 <option value="hr">hr</option>
//                 <option value="custom">{t("custom")}</option>
//               </select>
//               <label htmlFor="priceForUnit">{t("priceForUnit")}</label>
//               <input
//                 type="number"
//                 name="priceForUnit"
//                 className="border p-2 w-full mb-2"
//                 value={editingRow?.priceForUnit || ""}
//                 onChange={(e) =>
//                   setEditingRow((prev) => ({
//                     ...prev,
//                     priceForUnit: Number(e.target.value),
//                   }))
//                 }
//               />
//               <div className="flex justify-end">
//                 <button
//                   className="px-4 py-2 rounded mr-2 bg-cyan-900 text-white hover:bg-cyan-700 transition-all cursor-pointer"
//                   onClick={() => setIsEditModalOpen(false)}
//                 >
//                   {t("cancel")}
//                 </button>
//                 <button
//                   className="px-4 py-2 rounded mr-2 bg-cyan-900 text-white hover:bg-cyan-700 transition-all cursor-pointer"
//                   onClick={handleSaveEdit}
//                 >
//                   {t("save")}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// }
