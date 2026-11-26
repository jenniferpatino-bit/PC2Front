import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Location, Page } from '../api/types'
import Pagination from '../components/Pagination'
import StatusBadge from '../components/StatusBadge'

export default function Locations() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<Page<Location> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    api.get<Page<Location>>('/locations', { params: { page, size: 5 } }).then((res) => setData(res.data))
      .catch(() => setError('No se pudo cargar el listado'))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Espacios del campus</h1>
      {loading && <p className="text-gray-500">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && data && data.items.length === 0 && <p>No hay espacios registrados.</p>}
      {!loading && data && data.items.length > 0 && (
        <ul className="flex flex-col gap-3">
          {data.items.map((loc) => (
            <li key={loc.id}>
              <Link to={`/locations/${loc.id}`} className="block rounded-lg bg-white p-4 shadow hover:bg-blue-50">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{loc.name}</span>
                  <StatusBadge status={loc.status} />
                </div>
                <p className="text-sm text-gray-600">{loc.building} · Piso {loc.floor}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {data && data.totalPages > 0 && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}
    </section>
  )
}
