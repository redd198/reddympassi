import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

console.log('🚀 Démarrage du script de création des tables...')

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'reddy_portfolio'
})

console.log('✅ Connexion MySQL établie')

// Créer la table leads
console.log('📊 Création de la table leads...')
await connection.execute(`
  CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100),
    telephone VARCHAR(20),
    email VARCHAR(255),
    whatsapp VARCHAR(20),
    preference VARCHAR(20) DEFAULT 'email',
    source VARCHAR(100) DEFAULT 'site-web',
    produit VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`)
console.log('✅ Table leads créée')

// Créer la table pdf_downloads
console.log('📊 Création de la table pdf_downloads...')
await connection.execute(`
  CREATE TABLE IF NOT EXISTS pdf_downloads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id INT,
    nom VARCHAR(200),
    email VARCHAR(255),
    telephone VARCHAR(20),
    livre VARCHAR(255) DEFAULT 'Économie Numérique en Afrique – Focus Congo-Brazzaville',
    ip_address VARCHAR(45),
    user_agent TEXT,
    source VARCHAR(100) DEFAULT 'livre-gratuit',
    email_sent BOOLEAN DEFAULT FALSE,
    download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`)
console.log('✅ Table pdf_downloads créée')

// Vérifier les tables
const [leadsResult] = await connection.execute('SELECT COUNT(*) as count FROM leads')
console.log(`✅ Table leads: ${leadsResult[0].count} enregistrements`)

const [downloadsResult] = await connection.execute('SELECT COUNT(*) as count FROM pdf_downloads')
console.log(`✅ Table pdf_downloads: ${downloadsResult[0].count} enregistrements`)

await connection.end()
console.log('🎉 Tables créées avec succès ! Le système de téléchargement PDF est prêt.')