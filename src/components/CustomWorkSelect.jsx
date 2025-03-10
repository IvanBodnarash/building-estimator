import { useContext, useState } from "react";
import { categories } from "../db/categoriesDB";
import { LanguageContext } from "../context/LanguageContext";

export default function CustomWorkSelect({ works, selectedWorkId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverCategory, setHoverCategory] = useState(null);
  const { estimateLanguage, t } = useContext(LanguageContext);

  const categorizedWorks = works.reduce((acc, work) => {
    const category = work.category || "Other Works";
    if (!acc[category]) acc[category] = [];
    acc[category].push(work);
    return acc;
  }, {});

  const selectedWork = works.find((work) => work.id === selectedWorkId);
  const selectedWorkName =
    selectedWork?.translations?.[estimateLanguage] ||
    selectedWork?.name ||
    t("selectWork");

  return (
    <div className="relative inline-block text-left w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border rounded p-2 text-left justify-between items-center"
      >
        <span>{selectedWorkName}</span>
        <span className="ml-2">&#9662;</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-white border rounded z-999 flex">
          <div className="w-1/3 border-r overflow-auto max-h-64">
            {Object.keys(categorizedWorks).map((categoryKey) => {
              const categoryTranslation =
                categories.find((cat) => cat.category === categoryKey)
                  ?.translations?.[estimateLanguage] || categoryKey;

              return (
                <div
                  key={categoryKey}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onMouseEnter={() => setHoverCategory(categoryKey)}
                >
                  {categoryTranslation}
                </div>
              );
            })}
          </div>

          <div className="w-2/3 overflow-auto max-h-64">
            {hoverCategory &&
              categorizedWorks[hoverCategory]?.map((work) => (
                <div
                  key={work.id}
                  className="p-2 hover:bg-gray-300 cursor-pointer"
                  onClick={() => {
                    onSelect(work.id);
                    setIsOpen(false);
                  }}
                >
                  {work.translations?.[estimateLanguage] ||
                    work.name ||
                    "Unnamed Work"}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
