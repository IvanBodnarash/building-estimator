import { useEffect, useMemo, useState } from "react";
import { Menu, MenuButton, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export default function WorkSelector({
  works,
  categories,
  estimateLanguage,
  handleWorkSelect,
  row,
}) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const defaultCategory = useMemo(() => {
    return categories.length ? categories[0].category : null;
  }, [categories]);

  const currentCategory = activeCategory || defaultCategory;

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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute mt-1 bg-gray-50 shadow-lg border max-h-120 overflow-auto z-50 rounded-b-xl"
        >
          <div className="flex">
            <div className="border-r">
              {categories.map((category) => (
                <div
                  key={category.category}
                  onClick={(event) =>
                    handleCategoryClick(category.category, event)
                  }
                  onMouseEnter={() => {
                    if (!isMobile) setActiveCategory(category.category);
                  }}
                  onTouchStart={(e) => {
                    if (isMobile) {
                      e.preventDefault();
                      handleCategoryClick(category.category, e);
                    }
                  }}
                  className="px-3 py-2 md:min-w-64 min-w-38 flex font-bold justify-between items-center cursor-pointer hover:bg-blue-100 text-gray-900"
                >
                  {category.translations?.[estimateLanguage] ||
                    category.category}
                  <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                </div>
              ))}
            </div>

            {currentCategory && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className=" bg-cyan-800 text-slate-200 shadow-lg"
              >
                {(() => {
                  const currentCategoryObj = works.find(
                    (cat) => cat.category === currentCategory
                  );
                  return currentCategoryObj?.works.map((work) => (
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
                })()}
              </motion.div>
            )}
          </div>
        </Transition>
      </Menu>
    </div>
  );
}
