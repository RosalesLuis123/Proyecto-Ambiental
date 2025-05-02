import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Map from '../components/Map.jsx'
import ReportForm from '../components/ReportForm.jsx'
import axios from 'axios'

export default function MainPage() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [showAlerts, setShowAlerts] = useState(false)

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/alerts')
      setAlerts(response.data)
    } catch (error) {
      console.error('Error al obtener alertas:', error)
    }
  }

  const generateAlert = async () => {
    try {
      await axios.get('http://localhost:5000/api/alerts/detect')
      fetchAlerts() // Actualizar alertas tras generar una nueva
    } catch (error) {
      console.error('Error al generar alerta:', error)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-1/3 p-4 report-form-container text-white overflow-auto">
          <ReportForm selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
          <div className="mt-4 space-y-2">
            <button
              onClick={generateAlert}
              className="w-full bg-green-800 text-white py-2 rounded-lg hover:bg-green-900"
            >
              Generar Alerta
            </button>
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="w-full bg-green-800 text-white py-2 rounded-lg hover:bg-green-900"
            >
              {showAlerts ? 'Ocultar Alertas' : 'Ver Alertas'}
            </button>
          </div>
          {showAlerts && (
            <div className="mt-4">
              <h3 className="text-lg font-bold text-gray-200 mb-2">Alertas</h3>
              {alerts.length === 0 ? (
                <p className="text-gray-200">No hay alertas</p>
              ) : (
                <table className="w-full text-gray-200">
                  <thead>
                    <tr>
                      <th className="text-left px-2 py-1">Tipo</th>
                      <th className="text-left px-2 py-1">Confianza</th>
                      <th className="text-left px-2 py-1">Ubicación</th>
                      <th className="text-left px-2 py-1">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map((alert) => (
                      <tr key={alert.id}>
                        <td className="px-2 py-1">{alert.type}</td>
                        <td className="px-2 py-1">{(alert.confidence * 100).toFixed(2)}%</td>
                        <td className="px-2 py-1">
                          {alert.location.coordinates[1].toFixed(4)}, {alert.location.coordinates[0].toFixed(4)}
                        </td>
                        <td className="px-2 py-1">{new Date(alert.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
        <div className="w-2/3">
          <Map selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} alerts={alerts} setAlerts={setAlerts} />
        </div>
      </div>
    </div>
  )
}