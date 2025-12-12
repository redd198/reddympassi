import { queryWithRetry } from './db-postgres.js'

async function createReservationsTable() {
  try {
    console.log('🔄 Création de la table reservations...')
    
    // Créer la table reservations
    await queryWithRetry(`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        whatsapp VARCHAR(50),
        email VARCHAR(255),
        theme VARCHAR(255),
        objectif TEXT,
        date_souhaitee DATE,
        heure_souhaitee TIME,
        paiement VARCHAR(50),
        statut VARCHAR(50) DEFAULT 'en_attente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    console.log('✅ Table reservations créée avec succès')
    
    // Créer les index
    await queryWithRetry(`
      CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(email)
    `)
    
    await queryWithRetry(`
      CREATE INDEX IF NOT EXISTS idx_reservations_statut ON reservations(statut)
    `)
    
    console.log('✅ Index créés avec succès')
    
    // Vérifier que la table existe
    const result = await queryWithRetry(`SELECT COUNT(*) as count FROM reservations`)
    console.log('✅ Table reservations vérifiée, nombre d\'enregistrements:', result.rows[0].count)
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de la table reservations:', error)
    throw error
  }
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  createReservationsTable()
    .then(() => {
      console.log('🎉 Migration terminée avec succès')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Erreur de migration:', error)
      process.exit(1)
    })
}

export { createReservationsTable }