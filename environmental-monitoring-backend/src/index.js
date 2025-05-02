import express from 'express'
import cors from 'cors'
import alertRoutes from './routes/alerts.js'
import satelliteRoutes from './routes/satellite.js'
import reportRoutes from './routes/reports.js'
import fileUpload from 'express-fileupload'

const app = express()

app.use(cors())
app.use(express.json())
app.use(fileUpload())

app.use('/api/alerts', alertRoutes)
app.use('/api/satellite', satelliteRoutes)
app.use('/api/reports', reportRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`)
})