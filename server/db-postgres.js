import pkg from 'pg'
const { Pool } = pkg
import dotenv from 'dotenv'

dotenv.config()

// Vérifier que DATABASE_URL existe
if (!process.env.DATABASE_URL) {
  console.error('❌ ERREUR CRITIQUE: DATABASE_URL non définie dans les variables d\'environnement')
  process.exit(1)
}

// Afficher les infos de connexion (sans le mot de passe)
const dbUrl = process.env.DATABASE_URL
const urlParts = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
if (urlParts) {
  console.log('📊 Configuration PostgreSQL:')
  console.log('   - Utilisateur:', urlParts[1])
  console.log('   - Hôte:', urlParts[3])
  console.log('   - Port:', urlParts[4])
  console.log('   - Base:', urlParts[5])
}

// Configuration PostgreSQL optimisée pour Render avec reconnexion automatique
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Configuration plus permissive pour Render
  connectionTimeoutMillis: 60000, // Augmenter à 60s
  idleTimeoutMillis: 10000,
  query_timeout: 60000,
  statement_timeout: 60000,
  max: 5,  // Réduire le nombre de connexions
  min: 0,  // Ne pas forcer de connexions minimales
  allowExitOnIdle: false,
  // Ajouter keepAlive pour maintenir la connexion
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
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
      console.error('   Code erreur:', err.code)
      console.error('   Stack:', err.stack?.split('\n')[0])
      isConnected = false
      if (i < retries - 1) {
        console.log(`   ⏳ Attente de 5 secondes avant nouvelle tentative...`)
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }
  }
  console.error('❌ ÉCHEC: Impossible de se connecter à PostgreSQL après', retries, 'tentatives')
  console.error('⚠️  Le serveur continue mais les requêtes DB échoueront')
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
export const queryWithRetry = async (text, params, maxRetries = 2) => {
  // Si on sait que la connexion est impossible, échouer immédiatement
  if (!isConnected && maxRetries > 1) {
    console.log('⚠️  Connexion PostgreSQL non établie, tentative de reconnexion...')
    const connected = await testConnection()
    if (!connected) {
      throw new Error('PostgreSQL non disponible - Vérifier DATABASE_URL et la base de données sur Render')
    }
  }

  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await pool.query(text, params)
      if (!isConnected) {
        console.log('✅ Connexion PostgreSQL rétablie')
        isConnected = true
      }
      return result
    } catch (err) {
      console.error(`❌ Erreur requête (tentative ${i + 1}/${maxRetries}):`, err.message)
      
      // Si c'est une erreur de connexion, attendre et réessayer
      if (err.message.includes('connexion') || err.message.includes('connection') || err.message.includes('terminated')) {
        isConnected = false
        if (i < maxRetries - 1) {
          console.log('🔄 Reconnexion et nouvelle tentative...')
          await new Promise(resolve => setTimeout(resolve, 3000))
        } else {
          throw new Error('PostgreSQL non disponible - Vérifier la connexion sur Render Dashboard')
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
