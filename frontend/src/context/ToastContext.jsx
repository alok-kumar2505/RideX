import React, { createContext, useContext, useState, useEffect } from "react";

export const ToastContext = createContext(null);

let toastListener = null;

export const toast = {
  success: (message, duration = 4000) => {
    if (toastListener) {
      toastListener({ type: "success", message, duration });
    }
  },
  error: (message, duration = 4000) => {
    if (toastListener) {
      toastListener({ type: "error", message, duration });
    }
  },
  info: (message, duration = 4000) => {
    if (toastListener) {
      toastListener({ type: "info", message, duration });
    }
  },
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return { toast };
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastListener = (newToast) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 7);
      const toastItem = { id, ...newToast };

      setToasts((prev) => [...prev, toastItem]);

      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, newToast.duration || 4000);

      return () => clearTimeout(timer);
    };

    return () => {
      toastListener = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}

      {/* Floating Toast Container */}
      <div className="fixed top-5 right-5 sm:top-6 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-[90%] sm:w-80 pointer-events-none">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border bg-white animate-toast transition-all ${
              item.type === "success"
                ? "border-emerald-200 shadow-emerald-500/10"
                : item.type === "error"
                ? "border-red-200 shadow-red-500/10"
                : "border-blue-200 shadow-blue-500/10"
            }`}
          >
            {item.type === "success" && (
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <i className="ri-checkbox-circle-fill text-base"></i>
              </span>
            )}
            {item.type === "error" && (
              <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <i className="ri-error-warning-fill text-base"></i>
              </span>
            )}
            {item.type === "info" && (
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <i className="ri-information-fill text-base"></i>
              </span>
            )}

            <div className="flex-1 min-w-0">
              {item.title && (
                <p className="text-xs font-bold uppercase tracking-wider mb-0.5 text-gray-500">
                  {item.title}
                </p>
              )}
              <p className="text-sm text-gray-800 font-medium leading-snug break-words">
                {item.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(item.id)}
              className="text-gray-400 hover:text-gray-700 transition cursor-pointer p-0.5 shrink-0 ml-1"
              title="Dismiss"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;

