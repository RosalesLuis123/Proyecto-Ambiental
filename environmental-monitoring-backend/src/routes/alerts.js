import express from 'express'
import pool from '../db.js'

const router = express.Router()

router.get('/detect', async (req, res) => {
  try {
    const newAlert = {
      type: Math.random() > 0.5 ? 'deforestation' : 'fire',
      lng: -63.5 + Math.random() * 0.1,
      lat: -17.5 + Math.random() * 0.1,
      confidence: 0.9 + Math.random() * 0.09,
    }

    const query = `
      INSERT INTO alerts (type, location, confidence, timestamp)
      VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4, CURRENT_TIMESTAMP)
      RETURNING *
    `
    const values = [newAlert.type, newAlert.lng, newAlert.lat, newAlert.confidence]

    const result = await pool.query(query, values)
    const alert = result.rows[0]

    res.json([{
      id: alert.id,
      type: alert.type,
      location: {
        type: 'Point',
        coordinates: [newAlert.lng, newAlert.lat],
      },
      confidence: alert.confidence,
      timestamp: alert.timestamp,
    }])
  } catch (error) {
    console.error('Error al generar alerta:', error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, type, ST_AsGeoJSON(location)::jsonb AS location, confidence, timestamp
      FROM alerts
    `
    const result = await pool.query(query)
    const alerts = result.rows.map((row) => ({
      ...row,
      location: row.location || { type: 'Point', coordinates: [0, 0] },
    }))
    res.json(alerts)
  } catch (error) {
    console.error('Error al obtener alertas:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router