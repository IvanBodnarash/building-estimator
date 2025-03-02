import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db } from "../db/db";

export default function MainPage() {
  const navigate = useNavigate();
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
    await db.estimates.delete(estimateId);
    await db.estimateWorks.where("estimateId").equals(estimateId).delete();
    loadEstimates();
  }

  // function handleRedirect() {
  //   navigate("/create-new");
  // }

  return (
    <div className="grid grid-cols-4 gap-3">
      <h1>MainPage</h1>
      <div
        className="w-50 h-70 bg-cyan-800 flex flex-col justify-center items-center cursor-pointer hover:bg-cyan-700 hover:scale-103 hover:shadow-2xl transition-all rounded-xl"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="h-50 flex justify-center items-center">
          <FaPlus className="text-white text-5xl" />
        </div>
        <h1 className="text-slate-200 text-2xl font-medium">Create New</h1>
      </div>

      {estimates.length === 0 ? (
        <p className="text-slate-400">No estimates yet.</p>
      ) : (
        <ul>
          {estimates.map((estimate) => (
            <li key={estimate.id}>
              <span
                className="cursor-pointer"
                onClick={() => navigate(`/estimate/${estimate.id}`)}
              >
                {estimate.name} -
                {new Date(estimate.dateCreated).toLocaleString()}
              </span>
              <button
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDeleteEstimate(estimate.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">New Estimate</h2>
            <input
              type="text"
              className="border p-2 w-full mb-4"
              placeholder="Enter estimate name"
              value={estimateName}
              onChange={(e) => setEstimateName(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSaveEstimate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
