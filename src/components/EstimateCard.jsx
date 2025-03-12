import { IoDocumentTextSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import formatDate from "../utils/formatDate";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function EstimateCard({ estimate, handleDeleteEstimate }) {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  return (
    <>
      <li className="lg:w-50 lg:h-70 md:w-44 md:h-64 sm:w-36 sm:h-60 w-44 h-64 bg-cyan-700 flex flex-col justify-center items-center cursor-pointer relative hover:bg-cyan-600 hover:scale-103 hover:shadow-2xl transition-all rounded-xl">
        <button
          className="ml-2 bg-red-500 text-white absolute top-2 right-2 px-2 py-1 rounded cursor-pointer hover:bg-red-600 transition-all"
          onClick={() => handleDeleteEstimate(estimate.id)}
        >
          {t("delete")}
        </button>
        <div onClick={() => navigate(`/estimate/${estimate.id}`)}>
          <div className="lg:h-50 md:h-44 sm:h-36 h-44 flex justify-center items-center">
            <IoDocumentTextSharp className="text-white md:text-5xl sm:text-4xl text-5xl" />
          </div>
          <h1 className="text-slate-200 lg:text-2xl md:text-xl sm:text-lg text-md text-center font-medium">
            {estimate.name}
          </h1>
          <h2 className="text-slate-200 text-md font-medium">
            {formatDate(new Date(estimate.dateCreated))}
          </h2>
        </div>
      </li>
    </>
  );
}
