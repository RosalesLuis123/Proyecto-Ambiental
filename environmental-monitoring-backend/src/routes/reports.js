import express from 'express'
import pool from '../db.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { description, location } = req.body
    const file = req.files?.file
    const parsedLocation = JSON.parse(location)

    const query = `
      INSERT INTO reports (description, location, file_path, timestamp)
      VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4, CURRENT_TIMESTAMP)
      RETURNING id, description, ST_X(location) AS lng, ST_Y(location) AS lat, file_path, timestamp
    `
    const values = [
      description,
      parsedLocation.lng,
      parsedLocation.lat,
      file ? `/uploads/${file.name}` : null,
    ]

    if (file) {
      await file.mv(`./uploads/${file.name}`)
    }

    const result = await pool.query(query, values)
    const report = result.rows[0]

    res.json({
      id: report.id,
      description: report.description,
      location: {
        type: 'Point',
        coordinates: [report.lng, report.lat],
      },
      file_path: report.file_path,
      timestamp: report.timestamp,
    })
  } catch (error) {
    console.error('Error al guardar reporte:', error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, description, ST_X(location) AS lng, ST_Y(location) AS lat, file_path, timestamp
      FROM reports
    `
    const result = await pool.query(query)
    const reports = result.rows.map((row) => ({
      id: row.id,
      description: row.description,
      location: {
        type: 'Point',
        coordinates: [row.lng, row.lat],
      },
      file_path: row.file_path,
      timestamp: row.timestamp,
    }))
    console.log('Reportes devueltos:', reports)
    res.json(reports)
  } catch (error) {
    console.error('Error al obtener reportes:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router