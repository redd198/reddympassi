import pkg from 'pg'
const { Pool } = pkg
import dotenv from 'dotenv'

dotenv.config()

// Configuration PostgreSQL optimisée pour Render avec reconnexion automatique
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Configuration optimisée pour éviter les déconnexions
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000, // Réduire pour libérer plus vite
  query_timeout: 30000,
  statement_timeout: 30000,
  max: 10, // Augmenter le nombre de connexions
  min: 2,  // Garder au moins 2 connexions actives
  allowExitOnIdle: false
})

// Variable pour suivre l'état de la connexion
let isConnected = false

// Gestion des erreurs de pool avec reconnexion automatique
pool.on('error', async (err, client) => {
  console.error('❌ Erreur PostgreSQL pool:', err.message)
  isConnected = false
  
  // Tenter de reconnecter après une erreur
  setTimeout(() => {
    console.log('🔄 Tentative de reconnexion...')
    testConnection()
  }, 5000)
})

// Gestion de la connexion d'un client
pool.on('connect', (client) => {
  console.log('🔌 Nouveau client PostgreSQL connecté')
  isConnected = true
})

// Gestion de la déconnexion d'un client
pool.on('remove', (client) => {
  console.log('🔌 Client PostgreSQL déconnecté')
})

// Tester la connexion avec retry
let retries = 5
const testConnection = async () => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect()
      await client.query('SELECT NOW()')
      console.log('✅ Connexion à PostgreSQL réussie')
      isConnected = true
      client.release()
      return true
    } catch (err) {
      console.error(`❌ Tentative ${i + 1}/${retries} - Erreur PostgreSQL:`, err.message)
      isConnected = false
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
    }
  }
  return false
}

// Health check périodique pour maintenir la connexion active
const startHealthCheck = () => {
  setInterval(async () => {
    try {
      const client = await pool.connect()
      await client.query('SELECT 1')
      client.release()
      if (!isConnected) {
        console.log('✅ Connexion PostgreSQL rétablie')
        isConnected = true
      }
    } catch (err) {
      if (isConnected) {
        console.error('⚠️ Health check échoué:', err.message)
        isConnected = false
      }
    }
  }, 30000) // Toutes les 30 secondes
}

// Wrapper pour les requêtes avec retry automatique
export const queryWithRetry = async (text, params, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await pool.query(text, params)
      return result
    } catch (err) {
      console.error(`❌ Erreur requête (tentative ${i + 1}/${maxRetries}):`, err.message)
      
      // Si c'est une erreur de connexion, attendre et réessayer
      if (err.message.includes('connexion') || err.message.includes('connection')) {
        if (i < maxRetries - 1) {
          console.log('🔄 Reconnexion et nouvelle tentative...')
          await new Promise(resolve => setTimeout(resolve, 2000))
          await testConnection()
        } else {
          throw err
        }
      } else {
        // Pour les autres erreurs, ne pas réessayer
        throw err
      }
    }
  }
}

// Initialiser la connexion
testConnection().then(success => {
  if (success) {
    startHealthCheck()
  }
})

export default pool
