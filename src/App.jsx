import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainPage from "./pages/MainPage";
import NewEstimate from "./pages/NewEstimate";

import MainLayout from "./components/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <div>404</div>,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "/create-new", element: <NewEstimate /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
