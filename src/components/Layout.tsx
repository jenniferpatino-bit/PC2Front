import { Link, Outlet, useNavigate } from 'react-router-dom'
import { TOKEN_KEY } from '../api/client'

export default function Layout() {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    navigate('/login')
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <nav className="mx-auto flex max-w-4xl items-center gap-4 p-4">
          <span className="font-bold text-blue-700">AulaSoporte</span>
          <Link to="/locations" className="text-gray-700 hover:underline">Espacios</Link>
          <Link to="/me/tickets" className="text-gray-700 hover:underline">Mis solicitudes</Link>
          <button onClick={logout} className="ml-auto rounded bg-gray-800 px-3 py-1 text-white">Cerrar sesión</button>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl p-4">
        <Outlet />
      </main>
    </div>
  )
}
