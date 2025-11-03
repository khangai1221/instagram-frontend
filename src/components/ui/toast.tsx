// src/components/ui/Toaster.tsx
"use client";

import * as Toast from "@radix-ui/react-toast";
import { createContext, useContext, useState, ReactNode } from "react";

type ToastContextType = {
  notify: (
    title: string,
    description?: string,
    variant?: "default" | "destructive"
  ) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastList, setToastList] = useState<
    { id: number; title: string; description?: string; variant?: string }[]
  >([]);

  const notify = (
    title: string,
    description?: string,
    variant: "default" | "destructive" = "default"
  ) => {
    const id = Date.now();
    setToastList((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToastList((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <Toast.Provider swipeDirection="right">
        {toastList.map((t) => (
          <Toast.Root
            key={t.id}
            className={`${
              t.variant === "destructive" ? "bg-red-600" : "bg-gray-800"
            } text-white p-4 rounded shadow-md`}
          >
            <Toast.Title>{t.title}</Toast.Title>
            {t.description && (
              <Toast.Description>{t.description}</Toast.Description>
            )}
          </Toast.Root>
        ))}
        <Toast.Viewport className="fixed bottom-0 right-0 p-4 space-y-2" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
