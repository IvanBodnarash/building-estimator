import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  function handleRedirect() {
    navigate("/create-new");
  }

  return (
    <div>
      <h1>MainPage</h1>
      <div
        className="w-50 h-70 bg-cyan-800 flex flex-col justify-center items-center cursor-pointer hover:bg-cyan-700 hover:scale-103 hover:shadow-2xl transition-all rounded-xl"
        onClick={handleRedirect}
      >
        <div className="h-50 flex justify-center items-center">
          <FaPlus className="text-white text-5xl" />
        </div>
        <h1 className="text-slate-200 text-2xl font-medium">Create New</h1>
      </div>
    </div>
  );
}
