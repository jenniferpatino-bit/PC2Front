import { useEffect, useState } from 'react'
import { api, errorCode } from '../api/client'
import type { Ticket } from '../api/types'
import Button from '../components/Button'
import StatusBadge from '../components/StatusBadge'

export default function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<Record<number, string>>({})

  useEffect(() => {
    api.get<Ticket[]>('/me/tickets').then((res) => setTickets(res.data)).finally(() => setLoading(false))
  }, [])

  const close = async (id: number) => {
    setErrors((prev) => ({ ...prev, [id]: '' }))
    try {
      const { data } = await api.patch<Ticket>(`/tickets/${id}/close`)
      setTickets((prev) => prev.map((t) => (t.id === id ? data : t)))
    } catch (err) {
      const msg = errorCode(err) === 'INVALID_STATE' ? 'La solicitud ya está cerrada.' : 'No se pudo cerrar'
      setErrors((prev) => ({ ...prev, [id]: msg }))
    }
  }

  if (loading) return <p className="text-gray-500">Cargando...</p>

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Mis solicitudes</h1>
      {tickets.length === 0 && <p>Aún no tienes solicitudes.</p>}
      <ul className="flex flex-col gap-3">
        {tickets.map((t) => (
          <li key={t.id} className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <span className="font-semibold">#{t.id} · {t.resourceName}</span>
              <StatusBadge status={t.status} />
            </div>
            <p className="my-2 text-gray-700">{t.description}</p>
            <Button onClick={() => close(t.id)} disabled={t.status === 'CLOSED'}>Cerrar solicitud</Button>
            {errors[t.id] && <p className="mt-1 text-sm text-red-600">{errors[t.id]}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}
