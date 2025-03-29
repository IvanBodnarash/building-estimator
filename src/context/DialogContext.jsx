import { motion, AnimatePresence } from "framer-motion";
import { createContext, useCallback, useContext, useState } from "react";

const DialogContext = createContext();

export function DialogProvider({ children }) {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    message: "",
    type: "alert",
    resolve: null,
  });

  const showDialog = useCallback(
    ({ message, type = "alert" || "error", duration = 5000 }) => {
      return new Promise((resolve) => {
        setDialogState({ isOpen: true, message, type, resolve });
        if (type === "alert" || "error") {
          setTimeout(() => {
            setDialogState({
              isOpen: false,
              message: "",
              type,
              resolve: null,
            });
          }, duration);
        }
      });
    },
    []
  );
  const handleConfirm = () => {
    if (dialogState.resolve) {
      dialogState.resolve(true);
    }
    setDialogState({
      isOpen: false,
      message: "",
      type: "confirm",
      resolve: null,
    });
  };

  const handleCancel = () => {
    if (dialogState.resolve) {
      dialogState.resolve(false);
    }
    setDialogState({
      isOpen: false,
      message: "",
      type: "confirm",
      resolve: null,
    });
  };

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      <AnimatePresence>
        {dialogState.isOpen && (
          <>
            {dialogState.type === "confirm" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
              >
                <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                  <p className="mb-4">{dialogState.message}</p>
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400 cursor-pointer"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                      onClick={handleConfirm}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            {dialogState.type === "alert" && (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed bottom-8 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg z-[9999]"
              >
                <h2 className="lg:text-xl md:text-lg sm:text-md text-sm font-bold opacity-80">
                  {dialogState.message}
                </h2>
              </motion.div>
            )}
            {dialogState.type === "error" && (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed bottom-8 right-4 bg-red-600 text-white p-3 rounded-lg shadow-lg z-[9999]"
              >
                <h2 className="lg:text-xl md:text-lg sm:text-md text-sm font-bold opacity-80">
                  {dialogState.message}
                </h2>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
