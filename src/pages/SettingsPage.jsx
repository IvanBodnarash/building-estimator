import React, { useEffect, useState, useContext } from "react";
import { db } from "../db/db";
import { LanguageContext } from "../context/LanguageContext";
// import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin2Fill } from "react-icons/ri";

export default function Settings() {
  const { t, interfaceLanguage } = useContext(LanguageContext);
  const [categoriesWorks, setCategoriesWorks] = useState([]);

  const loadWorks = async () => {
    try {
      const allRecords = await db.works.toArray();
      setCategoriesWorks(allRecords);
    } catch (error) {
      console.error("Error loading works:", error);
    }
  };

  useEffect(() => {
    loadWorks();
  }, []);

  const handleDeleteWork = async (categoryId, workId) => {
    if (
      window.confirm(
        t("deleteWorkConfirmation") ||
          "Are you sure you want to delete this work?"
      )
    ) {
      try {
        const categoryRecord = categoriesWorks.find(
          (cat) => cat.id === categoryId
        );
        if (!categoryRecord) return;
        const updatedWorks = categoryRecord.works.filter(
          (work) => work.id !== workId
        );
        await db.works.update(categoryId, { works: updatedWorks });
        loadWorks();
      } catch (error) {
        console.error("Error deleting work:", error);
      }
    }
  };

  // const handleEditWork = async (categoryId, work) => {
  //   const newName = prompt(
  //     t("enterNewName") || "Enter new work name:",
  //     work.workName || work.name
  //   );
  //   if (newName && newName.trim() !== "") {
  //     const updatedWork = { ...work, workName: newName };
  //     try {
  //       const categoryRecord = categoriesWorks.find(
  //         (cat) => cat.id === categoryId
  //       );
  //       if (!categoryRecord) return;
  //       const updatedWorks = categoryRecord.works.map((w) =>
  //         w.id === work.id ? updatedWork : w
  //       );
  //       await db.works.update(categoryId, { works: updatedWorks });
  //       loadWorks();
  //     } catch (error) {
  //       console.error("Error updating work:", error);
  //     }
  //   }
  // };

  const handleClearDB = async () => {
    if (
      window.confirm(
        t("clearDatabaseConfirmation") ||
          "Are you sure you want to clear the entire database?"
      )
    ) {
      try {
        await db.delete();
        alert(t("databaseCleared") || "Database cleared!");
        window.location.reload();
      } catch (error) {
        console.error("Error clearing database:", error);
      }
    }
  };

  return (
    <div className="lg:mx-38 md:mx-24 sm:mx-14 mx-4 border-x border-gray-700 px-4 py-8 overflow-hidden relative">
      <h1 className="lg:text-2xl md:text-lg sm:text-base text-sm font-bold mb-4">
        {t("settings") || "Settings"}
      </h1>
      <p className="mb-4 text-slate-500 lg:text-md md:text-sm sm:text-xs text-xs">
        This page is a work in progress, it will be updated in the future
      </p>
      <button
        onClick={handleClearDB}
        className="bg-red-500 text-white lg:text-md md:text-sm sm:text-xs text-xs py-2 px-4 rounded mb-4 hover:bg-red-600 transition-colors cursor-pointer"
      >
        {t("clearDatabase") || "Clear Database"}
      </button>

      {categoriesWorks.length === 0 ? (
        <div className="h-screen">{t("noWorks") || "No works available"}</div>
      ) : (
        categoriesWorks.map((category) => (
          <div key={category.id} className="mb-6 border p-4 rounded overflow-x-auto">
            <h2 className="lg:text-xl md:text-lg sm:text-base text-sm font-bold mb-2">
              {category.translations?.[interfaceLanguage] || category.category}
            </h2>
            <table className="w-full min-w-max border-collapse lg:text-lg md:text-md sm:text-sm text-xs">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">{t("workName") || "Work Name"}</th>
                  <th className="border p-2">{t("formula") || "Formula"}</th>
                  <th className="border p-2">{t("unit") || "Unit"}</th>
                  <th className="border p-2">
                    {t("priceForUnit") || "Price For Unit"}
                  </th>
                  <th className="border p-2">{t("actions") || "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {category.works && category.works.length > 0 ? (
                  category.works.map((work) => (
                    <tr key={work.id}>
                      <td className="border p-2">
                        {work.translations?.[interfaceLanguage] ||
                          work.workName ||
                          work.name}
                      </td>
                      <td className="border p-2 text-center">{work.formula}</td>
                      <td className="border p-2 text-center">{work.unit}</td>
                      <td className="border p-2 text-center">
                        {work.priceForUnit}
                      </td>
                      <td className="border p-2 text-center">
                        {/* <button
                          onClick={() => handleEditWork(category.id, work)}
                          title={t("edit") || "Edit"}
                        >
                          <MdModeEdit className="text-xl" />
                        </button> */}
                        <button
                          onClick={() => handleDeleteWork(category.id, work.id)}
                          title={t("delete") || "Delete"}
                        >
                          <RiDeleteBin2Fill className="text-xl cursor-pointer text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="">
                    <td className="border p-2 text-center" colSpan="6">
                      {t("noWorks") || "No works available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
