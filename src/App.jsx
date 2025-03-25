import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainPage from "./pages/MainPage";
import NewEstimate from "./pages/NewEstimate";

import MainLayout from "./components/MainLayout";
import { LanguageProvider } from "./context/LanguageContext";
import SettingsPage from "./pages/SettingsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <div>404</div>,
    children: [
      { path: "", element: <MainPage /> },
      { path: "estimate/:estimateId", element: <NewEstimate /> },
      { path: "settings", element: <SettingsPage /> },
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
