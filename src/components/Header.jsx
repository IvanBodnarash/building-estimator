import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { IoSettingsSharp } from "react-icons/io5";

import "./Header.css";

export default function Header() {
  const { interfaceLanguage, setInterfaceLanguage, t } =
    useContext(LanguageContext);

  return (
    <div className="flex flex-row gap-4 justify-between items-center lg:mx-38 md:mx-24 sm:mx-14 mx-4 md:px-8 sm:px-4 px-2 sm:py-4 py-2 border-x border-gray-700">
      <div className="flex flex-row justify-center items-center">
        <img src="../../public/icon.png" alt="logo" className="md:w-14 sm:w-12 w-8" />
        <h1 className="lg:text-2xl md:text-xl sm:text-lg text-sm font-bold italic text-slate-800">
          building estimator 1.0
        </h1>
      </div>
      <div className="flex flex-row justify-center items-center gap-4">
        <NavLink
          to="/"
          className={`uppercase md:text-[16px] sm:text-[14px] text-[12px] ${({
            isActive,
          }) => (isActive ? "active" : "")}`}
        >
          {t("home")}
        </NavLink>
        <NavLink
          to="/settings"
          className={`uppercase md:text-[16px] sm:text-[14px] text-[12px] ${({
            isActive,
          }) => (isActive ? "active" : "")}`}
        >
          <IoSettingsSharp
            size={20}
            className="hover:text-slate-600 hover:scale-110 hover:rotate-90 transition-all ease-in-out"
          />
        </NavLink>
        <select
          className="text-slate-800 cursor-pointer outline-none md:text-[16px] sm:text-[14px] text-[12px]"
          name="language"
          id="lang"
          value={interfaceLanguage}
          onChange={(e) => setInterfaceLanguage(e.target.value)}
        >
          <option value="en">EN</option>
          <option value="es">ES</option>
          <option value="uk">UK</option>
          <option value="ru">RU</option>
        </select>
      </div>
    </div>
  );
}
