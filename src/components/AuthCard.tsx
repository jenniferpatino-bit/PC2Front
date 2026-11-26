import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
}

export default function AuthCard({ title, children }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold">{title}</h1>
        {children}
      </div>
    </div>
  )
}
