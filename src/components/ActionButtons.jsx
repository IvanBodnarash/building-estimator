import generatePDF from "../utils/generatePDF";
import { db } from "../db/db";

export default function ActionButtons({
  estimate,
  tableRows,
  total,
  taxRate,
  taxAmount,
  estimateLanguage,
  selectedCategories,
  loadEstimate,
  t,
  estimateId,
}) {
  const handleSaveEstimate = async () => {
    if (!estimate || tableRows.length === 0) {
      alert(t("addingOneWorkAlert"));
      return;
    }

    const updatedEstimate = {
      ...estimate,
      works: tableRows,
      categories: selectedCategories,
    };

    await db.estimates.update(Number(estimateId), updatedEstimate);
    await db.categories.where("estimateId").equals(Number(estimateId)).delete();
    await db.categories.bulkAdd(
      selectedCategories.map((cat) => ({
        estimateId: Number(estimateId),
        categoryName: cat.category,
      }))
    );

    loadEstimate();
    alert(t("savingEstimateSuccess"));
  };

  return (
    <div className="flex flex-row md:gap-4 gap-2 lg:text-lg md:text-md sm:text-sm text-xs">
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
    </div>
  );
}
