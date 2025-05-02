import { Pool } from 'pg'

const pool = new Pool({
  user: 'postgres', // Cambia esto por tu usuario de PostgreSQL
  host: 'localhost',
  database: 'environmental_monitoring',
  password: 'password', // Cambia esto por tu contraseña
  port: 5433,
})

export default pool
