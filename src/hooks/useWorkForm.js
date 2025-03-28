import { useEffect, useState } from "react";

export default function useWorkForm() {
  const [workName, setWorkName] = useState("");
  const [category, setCategory] = useState("");
  const [formula, setFormula] = useState("a * U");
  const [unit, setUnit] = useState("m2");
  //   const [works, setWorks] = useState([]);
  const [priceForUnit, setPriceForUnit] = useState("");
  const [variables, setVariables] = useState([]);
  const [translations, setTranslations] = useState({
    en: "",
    es: "",
    uk: "",
    ru: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (["m2", "hr", "m3", "m"].includes(unit)) {
      setFormula("a * U");
    } else {
      setFormula("");
    }
  }, [unit]);

  const exactVariables = (formula) => {
    const matches = formula.match(/[a-zA-Z]+/g) || [];
    return [...new Set(matches)];
  };

  const handleFormulaChange = (e) => {
    const newFormula = e.target.value;
    setFormula(newFormula);
    setVariables(exactVariables(newFormula));
  };

  const handleTranslationChange = (lang, value) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: value,
    }));
  };

  const clearForm = () => {
    setWorkName("");
    setFormula("a * U");
    setUnit("m2");
    setPriceForUnit("");
    setVariables([]);
    setCategory("");
    setTranslations({ en: "", es: "", uk: "", ru: "" });
  };

  return {
    workName,
    setWorkName,
    category,
    setCategory,
    formula,
    setFormula,
    unit,
    setUnit,
    // works,
    // setWorks,
    priceForUnit,
    setPriceForUnit,
    variables,
    setVariables,
    translations,
    setTranslations,
    isSuccess,
    setIsSuccess,
    isOpen,
    setIsOpen,
    handleFormulaChange,
    handleTranslationChange,
    clearForm,
  };
}
