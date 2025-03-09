import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";

export default function Header() {
  const { interfaceLanguage, setInterfaceLanguage, t } =
    useContext(LanguageContext);

  // let language;

  // switch (interfaceLanguage) {
  //   case "en":
  //     language = "HOME";
  //     break;
  //   case "es":
  //     language = "INICIO";
  //     break;
  //   case "uk":
  //     language = "ГОЛОВНА";
  //     break;
  //   case "ru":
  //     language = "ГЛАВНАЯ";
  //     break;
  //   default:
  //     language = "HOME";
  // }

  return (
    <div className="flex flex-row gap-4 justify-between items-center mx-38 px-8 py-6 border-x border-gray-700">
      <h1 className="text-2xl font-normal italic text-slate-800">
        building estimator 1.0
      </h1>
      <div className="flex flex-row gap-4">
        <NavLink to="/" className="uppercase">{t("home")}</NavLink>
        <select
          className="text-slate-800 cursor-pointer outline-none"
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
