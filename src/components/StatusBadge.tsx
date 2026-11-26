interface Props {
  status: string
}

export default function StatusBadge({ status }: Props) {
  const color = status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
  return <span className={`rounded px-2 py-0.5 text-xs font-semibold ${color}`}>{status}</span>
}
