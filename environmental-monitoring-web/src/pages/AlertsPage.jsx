import { useState, useEffect } from 'react'
import axios from 'axios'
import Map from '../components/Map.jsx'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([])
  const [error, setError] = useState('')
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/alerts')
        console.log('Alertas obtenidas:', response.data)
        setAlerts(response.data)
      } catch (error) {
        console.error('Error al obtener alertas:', error)
        setError('No se pudieron cargar las alertas')
      }
    }
    fetchAlerts()
  }, [])

  const handleGenerateAlert = async () => {
    try {
      await axios.get('http://localhost:5000/api/alerts/detect')
      const response = await axios.get('http://localhost:5000/api/alerts')
      console.log('Alertas actualizadas:', response.data)
      setAlerts(response.data)
      const newAlert = response.data[response.data.length - 1]
      addNotification(
        `${newAlert.type.charAt(0).toUpperCase() + newAlert.type.slice(1)} Detectado: ` +
        `Confianza ${(newAlert.confidence * 100).toFixed(2)}% en ${newAlert.location.coordinates}`
      )
    } catch (error) {
      console.error('Error al generar alerta:', error)
      setError('No se pudo generar la alerta')
    }
  }

  const addNotification = (message) => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 5000)
  }

  return (
    <div className="container py-6 flex flex-col space-y-6">
      <div className="map-container">
        {error ? (
          <p className="text-red-500">Error al cargar el mapa de alertas</p>
        ) : (
          <Map alerts={alerts} showOnlyAlerts={true} />
        )}
      </div>
      <div className="card bg-green-800 text-white overflow-x-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-200">Alertas de IA</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleGenerateAlert}
          className="btn btn-primary w-full mb-6"
        >
          Generar Nueva Alerta
        </button>
        {alerts.length === 0 ? (
          <p className="text-gray-200">No hay alertas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full table-fixed">
              <thead>
                <tr>
                  <th className="w-1/4">Tipo</th>
                  <th className="w-1/4">Confianza</th>
                  <th className="w-1/4">Ubicación</th>
                  <th className="w-1/4">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.id}>
                    <td className="truncate">{alert.type}</td>
                    <td className="truncate">{(alert.confidence * 100).toFixed(2)}%</td>
                    <td className="truncate">
                      {alert.location.coordinates[1].toFixed(4)}, {alert.location.coordinates[0].toFixed(4)}
                    </td>
                    <td className="truncate">{new Date(alert.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="fixed top-4 left-4 space-y-2 z-50">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-green-900 text-white p-3 rounded-lg shadow-lg max-w-xs animate-fade-in"
          >
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  )
}