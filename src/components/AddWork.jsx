import { useContext, useEffect, useState } from "react";
import { db } from "../db/db";
// import standardWorksDB from "../db/standardWorksDB";
import { categories } from "../db/categoriesDB";

import classes from "./AddWork.module.css";
import { LanguageContext } from "../context/LanguageContext";
import standardWorksDB from "../db/standardWorksDB";

export default function AddWorkForm({
  onWorkAdded,
  editingWork,
  setEditingWork,
}) {
  const { t, interfaceLanguage } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const [workName, setWorkName] = useState("");
  const [category, setCategory] = useState("");
  const [formula, setFormula] = useState("a * U");
  const [unit, setUnit] = useState("m2");
  const [works, setWorks] = useState([]);
  const [priceForUnit, setPriceForUnit] = useState();
  const [variables, setVariables] = useState([]);
  const [translations, setTranslations] = useState({
    en: "",
    es: "",
    uk: "",
    ru: "",
  });

  const langTranslations = t("language");

  // const categories = [...new Set(categories.map((work) => work.category))];

  useEffect(() => {
    if (unit === "m2" || unit === "hr" || unit === "m3") {
      setFormula("a * U");
    } else {
      setFormula("");
    }
  }, [unit]);

  // useEffect(() => {
  //   const loadWorks = async () => {
  //     const savedWorks = await db.works.toArray();
  //     if (savedWorks.length === 0) {
  //       await db.works.bulkAdd(standardWorksDB);
  //     }
  //     setWorks(savedWorks);
  //   };

  //   loadWorks();
  //   console.log(db);
  // }, []);

  const toggleComponentOpening = () => {
    setIsOpen((prev) => !prev);
  };

  const handleTranslationChange = (lang, value) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: value,
    }));
  };

  const exactVariables = (formula) => {
    const matches = formula.match(/[a-zA-Z]+/g) || [];
    return [...new Set(matches)];
  };

  const handleFormulaChange = (e) => {
    const newFormula = e.target.value;
    setFormula(newFormula);
    setVariables(exactVariables(newFormula));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!workName.trim() || !formula.trim()) return;

    const filledTranslations = Object.values(translations).filter(
      (t) => t.trim() !== ""
    );

    const defaultTranslations =
      filledTranslations.length > 0 ? filledTranslations[0] : workName;
    const updatedTranslations = Object.fromEntries(
      Object.entries(translations).map(([lang, value]) => [
        lang,
        value.trim() || defaultTranslations,
      ])
    );

    if (editingWork) {
      await db.works.update(editingWork.id, {
        name: workName,
        category,
        formula,
        unit,
        priceForUnit,
        translations: updatedTranslations,
        variables,
      });
    } else {
      const newWork = {
        name: workName,
        category,
        formula,
        unit,
        priceForUnit,
        translations: updatedTranslations,
        variables,
      };
      const id = await db.works.add(newWork);
      setWorks((prevWorks) => [...prevWorks, { ...newWork, id }]);
    }

    setWorkName("");
    setFormula("a * U");
    setUnit("m2");
    setPriceForUnit("");
    setVariables([]);
    setEditingWork(null);
    setCategory("");
    setTranslations({ en: "", es: "", uk: "", ru: "" });

    if (onWorkAdded) {
      onWorkAdded();
    }
  };

  return (
    <>
      <button
        className="bg-cyan-900 p-4 opacity-80 text-white cursor-pointer w-42 rounded-md"
        onClick={toggleComponentOpening}
      >
        {isOpen ? `${t("collapsed")}` : `${t("addWork")}`}
      </button>
      {isOpen && (
        <div
          className={`p-4 border border-slate-500 bg-white mt-4 ${
            isOpen ? classes.open : classes.close
          }`}
        >
          <h2 className="text-xl font-bold mb-4 opacity-70">{t("addWork")}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-row justify-between gap-4">
              <div className="flex flex-col gap-2 w-full">
                <label className="opacity-70" htmlFor="workName">
                  {t("workName")}
                </label>
                <input
                  type="text"
                  id="workName"
                  placeholder={t("workName")}
                  className="border p-2 w-full opacity-80"
                  value={workName}
                  onChange={(e) => setWorkName(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="opacity-70" htmlFor="unit">
                  {t("category")}
                </label>
                <select
                  className="border h-10 cursor-pointer opacity-80"
                  name="category"
                  id=""
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option className="" value="">{t("selectCategory")}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.category}>
                      {category.translations[interfaceLanguage]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="opacity-70" htmlFor="unit">
                  {t("unit")}
                </label>
                <select
                  className="border h-10 cursor-pointer opacity-80"
                  name="unit"
                  id=""
                  onChange={(e) => setUnit(e.target.value)}
                  required
                >
                  <option value="m2">m2</option>
                  <option value="m3">m3</option>
                  <option value="hr">hr</option>
                  <option value="custom">{t("custom")}</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label className="opacity-70" htmlFor="formula">
                  {t("formula")}
                </label>
                <input
                  type="text"
                  id="formula"
                  placeholder="Formula (e.g: a * U)"
                  className="border p-2 w-full opacity-80"
                  value={formula}
                  onChange={handleFormulaChange}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label className="opacity-70" htmlFor="priceForUnit">
                  {t("priceForUnit")} (U)
                </label>
                <input
                  type="text"
                  id="priceForUnit"
                  placeholder="Price For Unit"
                  className="border p-2 w-full opacity-80"
                  value={priceForUnit}
                  onChange={(e) => setPriceForUnit(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-bold opacity-80">{t("translations")}</h3>

              <div className="flex flex-row gap-4 justify-between">
                {Object.keys(translations).map((lang) => (
                  <div key={lang} className="flex flex-col">
                    <label className="opacity-70 mb-2">
                      {langTranslations[lang]}
                    </label>
                    <input
                      type="text"
                      className="w-64 border p-2 opacity-80"
                      placeholder={`${t("workName")} (${t(`${lang}`)})`}
                      value={translations[lang]}
                      onChange={(e) =>
                        handleTranslationChange(lang, e.target.value)
                      }
                      autoComplete="off"
                    />
                  </div>
                ))}
              </div>
            </div>

            {variables.length > 0 && (
              <div className="mt-2 p-2 bg-gray-200 rounded">
                <h3 className="font-bold opacity-70">Variables found:</h3>
                <p className="opacity-70">{variables.join(", ")}</p>
              </div>
            )}

            <button
              type="submit"
              className="bg-cyan-900 text-white p-2 rounded w-full cursor-pointer hover:bg-cyan-700 hover:shadow-2xl transition-all opacity-80"
            >
              {t("save")}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
