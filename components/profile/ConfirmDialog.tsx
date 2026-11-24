"use client"

import { Loader2, UserRound } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type ProfileConfirmDialogProps = {
  open: boolean
  isSaving: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ProfileConfirmDialog({
  open,
  isSaving,
  onOpenChange,
  onConfirm,
}: ProfileConfirmDialogProps) {
  return (
    <AlertDialog
      open={open}
      // Don't let Escape close the dialog mid-save
      onOpenChange={(next) => {
        if (!isSaving) onOpenChange(next)
      }}
    >
      <AlertDialogContent className="gap-0 rounded-3xl border-2 border-black bg-white p-6 text-black shadow-[5px_5px_0_black] sm:max-w-md md:p-8">
        <AlertDialogHeader className="items-start gap-0 text-left sm:text-left">
          <div className="mb-5 grid size-12 place-items-center rounded-full border-2 border-black bg-[#CBB8FF] shadow-[2px_2px_0_black]">
            <UserRound className="size-6" strokeWidth={2.5} />
          </div>

          <AlertDialogTitle className="text-2xl font-black">
            Update your profile?
          </AlertDialogTitle>

          <AlertDialogDescription className="mt-2 text-base text-gray-600">
            Your name, photo, phone, bio and account type will be saved to your
            account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-8 gap-3 sm:space-x-0">
          <AlertDialogCancel
            disabled={isSaving}
            className="mt-0 h-11 cursor-pointer rounded-full border-2 border-black bg-white px-6 font-bold text-black shadow-[3px_3px_0_black] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-100 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isSaving}
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            className="h-11 cursor-pointer rounded-full border-2 border-black bg-[#FFDA3F] px-6 font-bold text-black shadow-[3px_3px_0_black] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#FFDA3F] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Update Profile"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
