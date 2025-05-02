import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <nav className="bg-green-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Monitoreo Ambiental</h1>
        <div className="space-x-4">
          <Link to="/alerts" className="hover:text-gray-300">Ver Alertas</Link>
          <Link to="/report" className="hover:text-gray-300">Enviar Reporte</Link>
          <Link to="/reports" className="hover:text-gray-300">Ver Reportes</Link>
          <button onClick={handleLogout} className="hover:text-gray-300">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  )
}