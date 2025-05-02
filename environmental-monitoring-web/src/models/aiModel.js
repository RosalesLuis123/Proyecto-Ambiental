import mongoose from 'mongoose'

const alertSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Ejemplo: 'deforestation', 'fire'
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
  },
  confidence: Number,
  timestamp: { type: Date, default: Date.now },
})

export default mongoose.model('Alert', alertSchema)