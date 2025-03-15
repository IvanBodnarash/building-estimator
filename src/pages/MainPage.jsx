import { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db } from "../db/db";
import formatDate from "../utils/formatDate";
import EstimateCard from "../components/EstimateCard";
import { LanguageContext } from "../context/LanguageContext";

export default function MainPage() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [estimateName, setEstimateName] = useState("");
  const [estimates, setEstimates] = useState([]);

  useEffect(() => {
    loadEstimates();
  }, []);

  async function loadEstimates() {
    const storedEstimates = await db.estimates.toArray();
    setEstimates(storedEstimates);
  }

  async function handleSaveEstimate() {
    if (!estimateName.trim()) {
      alert("Please enter a name for the estimate.");
      return;
    }

    const newEstimate = {
      name: estimateName,
      dateCreated: new Date().toISOString(),
    };

    const id = await db.estimates.add(newEstimate);
    setEstimateName("");
    setIsModalOpen(false);
    loadEstimates();
    navigate(`/estimate/${id}`);
  }

  async function handleDeleteEstimate(estimateId) {
    if (confirm(t("deleteEstimateConfirmation"))) {
      await db.estimates.delete(estimateId);
      await db.estimateWorks.where("estimateId").equals(estimateId).delete();
      loadEstimates();
    } else {
      return;
    }
  }

  return (
    <div className="h-screen border-x flex items-start lg:mx-38 md:mx-24 sm:mx-14 mx-4 border-gray-700 p-10 md:overflow-hidden overflow-scroll relative bg-gray-950/[2.5%] after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-gray-950/5 bg-[radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-300)]">
      <ul className="flex flex-row flex-wrap lg:gap-12 md:gap-8 sm:gap-6 gap-4 justify-center">
        <div
          className="lg:w-50 lg:h-70 md:w-44 md:h-64 sm:w-36 sm:h-60 w-44 h-64 bg-cyan-800 flex flex-col justify-center items-center cursor-pointer hover:bg-cyan-700 hover:scale-103 hover:shadow-2xl transition-all rounded-xl"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="h-50 flex justify-center items-center">
            <FaPlus className="text-white md:text-5xl sm:text-4xl text-5xl" />
          </div>
          <h1 className="text-slate-200 lg:text-2xl md:text-xl sm:text-lg text-md font-medium px-6 py-4 text-center">
            {t("createNew")}
          </h1>
        </div>
        {estimates.length === 0 ? (
          <p className="text-slate-400">{t("noEstimates")}</p>
        ) : (
          <>
            {estimates.map((estimate) => (
              <EstimateCard
                key={estimate.id}
                estimate={estimate}
                handleDeleteEstimate={handleDeleteEstimate}
              />
            ))}
          </>
        )}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg lg:w-1/3 md:w-1/2 sm:w-1/2 w-3/4">
            <h2 className="lg:text-xl md:text-lg sm:text-md text-md font-bold mb-4">{t("newEstimate")}</h2>
            <input
              type="text"
              className="border p-2 w-full mb-4 md:text-md sm:text-sm text-sm"
              placeholder={t("enterEstimateName")}
              value={estimateName}
              onChange={(e) => setEstimateName(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white md:text-md sm:text-sm text-sm px-4 py-2 rounded mr-2 cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                {t("cancel")}
              </button>
              <button
                className="bg-blue-500 text-white md:text-md sm:text-sm text-sm px-4 py-2 rounded cursor-pointer"
                onClick={handleSaveEstimate}
              >
                {t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
