import { useEffect, useMemo, useState } from "react";
import { Menu, MenuButton, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

import useMobile from "../hooks/useMobile";
import {
  getDefaultCategory,
  getCurrentCategoryObj,
} from "../helpers/workSelectorHelpers";

export default function WorkSelector({
  works,
  categories,
  estimateLanguage,
  handleWorkSelect,
  row,
}) {
  const [activeCategory, setActiveCategory] = useState(null);
  const isMobile = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const defaultCategory = useMemo(
    () => getDefaultCategory(categories),
    [categories]
  );
  const currentCategory = activeCategory || defaultCategory;
  const currentCategoryObj = useMemo(
    () => getCurrentCategoryObj(works, currentCategory),
    [works, currentCategory]
  );

  const handleCategoryClick = (category, event) => {
    if (!isMobile) {
      event.stopPropagation();
    }
    setActiveCategory(category);
  };

  const onWorkSelect = (rowId, workId) => {
    handleWorkSelect(rowId, workId);
    setMenuOpen(false);
  };

  const renderCategoryList = () =>
    categories.map((cat) => (
      <div
        key={cat.category}
        onClick={(e) => handleCategoryClick(cat.category, e)}
        onMouseEnter={() => {
          if (!isMobile) setActiveCategory(cat.category);
        }}
        onTouchStart={(e) => {
          // e.preventDefault();
          handleCategoryClick(cat.category, e);
        }}
        className="px-3 py-2 md:min-w-64 min-w-38 flex font-bold justify-between items-center cursor-pointer hover:bg-blue-100 text-gray-900"
      >
        {cat.translations?.[estimateLanguage] || cat.category}
        <ChevronRightIcon className="w-4 h-4 text-gray-500" />
      </div>
    ));

  const renderWorkList = () => {
    if (!currentCategoryObj || !currentCategoryObj.works) return null;
    return currentCategoryObj.works.map((work) => (
      <div
        key={work.id}
        onClick={(e) => {
          if (!isMobile) {
            e.preventDefault();
            e.stopPropagation();
            onWorkSelect(row.id, work.id);
          }
        }}
        onTouchStart={(e) => {
          if (isMobile) {
            e.preventDefault();
            onWorkSelect(row.id, work.id);
          }
        }}
        className="w-68 px-3 py-2 cursor-pointer hover:bg-cyan-950"
      >
        {work.translations?.[estimateLanguage] || work.name}
      </div>
    ));
  };

  return (
    <div className="relative w-full">
      <Menu as="div" className="relative inline-block text-left w-full">
        <MenuButton
          onClick={() => setMenuOpen((prev) => !prev)}
          className="border rounded md:p-2 p-1 flex justify-between items-center text-left bg-white shadow-sm"
        >
          {row.workName || "Select Work"}
          <ChevronRightIcon className="lg:w-5 lg:h-5 w-3 h-3 ml-2 text-gray-400" />
        </MenuButton>
        <Transition
          as={motion.div}
          show={menuOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          className="absolute mt-1 bg-gray-50 shadow-lg border max-h-120 overflow-auto z-50 rounded-b-xl"
        >
          <div className="flex">
            <div className="border-r">{renderCategoryList()}</div>
            {currentCategory && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-cyan-800 text-slate-200 shadow-lg"
              >
                {renderWorkList()}
              </motion.div>
            )}
          </div>
        </Transition>
      </Menu>
    </div>
  );
}
