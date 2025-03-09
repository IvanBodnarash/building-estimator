import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainPage from "./pages/MainPage";
import NewEstimate from "./pages/NewEstimate";

import MainLayout from "./components/MainLayout";
import EstimatePage from "./pages/EstimatePage";
import { LanguageProvider } from "./context/LanguageContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <div>404</div>,
    children: [
      { path: "", element: <MainPage /> },
      // { path: "create-new", element: <NewEstimate />, },
      { path: "estimate/:estimateId", element: <NewEstimate /> },
    ],
  },
]);

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}
