// import { useState } from "react";
// import {
//   Listbox,
//   ListboxButton,
//   ListboxOption,
//   ListboxOptions,
//   Transition,
// } from "@headlessui/react";
// import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/solid";

// export default function WorkSelector({
//   works,
//   categories,
//   estimateLanguage,
//   handleWorkSelect,
//   row,
// }) {
//   const [selectedWork, setSelectedWork] = useState(null);

//   return (
//     <div className="relative w-full">
//       <Listbox
//         value={selectedWork}
//         onChange={(work) => {
//           setSelectedWork(work);
//           handleWorkSelect(row.id, work.id);
//         }}
//       >
//         <div className="relative">
//           <ListboxButton className="border rounded p-2 w-full flex justify-between items-center bg-white shadow-sm">
//             <span>
//               {selectedWork
//                 ? selectedWork.translations?.[estimateLanguage] ||
//                   selectedWork.name
//                 : "Select Work"}
//             </span>
//             <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
//           </ListboxButton>

//           <Transition
//             leave="transition ease-in duration-100"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <ListboxOptions className="absolute w-full mt-1 bg-white shadow-lg border max-h-60 overflow-auto z-50">
//               {categories.map((category) => (
//                 <div key={category.category}>
//                   <div className="bg-gray-100 px-3 py-1 font-bold text-gray-700">
//                     {category.translations?.[estimateLanguage] ||
//                       category.category}
//                   </div>
//                   {works
//                     .filter((work) => work.category === category.category)
//                     .map((work) => (
//                       <ListboxOption
//                         key={work.id}
//                         value={work}
//                         className={({ active }) =>
//                           `px-3 py-2 flex justify-between items-center cursor-pointer ${
//                             active
//                               ? "bg-blue-100 text-blue-700"
//                               : "text-gray-900"
//                           }`
//                         }
//                       >
//                         {({ selected }) => (
//                           <>
//                             <span>
//                               {work.translations?.[estimateLanguage] ||
//                                 work.name}
//                             </span>
//                             {selected && (
//                               <CheckIcon className="w-5 h-5 text-blue-600" />
//                             )}
//                           </>
//                         )}
//                       </ListboxOption>
//                     ))}
//                 </div>
//               ))}
//             </ListboxOptions>
//           </Transition>
//         </div>
//       </Listbox>
//     </div>
//   );
// }

import { useState } from "react";
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
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div className="relative w-full">
      <Menu as="div" className="relative inline-block text-left w-full">
        <MenuButton className="border rounded p-2 w-full flex justify-between items-center text-left bg-white shadow-sm">
          {row.workName || "Select Work"}
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </MenuButton>

        <Transition
          as={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute mt-1 bg-white shadow-lg border max-w-96 max-h-60 overflow-auto z-50"
        >
          <div className="flex">
            <div className="w-68 border-r">
              {categories.map((category) => (
                <div
                  key={category.category}
                  onMouseEnter={() => setHoveredCategory(category.category)}
                  className="px-3 py-2 flex font-bold justify-between items-center cursor-pointer hover:bg-blue-100 text-gray-900"
                >
                  {category.translations?.[estimateLanguage] ||
                    category.category}
                  <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                </div>
              ))}
            </div>

            {hoveredCategory && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="w-68 bg-white shadow-lg"
              >
                {works
                  .filter((work) => work.category === hoveredCategory)
                  .map((work) => (
                    <div
                      key={work.id}
                      onClick={() => handleWorkSelect(row.id, work.id)}
                      className="px-3 py-2 cursor-pointer hover:bg-blue-200 text-gray-900"
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
