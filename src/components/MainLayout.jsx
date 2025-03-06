import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div className=" bg-slate-100 h-full relative">
      <Header />
      <div className="border-1 border-gray-600 w-full absolute"></div>
      <div
        className="col-start-4 row-span-5 row-start-1 border-x border-gray-600 
              bg-[image:repeating-linear-gradient(315deg,_gray_0,_black_1px,_transparent_0,_transparent_50%)] 
              bg-[size:10px_10px] bg-fixed w-8 h-full absolute top-0 left-24"
      ></div>
      <div
        className="col-start-4 row-span-5 row-start-1 border-x border-gray-600 
              bg-[image:repeating-linear-gradient(315deg,_gray_0,_black_1px,_transparent_0,_transparent_50%)] 
              bg-[size:10px_10px] bg-fixed w-8 h-full absolute top-0 right-24"
      ></div>

      <Outlet />
    </div>
  );
}
