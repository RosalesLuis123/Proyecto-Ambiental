import { useState } from 'react'
import axios from 'axios'

export default function ReportForm({ selectedLocation, setSelectedLocation }) {
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedLocation) {
      setError('Por favor, selecciona una ubicación en el mapa')
      return
    }

    const formData = new FormData()
    formData.append('description', description)
    formData.append('file', file)
    formData.append('location', JSON.stringify(selectedLocation))

    try {
      await axios.post('http://localhost:5000/api/reports', formData)
      alert('Reporte enviado con éxito')
      setDescription('')
      setFile(null)
      setSelectedLocation(null)
    } catch (err) {
      setError('Error al enviar el reporte: ' + err.message)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 w-80">
      <h2 className="text-base font-bold mb-2 text-gray-900">Reporte Ambiental</h2>
      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
      {selectedLocation && (
        <p className="text-gray-900 text-xs mb-2">
          Lat {selectedLocation.lat.toFixed(4)}, Lng {selectedLocation.lng.toFixed(4)}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label className="block text-gray-900 text-xs font-medium mb-1">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-2 py-1 border rounded-md bg-white text-gray-900 text-xs focus:ring-2 focus:ring-green-900"
            rows="2"
            required
            placeholder="Describe el problema..."
          />
        </div>
        <div>
          <label className="block text-gray-900 text-xs font-medium mb-1">Foto/Video</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-gray-900 text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-green-900 file:text-white file:hover:bg-green-950"
            accept="image/*,video/*"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full text-xs"
        >
          Enviar Reporte
        </button>
      </form>
    </div>
  )
}