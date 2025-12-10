import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'
import { executeQuery } from './db-query.js'
import dotenv from 'dotenv'

dotenv.config()

// Détecter le type de base de données
const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql://') || false

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function runLeadsMigrations() {
  try {
    console.log('🚀 Démarrage des migrations pour les tables leads et pdf_downloads...')
    
    // Choisir le bon fichier de migration selon la base de données
    const migrationFile = isPostgres ? 'migrations-leads-postgres.sql' : 'migrations-leads.sql'
    const migrationPath = join(__dirname, migrationFile)
    
    console.log(`📄 Lecture du fichier de migration: ${migrationFile}`)
    const migrationSQL = readFileSync(migrationPath, 'utf8')
    
    // Diviser les requêtes par point-virgule
    const queries = migrationSQL
      .split(';')
      .map(query => query.trim())
      .filter(query => query.length > 0 && !query.startsWith('--'))
    
    console.log(`📊 ${queries.length} requêtes à exécuter...`)
    
    // Exécuter chaque requête
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i]
      if (query.trim()) {
        try {
          console.log(`⚡ Exécution requête ${i + 1}/${queries.length}...`)
          await executeQuery(query)
          console.log(`✅ Requête ${i + 1} exécutée avec succès`)
        } catch (error) {
          // Ignorer les erreurs de tables/index déjà existants
          if (error.message.includes('already exists') || 
              error.message.includes('duplicate key') ||
              error.message.includes('Duplicate entry')) {
            console.log(`⚠️  Requête ${i + 1} ignorée (déjà existant): ${error.message}`)
          } else {
            console.error(`❌ Erreur requête ${i + 1}:`, error.message)
            throw error
          }
        }
      }
    }
    
    console.log('🎉 Migrations des tables leads et pdf_downloads terminées avec succès !')
    
    // Vérifier que les tables ont été créées
    console.log('🔍 Vérification des tables créées...')
    
    try {
      const checkLeads = await executeQuery('SELECT COUNT(*) as count FROM leads')
      console.log('✅ Table leads: OK')
      
      const checkDownloads = await executeQuery('SELECT COUNT(*) as count FROM pdf_downloads')
      console.log('✅ Table pdf_downloads: OK')
      
      console.log('🎯 Toutes les tables sont prêtes pour le système de téléchargement PDF !')
      
    } catch (error) {
      console.error('❌ Erreur lors de la vérification des tables:', error.message)
    }
    
  } catch (error) {
    console.error('💥 Erreur lors des migrations:', error)
    process.exit(1)
  }
}

// Exécuter les migrations si ce script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  runLeadsMigrations()
    .then(() => {
      console.log('✨ Script de migration terminé')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Échec du script de migration:', error)
      process.exit(1)
    })
}

export { runLeadsMigrations }