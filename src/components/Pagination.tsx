import Button from './Button'

interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <Button disabled={page <= 1} onClick={() => onChange(page - 1)}>Anterior</Button>
      <span>Página {page} de {totalPages}</span>
      <Button disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Siguiente</Button>
    </div>
  )
}
