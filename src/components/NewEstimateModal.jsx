import { useContext, useState } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function NewEstimateModal({ onClose, onSave }) {
  const { t } = useContext(LanguageContext);
  const [estimateName, setEstimateName] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!estimateName.trim()) {
      alert(
        t("pleaseEnterEstimateName") || "Please enter a name for the estimate."
      );
      return;
    }
    const newEstimate = {
      name: estimateName,
      dateCreated: new Date().toISOString(),
    };
    const id = await onSave(newEstimate);
    setEstimateName("");
    onClose();
    navigate(`/estimate/${id}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center md:items-center items-start md:pt-0 pt-24 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg lg:w-1/3 md:w-1/2 sm:w-1/2 w-3/4">
        <h2 className="lg:text-xl md:text-lg sm:text-md text-md font-bold mb-4">
          {t("newEstimate") || "New Estimate"}
        </h2>
        <input
          type="text"
          className="border p-2 w-full mb-4 md:text-md sm:text-sm text-sm"
          placeholder={t("enterEstimateName") || "Enter estimate name"}
          value={estimateName}
          onChange={(e) => setEstimateName(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white md:text-md sm:text-sm text-sm px-4 py-2 rounded mr-2 cursor-pointer"
            onClick={onClose}
          >
            {t("cancel") || "Cancel"}
          </button>
          <button
            className="bg-blue-500 text-white md:text-md sm:text-sm text-sm px-4 py-2 rounded cursor-pointer"
            onClick={handleSave}
          >
            {t("save") || "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
