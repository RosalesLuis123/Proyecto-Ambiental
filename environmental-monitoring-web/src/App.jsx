import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'

export default function App() {
  const location = useLocation()
  const isLoggedIn = localStorage.getItem('user')
  const isLoginPage = location.pathname === '/'

  return (
    <div className="flex flex-col h-screen">
      {isLoggedIn && !isLoginPage && <Navbar />}
      <Outlet />
    </div>
  )
}