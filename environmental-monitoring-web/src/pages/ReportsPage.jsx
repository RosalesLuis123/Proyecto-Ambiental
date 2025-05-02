import { useState, useEffect } from 'react'
import axios from 'axios'
import Map from '../components/Map.jsx'

export default function ReportsPage() {
  const [reports, setReports] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reports')
        console.log('Reportes obtenidos:', response.data)
        setReports(response.data)
      } catch (error) {
        console.error('Error al obtener reportes:', error)
        setError('No se pudieron cargar los reportes')
      }
    }
    fetchReports()
  }, [])

  return (
    <div className="container py-6 flex flex-col space-y-6">
      <div className="map-container">
        {error ? (
          <p className="text-red-500">Error al cargar el mapa de reportes</p>
        ) : (
          <Map reports={reports} showOnlyReports={true} />
        )}
      </div>
      <div className="card bg-green-800 text-white overflow-x-auto">
        <h2 className="text-xl font-bold mb-6 text-white">Reportes Ciudadanos</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {reports.length === 0 ? (
          <p className="text-white">No hay reportes</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full table-fixed">
              <thead>
                <tr>
                  <th className="w-1/3">Descripción</th>
                  <th className="w-1/3">Ubicación</th>
                  <th className="w-1/3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="truncate">{report.description}</td>
                    <td className="truncate">
                      {report.location.coordinates[1].toFixed(4)}, {report.location.coordinates[0].toFixed(4)}
                    </td>
                    <td className="truncate">{new Date(report.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}