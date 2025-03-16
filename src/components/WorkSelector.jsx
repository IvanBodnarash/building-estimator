import { useEffect, useState } from "react";
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

  const handleCategoryClick = (category, event) => {
    event.stopPropagation();
    setActiveCategory((prevCategory) =>
      prevCategory === category ? null : category
    );
  };

  return (
    <div className="relative w-full">
      <Menu as="div" className="relative inline-block text-left w-full">
        <MenuButton className="border rounded md:p-2 p-1 w-full flex justify-between items-center text-left bg-white shadow-sm">
          {row.workName || "Select Work"}
          <ChevronRightIcon className="lg:w-5 lg:h-5 w-3 h-3 ml-2 text-gray-400" />
        </MenuButton>

        <Transition
          as={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute mt-1 bg-white shadow-lg border max-w-96 max-h-120 overflow-auto z-50"
        >
          <div className="flex">
            <div className="md:w-68 w-full border-r">
              {categories.map((category) => (
                <div
                  key={category.category}
                  onClick={(event) =>
                    handleCategoryClick(category.category, event)
                  }
                  onMouseEnter={() =>
                    !isMobile && setActiveCategory(category.category)
                  }
                  className="px-3 py-2 w-full flex font-bold justify-between items-center cursor-pointer hover:bg-blue-100 text-gray-900"
                >
                  {category.translations?.[estimateLanguage] ||
                    category.category}
                  <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                </div>
              ))}
            </div>

            {activeCategory && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="w-full bg-white shadow-lg"
              >
                {works
                  .filter((work) => work.category === activeCategory)
                  .map((work) => (
                    <div
                      key={work.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleWorkSelect(row.id, work.id);
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        handleWorkSelect(row.id, work.id);
                      }}
                      className="w-68 px-3 py-2 cursor-pointer hover:bg-blue-200 text-gray-900"
                    >
                      {work.translations?.[estimateLanguage] || work.name}
                    </div>
                  ))}
              </motion.div>
            )}
          </div>
        </Transition>
      </Menu>
    </div>
  );
}
