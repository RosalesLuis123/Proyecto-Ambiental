import express from 'express'
import pool from '../db.js'

const router = express.Router()

router.get('/process', async (req, res) => {
  try {
    const newImage = {
      lng: -63.5 + Math.random() * 0.1,
      lat: -17.5 + Math.random() * 0.1,
      url: 'https://via.placeholder.com/256x256.png?text=Imagen+Satelital+Simulada',
    }

    const query = `
      INSERT INTO satellite_images (type, location, url, timestamp)
      VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4, CURRENT_TIMESTAMP)
      RETURNING id, type, ST_X(location) AS lng, ST_Y(location) AS lat, url, timestamp
    `
    const values = ['satellite_image', newImage.lng, newImage.lat, newImage.url]

    const result = await pool.query(query, values)
    const image = result.rows[0]

    res.json([{
      id: image.id,
      type: image.type,
      location: {
        type: 'Point',
        coordinates: [image.lng, image.lat],
      },
      url: image.url,
      timestamp: image.timestamp,
    }])
  } catch (error) {
    console.error('Error al procesar imagen:', error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, type, ST_X(location) AS lng, ST_Y(location) AS lat, url, timestamp
      FROM satellite_images
    `
    const result = await pool.query(query)
    const images = result.rows.map((row) => ({
      id: row.id,
      type: row.type,
      location: {
        type: 'Point',
        coordinates: [row.lng, row.lat],
      },
      url: row.url,
      timestamp: row.timestamp,
    }))
    console.log('Imágenes devueltas:', images)
    res.json(images)
  } catch (error) {
    console.error('Error al obtener imágenes:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router