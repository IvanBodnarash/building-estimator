import React from "react";

export default function EditWorkModal({
  t,
  langTranslations,
  estimateLanguage,
  editingRow,
  setEditingRow,
  allCategories,
  works,
  setTableRows,
  setIsEditModalOpen,
  calculateFormula,
  db,
  loadWorks,
}) {
  const handleSaveEdit = async () => {
    if (!editingRow || !editingRow.workId) {
      console.error("Invalid editingRow or workId:", editingRow);
      return;
    }

    try {
      const parentCategory = works.find(
        (cat) =>
          cat.works &&
          cat.works.some((w) => String(w.id) === String(editingRow.workId))
      );
      if (!parentCategory) {
        console.error(
          "Parent category not found for work ID:",
          editingRow.workId
        );
        return;
      }

      const workIndex = parentCategory.works.findIndex(
        (w) => String(w.id) === String(editingRow.workId)
      );
      if (workIndex === -1) {
        console.error(
          "Work not found in parent category for work ID:",
          editingRow.workId
        );
        return;
      }

      const selectedWork = parentCategory.works[workIndex];

      const updatedWork = {
        ...selectedWork,
        workName: editingRow.workName,
        translations: editingRow.translations,
        formula: editingRow.formula,
        unit: editingRow.unit,
        priceForUnit: editingRow.priceForUnit,
      };

      const updatedWorksArray = [...parentCategory.works];
      updatedWorksArray[workIndex] = updatedWork;

      await db.works.update(parentCategory.id, { works: updatedWorksArray });

      setTableRows((prevRows) =>
        prevRows.map((row) =>
          String(row.workId) === String(editingRow.workId)
            ? {
                ...row,
                workName:
                  updatedWork.translations[estimateLanguage] ||
                  updatedWork.workName ||
                  "Unnamed Work",
                category: editingRow.category,
                formula: editingRow.formula,
                unit: editingRow.unit,
                priceForUnit: editingRow.priceForUnit,
                result: calculateFormula(updatedWork.formula, {
                  a: row.quantity || 1,
                  U: updatedWork.priceForUnit,
                }),
              }
            : row
        )
      );

      await loadWorks();

      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating work:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 h-screen overflow-scroll pt-48 pb-8 flex justify-center items-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg md:w-2/3 w-4/5">
        <h2 className="text-xl">{t("editWork")}</h2>
        <label htmlFor="name">{t("workName")}</label>
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
        <label htmlFor="category" className="block font-medium mb-2">
          {t("category")}
        </label>
        <select
          className="border p-2 w-full rounded mb-4"
          name="category"
          value={editingRow?.category || ""}
          onChange={(e) =>
            setEditingRow((prev) => ({
              ...prev,
              category: e.target.value,
            }))
          }
        >
          {allCategories.map((cat) => (
            <option key={cat.category} value={cat.category}>
              {cat.translations?.[estimateLanguage] || cat.category}
            </option>
          ))}
        </select>

        <label className="block font-medium mb-2">{t("translations")}</label>
        <div className="border p-3 rounded bg-gray-50 flex md:flex-row flex-col gap-2">
          {["en", "es", "uk", "ru"].map((lang) => (
            <div key={lang} className="">
              <label htmlFor={`name-${lang}`}>{langTranslations[lang]}</label>
              <input
                type="text"
                className="border p-2 w-full mb-2"
                value={editingRow?.translations?.[lang] ?? ""}
                onChange={(e) =>
                  setEditingRow((prev) => ({
                    ...prev,
                    translations: {
                      ...prev.translations,
                      [lang]: e.target.value,
                    },
                  }))
                }
              />
            </div>
          ))}
        </div>

        <label htmlFor="formula">{t("formula")}</label>
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
        <label htmlFor="unit">{t("unit")}</label>
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
          <option value="custom">{t("custom")}</option>
        </select>
        <label htmlFor="priceForUnit">{t("priceForUnit")}</label>
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
            className="px-4 py-2 rounded mr-2 bg-cyan-900 text-white hover:bg-cyan-700 transition-all cursor-pointer"
            onClick={() => setIsEditModalOpen(false)}
          >
            {t("cancel")}
          </button>
          <button
            className="px-4 py-2 rounded mr-2 bg-cyan-900 text-white hover:bg-cyan-700 transition-all cursor-pointer"
            onClick={handleSaveEdit}
          >
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
