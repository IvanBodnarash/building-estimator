import { IoDocumentTextSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import formatDate from "../utils/formatDate";

export default function EstimateCard({ estimate, handleDeleteEstimate }) {
  const navigate = useNavigate();

  return (
    <>
      <li className="w-50 h-70 bg-cyan-700 flex flex-col justify-center items-center cursor-pointer relative hover:bg-cyan-600 hover:scale-103 hover:shadow-2xl transition-all rounded-xl">
        <button
          className="ml-2 bg-red-500 text-white absolute top-2 right-2 px-2 py-1 rounded cursor-pointer hover:bg-red-600 transition-all"
          onClick={() => handleDeleteEstimate(estimate.id)}
        >
          Delete
        </button>
        <div onClick={() => navigate(`/estimate/${estimate.id}`)}>
          <div className="h-50 flex justify-center items-center">
            <IoDocumentTextSharp className="text-white text-5xl" />
          </div>
          <h1 className="text-slate-200 text-xl font-medium">
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
