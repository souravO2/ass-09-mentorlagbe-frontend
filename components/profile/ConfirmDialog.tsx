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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl border-2 border-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-black">
            Confirm changes?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-gray-600">
            Are you sure you want to update your profile information? Your
            changes will be saved to your account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isSaving}
            className="rounded-full border-2 border-black font-bold"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isSaving}
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            className="rounded-full border-2 border-black bg-[#FFDA3F] font-bold text-black shadow-[3px_3px_0_black] hover:bg-[#f3ce31] hover:shadow-none"
          >
            {isSaving ? "Updating..." : "Yes, save changes"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
