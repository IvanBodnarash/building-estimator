import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";

import "./Header.css";

export default function Header() {
  const { interfaceLanguage, setInterfaceLanguage, t } =
    useContext(LanguageContext);

  return (
    <div className="flex flex-row gap-4 justify-between items-center lg:mx-38 md:mx-24 sm:mx-14 mx-6 px-8 py-6 border-x border-gray-700">
      <h1 className="lg:text-2xl md:text-xl sm:text-lg text-sm font-normal italic text-slate-800">
        building estimator 1.0
      </h1>
      <div className="flex flex-row justify-center items-center gap-4">
        <NavLink to="/" className={`uppercase md:text-[16px] sm:text-[14px] text-[12px] ${({ isActive }) => (isActive ? "active" : "")}`}>
          {t("home")}
        </NavLink>
        <NavLink to="/settings" className={`uppercase md:text-[16px] sm:text-[14px] text-[12px] ${({ isActive }) => (isActive ? "active" : "")}`}>
          {t("settings")}
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
        {/* <NavLink to="/create-new">Create New</NavLink> */}
      </div>
    </div>
  );
}
