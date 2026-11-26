import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, TOKEN_KEY } from '../api/client'
import AuthCard from '../components/AuthCard'
import FormField from '../components/FormField'
import Button from '../components/Button'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post<{ token: string }>('/auth/login', { email, password })
      localStorage.setItem(TOKEN_KEY, data.token)
      navigate('/locations')
    } catch {
      setError('Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Iniciar sesión">
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <FormField id="email" label="Correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <FormField id="password" label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</Button>
      </form>
      <p className="mt-4 text-sm">
        ¿No tienes cuenta? <Link to="/register" className="text-blue-600 hover:underline">Regístrate</Link>
      </p>
    </AuthCard>
  )
}
