import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function FormField({ label, error, id, ...rest }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
      <input id={id} {...rest} className="rounded border border-gray-300 px-3 py-2" />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
