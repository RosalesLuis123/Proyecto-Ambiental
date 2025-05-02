import { useState } from 'react'
import axios from 'axios'

export default function SearchBar({ setSearchResult }) {
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) {
      setError('Ingresa un lugar o coordenadas')
      return
    }

    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          countrycodes: 'bo',
          limit: 1,
        },
      })

      if (response.data.length === 0) {
        setError('No se encontraron resultados')
        return
      }

      const result = response.data[0]
      setSearchResult({
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
      })
      setError('')
      setQuery('')
    } catch (err) {
      setError('Error al buscar: ' + err.message)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 w-80">
      <form onSubmit={handleSearch} className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar lugar o coordenadas..."
            className="w-full px-2 py-1 border rounded-md text-gray-900 text-xs focus:ring-2 focus:ring-green-900"
          />
          <button
            type="submit"
            className="btn btn-primary text-xs px-3 py-1"
          >
            Buscar
          </button>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </form>
    </div>
  )
}