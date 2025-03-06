import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <div className="flex flex-row gap-4 justify-between items-center mx-38 px-8 py-6 border-x border-gray-700">
      <h1 className="text-2xl font-normal italic text-slate-800">
        building estimator 1.0
      </h1>
      <div className="flex flex-row gap-4">
        <NavLink to="/">HOME</NavLink>
        <select className="text-slate-800 cursor-pointer" name="language" id="lang">
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
