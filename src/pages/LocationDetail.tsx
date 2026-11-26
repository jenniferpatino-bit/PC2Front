import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, errorCode } from '../api/client'
import type { Location, Ticket } from '../api/types'
import Button from '../components/Button'
import StatusBadge from '../components/StatusBadge'

export default function LocationDetail() {
  const { id } = useParams()
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [description, setDescription] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [created, setCreated] = useState<Ticket | null>(null)
  const [sending, setSending] = useState(false)

  const load = useCallback(() => {
    return api.get<Location>(`/locations/${id}`).then((res) => setLocation(res.data))
      .catch((err) => setLoadError(errorCode(err) === 'NOT_FOUND' ? 'Espacio no encontrado' : 'No se pudo cargar'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setCreated(null)
    const text = description.trim()
    if (text.length < 10 || text.length > 200) {
      setFieldError('La descripción debe tener de 10 a 200 caracteres')
      return
    }
    setFieldError('')
    setSending(true)
    try {
      const { data } = await api.post<Ticket>(`/locations/${id}/tickets`, { description: text })
      setCreated(data)
      setDescription('')
      await load()
    } catch (err) {
      const closed = errorCode(err) === 'LOCATION_CLOSED'
      setSubmitError(closed ? 'El espacio está cerrado y no admite nuevas solicitudes.' : 'No se pudo registrar la solicitud')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <p className="text-gray-500">Cargando...</p>
  if (loadError || !location) return <p className="text-red-600">{loadError}</p>

  return (
    <section className="flex flex-col gap-4">
      <Link to="/dashboard" className="text-blue-600 hover:underline">← Volver al dashboard</Link>
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{location.name}</h1>
          <StatusBadge status={location.status} />
        </div>
        <p className="text-gray-600">{location.building} · Piso {location.floor}</p>
        <p className="mt-2">{location.description}</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow">
        <label htmlFor="description" className="font-medium">Describe el problema</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="rounded border border-gray-300 px-3 py-2"
        />
        {fieldError && <p className="text-sm text-red-600">{fieldError}</p>}
        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        <Button type="submit" disabled={sending}>{sending ? 'Enviando...' : 'Crear solicitud'}</Button>
      </form>

      {created && (
        <div className="rounded-lg border border-green-300 bg-green-50 p-4">
          <p className="font-semibold text-green-800">Solicitud #{created.id} creada</p>
          <p>{created.resourceName}: {created.description}</p>
          <StatusBadge status={created.status} />
        </div>
      )}
    </section>
  )
}
