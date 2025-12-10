import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

console.log('🔍 Vérification de la structure des tables...')

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'reddy_portfolio'
})

console.log('✅ Connexion MySQL établie')

// Vérifier la structure de la table leads
console.log('\n📊 Structure de la table leads:')
const [leadsColumns] = await connection.execute('DESCRIBE leads')
leadsColumns.forEach(col => {
  console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : '(NULL)'} ${col.Key ? `[${col.Key}]` : ''}`)
})

// Vérifier la structure de la table pdf_downloads
console.log('\n📊 Structure de la table pdf_downloads:')
try {
  const [downloadsColumns] = await connection.execute('DESCRIBE pdf_downloads')
  downloadsColumns.forEach(col => {
    console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : '(NULL)'} ${col.Key ? `[${col.Key}]` : ''}`)
  })
} catch (error) {
  console.log('❌ Table pdf_downloads n\'existe pas:', error.message)
}

// Lister toutes les tables
console.log('\n📋 Toutes les tables dans la base:')
const [tables] = await connection.execute('SHOW TABLES')
tables.forEach(table => {
  console.log(`- ${Object.values(table)[0]}`)
})

await connection.end()
console.log('\n🔌 Connexion fermée')