import pkg from 'pg'
const { Pool } = pkg
import dotenv from 'dotenv'

dotenv.config()

// Configuration avec gestion d'erreur améliorée
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10
})

// Gestion des erreurs de pool
pool.on('error', (err) => {
  console.error('❌ Erreur PostgreSQL pool:', err.message)
})

// Tester la connexion de manière asynchrone
;(async () => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    console.log('✅ Connexion à PostgreSQL réussie')
    client.release()
  } catch (err) {
    console.error('❌ Erreur de connexion à PostgreSQL:', err.message)
  }
})()

export default pool
