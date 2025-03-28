import { useContext, useState } from "react";
import { FaPlus } from "react-icons/fa";
import EstimateCard from "../components/EstimateCard";
import NewEstimateModal from "../components/NewEstimateModal";
import useEstimates from "../hooks/useEstimates";
import { LanguageContext } from "../context/LanguageContext";

export default function MainPage() {
  const { t } = useContext(LanguageContext);
  const { estimates, addEstimate, deleteEstimate } = useEstimates({ t });
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            {t("createNew") || "Create New"}
          </h1>
        </div>
        {estimates.length === 0 ? (
          <p className="text-slate-400">
            {t("noEstimates") || "No estimates available"}
          </p>
        ) : (
          estimates.map((estimate) => (
            <EstimateCard
              key={estimate.id}
              estimate={estimate}
              handleDeleteEstimate={deleteEstimate}
            />
          ))
        )}
      </ul>

      {isModalOpen && (
        <NewEstimateModal
          onClose={() => setIsModalOpen(false)}
          onSave={addEstimate}
        />
      )}
    </div>
  );
}
