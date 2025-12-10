import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

console.log('🔧 Correction de la table leads...')

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'reddy_portfolio'
})

console.log('✅ Connexion MySQL établie')

// Ajouter la colonne nom si elle n'existe pas
try {
  console.log('📊 Ajout de la colonne nom...')
  await connection.execute('ALTER TABLE leads ADD COLUMN nom VARCHAR(100) AFTER prenom')
  console.log('✅ Colonne nom ajoutée')
} catch (error) {
  if (error.message.includes('Duplicate column name')) {
    console.log('⚠️  Colonne nom existe déjà')
  } else {
    console.error('❌ Erreur ajout colonne nom:', error.message)
  }
}

// Ajouter la colonne telephone si elle n'existe pas
try {
  console.log('📊 Ajout de la colonne telephone...')
  await connection.execute('ALTER TABLE leads ADD COLUMN telephone VARCHAR(20) AFTER nom')
  console.log('✅ Colonne telephone ajoutée')
} catch (error) {
  if (error.message.includes('Duplicate column name')) {
    console.log('⚠️  Colonne telephone existe déjà')
  } else {
    console.error('❌ Erreur ajout colonne telephone:', error.message)
  }
}

// Modifier les colonnes pour permettre NULL
try {
  console.log('📊 Modification des contraintes...')
  await connection.execute('ALTER TABLE leads MODIFY COLUMN email VARCHAR(255) NULL')
  await connection.execute('ALTER TABLE leads MODIFY COLUMN whatsapp VARCHAR(50) NULL')
  console.log('✅ Contraintes modifiées')
} catch (error) {
  console.error('❌ Erreur modification contraintes:', error.message)
}

// Vérifier la nouvelle structure
console.log('\n📊 Nouvelle structure de la table leads:')
const [leadsColumns] = await connection.execute('DESCRIBE leads')
leadsColumns.forEach(col => {
  console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : '(NULL)'} ${col.Key ? `[${col.Key}]` : ''}`)
})

await connection.end()
console.log('\n🎉 Table leads corrigée avec succès !')