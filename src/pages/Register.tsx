import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, errorCode } from '../api/client'
import AuthCard from '../components/AuthCard'
import FormField from '../components/FormField'
import Button from '../components/Button'

type Errors = Partial<Record<'name' | 'email' | 'password', string>>

function validate(name: string, email: string, password: string): Errors {
  const errors: Errors = {}
  if (name.trim().length < 1 || name.length > 100) errors.name = 'El nombre debe tener de 1 a 100 caracteres'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Correo inválido'
  if (password.length < 8 || password.length > 72) errors.password = 'La contraseña debe tener de 8 a 72 caracteres'
  return errors
}

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError('')
    const v = validate(name, email, password)
    setErrors(v)
    if (Object.keys(v).length > 0) return
    setLoading(true)
    try {
      await api.post('/auth/register', { name: name.trim(), email, password })
      navigate('/login')
    } catch (err) {
      setServerError(errorCode(err) === 'EMAIL_EXISTS' ? 'El correo ya está registrado' : 'No se pudo registrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Registro">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
        <FormField id="name" label="Nombre" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <FormField id="email" label="Correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <FormField id="password" label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        <Button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrarme'}</Button>
      </form>
      <p className="mt-4 text-sm">
        ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión</Link>
      </p>
    </AuthCard>
  )
}
