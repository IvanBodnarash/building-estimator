import { useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../db/db";
import { categories } from "../db/categoriesDB";
import { LanguageContext } from "../context/LanguageContext";
import useWorkForm from "../hooks/useWorkForm";
import submitWork from "../helpers/submitWork";

export default function AddWorkForm({
  onWorkAdded,
  editingWork,
  setEditingWork,
}) {
  const { t, interfaceLanguage } = useContext(LanguageContext);
  const {
    workName,
    setWorkName,
    category,
    setCategory,
    formula,
    setFormula,
    unit,
    setUnit,
    priceForUnit,
    setPriceForUnit,
    variables,
    translations,
    isSuccess,
    setIsSuccess,
    isOpen,
    setIsOpen,
    handleFormulaChange,
    handleTranslationChange,
    clearForm,
  } = useWorkForm();

  useEffect(() => {
    if (editingWork) {
      setWorkName(editingWork.workName || "");
      setCategory(editingWork.category || "");
      setFormula(editingWork.formula || "a * U");
      setUnit(editingWork.unit || "m2");
      setPriceForUnit(editingWork.priceForUnit || "");
    }
  }, [
    editingWork,
    setWorkName,
    setCategory,
    setFormula,
    setUnit,
    setPriceForUnit,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workName.trim() || !formula.trim()) return;

    const filledTranslations = Object.values(translations).filter(
      (val) => val.trim() !== ""
    );
    const defaultTrans =
      filledTranslations.length > 0 ? filledTranslations[0] : workName;
    const updatedTranslations = Object.fromEntries(
      Object.entries(translations).map(([lang, value]) => [
        lang,
        value.trim() || defaultTrans,
      ])
    );

    try {
      await submitWork(
        {
          editingWork,
          workName,
          category,
          formula,
          unit,
          priceForUnit,
          updatedTranslations,
          variables,
          categories,
        },
        db
      );
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding/updating work:", error);
    }

    clearForm();
    setEditingWork(null);
    if (onWorkAdded) {
      onWorkAdded();
    }
  };

  return (
    <>
      <button
        className="bg-cyan-900 lg:p-4 md:p-3 p-2 lg:text-[16px] md:text-sm text-xs opacity-80 text-white cursor-pointer lg:w-42 md:w-36 w-32 rounded-md"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? `${t("collapsed")}` : `${t("addWork")}`}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: "auto" }}
            exit={{ opacity: 0, scale: 0.9, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-4 border border-slate-500 bg-white mt-4"
          >
            <h2 className="lg:text-xl md:text-lg sm:text-base text-sm font-bold mb-4 opacity-70">
              {t("addWork")}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 lg:text-lg md:text-md sm:text-sm text-xs"
            >
              <div className="flex flex-row items-end lg:flex-nowrap flex-wrap gap-4">
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

                <div className="flex flex-col gap-2 w-full">
                  <label className="opacity-70" htmlFor="category">
                    {t("category")}
                  </label>
                  <select
                    className="border lg:p-3 p-2 w-full cursor-pointer opacity-80"
                    name="category"
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    value={category}
                  >
                    <option
                      className="lg:text-xl md:text-lg sm:text-sm text-xs"
                      value=""
                    >
                      {t("selectCategory")}
                    </option>
                    {categories.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.category}
                        className="lg:text-xl md:text-lg sm:text-sm text-xs"
                      >
                        {cat.translations[interfaceLanguage]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="opacity-70" htmlFor="unit">
                    {t("unit")}
                  </label>
                  <select
                    className="border lg:p-3 p-2 xl:w-32 w-22 cursor-pointer opacity-80"
                    name="unit"
                    onChange={(e) => setUnit(e.target.value)}
                    required
                    value={unit}
                  >
                    <option value="m2">m2</option>
                    <option value="m3">m3</option>
                    <option value="hr">hr</option>
                    <option value="custom">{t("custom")}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 lg:w-full w-1/2">
                  <label className="opacity-70" htmlFor="formula">
                    {t("formula")}
                  </label>
                  <input
                    type="text"
                    id="formula"
                    placeholder="Formula (e.g: a * U)"
                    className="border p-2 xl:w-full w-22 opacity-80"
                    value={formula}
                    onChange={handleFormulaChange}
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 lg:w-full w-1/2">
                  <label className="opacity-70" htmlFor="priceForUnit">
                    {t("priceForUnit")} (U)
                  </label>
                  <input
                    type="number"
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
                <div className="flex flex-row flex-wrap gap-4 justify-between">
                  {["en", "es", "uk", "ru"].map((lang) => (
                    <div key={lang} className="flex flex-col">
                      <label className="opacity-70 mb-2">{t(lang)}</label>
                      <input
                        type="text"
                        className="w-64 border p-2 opacity-80"
                        placeholder={`${t("workName")} (${t(lang)})`}
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
            {isSuccess && (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg z-[99]"
              >
                <h2 className="lg:text-xl md:text-lg sm:text-md text-sm font-bold opacity-70">
                  {`✅ ${t("savingWorkSuccess")}`}
                </h2>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
