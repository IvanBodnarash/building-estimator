import { createContext, useEffect, useState } from "react";
import translations from "../translations/translations";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const storedInterfaceLang = localStorage.getItem("interfaceLanguage") || "ru";
  const storedEstimateLang = localStorage.getItem("estimateLanguage") || "es";

  const [interfaceLanguage, setInterfaceLanguage] =
    useState(storedInterfaceLang);
  const [estimateLanguage, setEstimateLanguage] = useState(storedEstimateLang);

  useEffect(() => {
    localStorage.setItem("interfaceLanguage", interfaceLanguage);
  }, [interfaceLanguage]);

  useEffect(() => {
    localStorage.setItem("estimateLanguage", estimateLanguage);
  }, [estimateLanguage]);

  const t = (key) => translations[interfaceLanguage]?.[key] || key;
  
  const estimateT = (key) => translations[estimateLanguage]?.[key] || key;

  return (
    <LanguageContext.Provider
      value={{
        interfaceLanguage,
        setInterfaceLanguage,
        estimateLanguage,
        setEstimateLanguage,
        t,
        estimateT,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
