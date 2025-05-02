import { useState } from 'react'
import ReportForm from '../components/ReportForm.jsx'
import Map from '../components/Map.jsx'

export default function ReportPage() {
  const [selectedLocation, setSelectedLocation] = useState(null)

  return (
    <div className="relative h-screen w-full">
      <div className="map-container h-screen w-full">
        <Map selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} showEmptyMap={true} />
      </div>
      <div className="absolute top-4 left-4 z-[1000]">
        <ReportForm selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
      </div>
    </div>
  )
}