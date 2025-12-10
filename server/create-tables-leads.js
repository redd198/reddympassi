import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function createLeadsTables() {
  let connection = null
  
  try {
    console.log('🚀 Connexion à MySQL...')
    
    // Configuration de connexion
    const config = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'reddy_portfolio'
    }
    
    connection = await mysql.createConnection(config)
    console.log('✅ Connexion MySQL réussie')
    
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_email (email)
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
        download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
      )
    `)
    console.log('✅ Table pdf_downloads créée')
    
    // Créer les index
    console.log('📊 Création des index...')
    
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email)',
      'CREATE INDEX IF NOT EXISTS idx_leads_whatsapp ON leads(whatsapp)',
      'CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source)',
      'CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_pdf_downloads_email ON pdf_downloads(email)',
      'CREATE INDEX IF NOT EXISTS idx_pdf_downloads_livre ON pdf_downloads(livre)',
      'CREATE INDEX IF NOT EXISTS idx_pdf_downloads_date ON pdf_downloads(download_date)',
      'CREATE INDEX IF NOT EXISTS idx_pdf_downloads_lead_id ON pdf_downloads(lead_id)'
    ]
    
    for (const indexQuery of indexes) {
      try {
        await connection.execute(indexQuery)
      } catch (error) {
        if (!error.message.includes('Duplicate key name')) {
          console.log(`⚠️  Index ignoré: ${error.message}`)
        }
      }
    }
    
    console.log('✅ Index créés')
    
    // Vérifier les tables
    console.log('🔍 Vérification des tables...')
    
    const [leadsResult] = await connection.execute('SELECT COUNT(*) as count FROM leads')
    console.log(`✅ Table leads: ${leadsResult[0].count} enregistrements`)
    
    const [downloadsResult] = await connection.execute('SELECT COUNT(*) as count FROM pdf_downloads')
    console.log(`✅ Table pdf_downloads: ${downloadsResult[0].count} enregistrements`)
    
    console.log('🎉 Tables créées avec succès ! Le système de téléchargement PDF est prêt.')
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    throw error
  } finally {
    if (connection) {
      await connection.end()
      console.log('🔌 Connexion fermée')
    }
  }
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  createLeadsTables()
    .then(() => {
      console.log('✨ Script terminé avec succès')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Échec du script:', error)
      process.exit(1)
    })
}