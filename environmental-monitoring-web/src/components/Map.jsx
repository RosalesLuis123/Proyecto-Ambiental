import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, LayersControl, ImageOverlay, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import axios from 'axios'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function LocationMarker({ selectedLocation, setSelectedLocation }) {
  useMapEvents({
    click(e) {
      setSelectedLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      })
    },
  })

  return selectedLocation ? (
    <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
      <Popup>Ubicación seleccionada para el reporte</Popup>
    </Marker>
  ) : null
}

function ZoomHandler({ activeLayer }) {
  const map = useMap()
  useEffect(() => {
    if (activeLayer === 'USGS') {
      map.setMaxZoom(16)
    } else {
      map.setMaxZoom(19)
    }
  }, [activeLayer, map])
  return null
}

export default function Map({ selectedLocation, setSelectedLocation, alerts = [], reports = [], showOnlyAlerts = false, showOnlyReports = false, showEmptyMap = false }) {
  const [satelliteImages, setSatelliteImages] = useState([])
  const [activeLayer, setActiveLayer] = useState('Esri')
  const position = [-17.5, -63.5] // Chiquitanía
  const bounds = [[-18, -64], [-17, -63]]

  useEffect(() => {
    if (!showEmptyMap) {
      axios.get('http://localhost:5000/api/satellite')
        .then((response) => setSatelliteImages(response.data))
        .catch((error) => console.error('Error al obtener imágenes:', error))
    }
  }, [showEmptyMap])

  return (
    <MapContainer center={position} zoom={10} maxZoom={19} style={{ height: '100%', width: '100%' }}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Mapa Normal" checked={activeLayer === 'Normal'} onClick={() => setActiveLayer('Normal')}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            subdomains={['a', 'b', 'c']}
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Mapa Topográfico" checked={activeLayer === 'Topo'} onClick={() => setActiveLayer('Topo')}>
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
            subdomains={['a', 'b', 'c']}
            maxZoom={17}
            eventHandlers={{
              add: () => console.log('Capa topográfica cargada'),
              error: (error) => console.error('Error al cargar capa topográfica:', error),
            }}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Mapa Ortofoto (Esri)" checked={activeLayer === 'Esri'} onClick={() => setActiveLayer('Esri')}>
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='© <a href="https://www.esri.com">Esri</a>, Maxar, Earthstar Geographics, and the GIS User Community'
            maxZoom={19}
            eventHandlers={{
              add: () => console.log('Capa ortofoto Esri cargada'),
              error: (error) => console.error('Error al cargar capa ortofoto Esri:', error),
            }}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Mapa Ortofoto (USGS)" checked={activeLayer === 'USGS'} onClick={() => setActiveLayer('USGS')}>
          <TileLayer
            url="https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}"
            attribution='© <a href="https://www.usgs.gov">USGS</a> National Map'
            maxZoom={16}
            eventHandlers={{
              add: () => console.log('Capa ortofoto USGS cargada'),
              error: (error) => console.error('Error al cargar capa ortofoto USGS:', error),
            }}
          />
        </LayersControl.BaseLayer>
        {!showEmptyMap && satelliteImages.map((image) => (
          <LayersControl.Overlay key={image.id} name="Imagen Satelital Simulada">
            <ImageOverlay
              url={image.url}
              bounds={bounds}
            />
          </LayersControl.Overlay>
        ))}
      </LayersControl>
      {showOnlyAlerts && alerts.map((alert) => (
        <Marker key={alert.id} position={[alert.location.coordinates[1], alert.location.coordinates[0]]}>
          <Popup>
            {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Detectado<br />
            Confianza: {(alert.confidence * 100).toFixed(2)}%<br />
            Fecha: {new Date(alert.timestamp).toLocaleString()}
          </Popup>
        </Marker>
      ))}
      {showOnlyReports && reports.map((report) => (
        <Marker key={report.id} position={[report.location.coordinates[1], report.location.coordinates[0]]}>
          <Popup>
            {report.description}<br />
            Fecha: {new Date(report.timestamp).toLocaleString()}
          </Popup>
        </Marker>
      ))}
      {(showEmptyMap || selectedLocation) && (
        <LocationMarker selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
      )}
      <ZoomHandler activeLayer={activeLayer} />
    </MapContainer>
  )
}