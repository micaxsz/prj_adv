"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "bg-zinc-900 border-zinc-800 text-zinc-100",
          success: "bg-green-900/50 border-green-800 text-green-100",
          error: "bg-red-900/50 border-red-800 text-red-100",
          warning: "bg-yellow-900/50 border-yellow-800 text-yellow-100",
          info: "bg-blue-900/50 border-blue-800 text-blue-100",
        },
      }}
    />
  );
}
