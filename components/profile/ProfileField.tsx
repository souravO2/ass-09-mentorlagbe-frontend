import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type ProfileFieldProps = {
  id: string
  label: string
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  multiline?: boolean
}

export function ProfileField({
  id,
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  multiline = false,
}: ProfileFieldProps) {
  const className = readOnly
    ? "border-black bg-muted"
    : "border-black bg-white focus-visible:ring-[#CBB8FF]"

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="font-bold">
        {label}
      </Label>

      {multiline ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          rows={5}
          className={`resize-y rounded-xl border-2 ${className}`}
        />
      ) : (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`h-12 rounded-xl border-2 ${className}`}
        />
      )}
    </div>
  )
}
