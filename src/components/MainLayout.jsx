import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div className="px-34 bg-slate-100 h-full">
      <Header />
      <Outlet />
    </div>
  );
}
