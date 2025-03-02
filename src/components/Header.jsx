import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <div className="flex flex-row gap-4 justify-between items-center">
      <h1 className="text-3xl font-black italic">Building Estimator</h1>
      <div className="flex flex-row gap-4">
        <NavLink to="/">Home</NavLink>
        {/* <NavLink to="/create-new">Create New</NavLink> */}
      </div>
    </div>
  );
}
