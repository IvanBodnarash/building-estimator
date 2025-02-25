import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div className="px-28 bg-slate-100 h-screen">
      <div>MainLayout</div>
      <Header />
      <Outlet />
    </div>
  );
}
