"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "!rounded-2xl !border-2 !border-ink !bg-white !text-ink !shadow-hard-sm !font-sans !p-4 !gap-3",
          title: "!font-bold",
          description: "!font-medium !text-ink/80",
          success: "!bg-mint",
          error: "!bg-coral",
          warning: "!bg-lemon",
          info: "!bg-sky",
          actionButton:
            "!rounded-full !border-2 !border-ink !bg-lemon !font-bold !text-ink",
          cancelButton:
            "!rounded-full !border-2 !border-ink !bg-white !font-bold !text-ink",
          closeButton: "!border-2 !border-ink !bg-white !text-ink",
        },
      }}
      {...props}
    />
  )
}
