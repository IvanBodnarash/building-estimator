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

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // const handleCategoryClick = (category, event) => {
  //   event.stopPropagation();
  //   setActiveCategory((prevCategory) =>
  //     prevCategory === category ? null : category
  //   );
  // };

  const defaultCategory = useMemo(() => {
    return categories.length ? categories[0].category : null;
  }, [categories]);

  const currentCategory = activeCategory || defaultCategory;

  const handleCategoryClick = (category, event) => {
    event.stopPropagation();
    setActiveCategory(category);
  };

  return (
    <div className="relative w-full">
      <Menu as="div" className="relative inline-block text-left w-full">
        <MenuButton className="border rounded md:p-2 p-1 flex justify-between items-center text-left bg-white shadow-sm">
          {row.workName || "Select Work"}
          <ChevronRightIcon className="lg:w-5 lg:h-5 w-3 h-3 ml-2 text-gray-400" />
        </MenuButton>

        <Transition
          as={motion.div}
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
                    if (!isMobile) setActiveCategory(cat.category);
                  }}
                  className="px-3 py-2 min-w-64 flex font-bold justify-between items-center cursor-pointer hover:bg-blue-100 text-gray-900"
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
                        e.preventDefault();
                        e.stopPropagation();
                        handleWorkSelect(row.id, work.id);
                      }}
                      onTouchStart={() => {
                        // e.preventDefault();
                        handleWorkSelect(row.id, work.id);
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
