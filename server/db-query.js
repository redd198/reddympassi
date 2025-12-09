import mysqlPool from './db.js'
import postgresPool, { queryWithRetry } from './db-postgres.js'
import dotenv from 'dotenv'

dotenv.config()

// Détecter le type de base de données
const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql://')
const pool = isPostgres ? postgresPool : mysqlPool

/**
 * Exécuter une requête avec gestion automatique des reconnexions
 * @param {string} query - Requête SQL
 * @param {Array} params - Paramètres de la requête
 * @returns {Promise} - Résultat de la requête
 */
export async function executeQuery(query, params = []) {
  try {
    if (isPostgres) {
      // Utiliser queryWithRetry pour PostgreSQL
      return await queryWithRetry(query, params)
    } else {
      // MySQL standard
      return await pool.query(query, params)
    }
  } catch (error) {
    console.error('❌ Erreur executeQuery:', error.message)
    throw error
  }
}

/**
 * Obtenir une connexion du pool avec retry
 * @returns {Promise} - Client de connexion
 */
export async function getConnection() {
  const maxRetries = 3
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const connection = await pool.getConnection()
      return connection
    } catch (error) {
      console.error(`❌ Erreur getConnection (tentative ${i + 1}/${maxRetries}):`, error.message)
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      } else {
        throw error
      }
    }
  }
}

export { pool, isPostgres }
