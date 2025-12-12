import { queryWithRetry } from './db-postgres.js'

async function createMissingTables() {
  try {
    console.log('🔄 Création des tables manquantes...')
    
    // 1. Créer la table evaluations
    console.log('\n📊 Création de la table evaluations...')
    await queryWithRetry(`
      CREATE TABLE IF NOT EXISTS evaluations (
        id BIGSERIAL PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        whatsapp VARCHAR(50),
        preference VARCHAR(20) NOT NULL,
        reponses JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)
    
    // Index pour evaluations
    await queryWithRetry(`
      CREATE INDEX IF NOT EXISTS idx_evaluations_email ON evaluations(email)
    `)
    
    await queryWithRetry(`
      CREATE INDEX IF NOT EXISTS idx_evaluations_created_at ON evaluations(created_at)
    `)
    
    console.log('✅ Table evaluations créée avec succès')
    
    // 2. Créer la table affiliations
    console.log('\n🤝 Création de la table affiliations...')
    await queryWithRetry(`
      CREATE TABLE IF NOT EXISTS affiliations (
        id BIGSERIAL PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        prenom VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        whatsapp VARCHAR(50) NOT NULL,
        mobile_money_operateur VARCHAR(50),
        mobile_money_numero VARCHAR(50),
        code_affiliation VARCHAR(20) NOT NULL UNIQUE,
        statut VARCHAR(20) DEFAULT 'actif',
        commissions_gagnees DECIMAL(10,2) DEFAULT 0.00,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)
    
    // Index pour affiliations
    await queryWithRetry(`
      CREATE INDEX IF NOT EXISTS idx_affiliations_email ON affiliations(email)
    `)
    
    await queryWithRetry(`
      CREATE INDEX IF NOT EXISTS idx_affiliations_code ON affiliations(code_affiliation)
    `)
    
    await queryWithRetry(`
      CREATE INDEX IF NOT EXISTS idx_affiliations_statut ON affiliations(statut)
    `)
    
    console.log('✅ Table affiliations créée avec succès')
    
    // 3. Vérifier les tables créées
    console.log('\n🔍 Vérification des tables...')
    
    const evaluationsCount = await queryWithRetry(`SELECT COUNT(*) as count FROM evaluations`)
    console.log(`📊 Table evaluations: ${evaluationsCount.rows[0].count} enregistrements`)
    
    const affiliationsCount = await queryWithRetry(`SELECT COUNT(*) as count FROM affiliations`)
    console.log(`🤝 Table affiliations: ${affiliationsCount.rows[0].count} enregistrements`)
    
    console.log('\n🎉 TOUTES LES TABLES MANQUANTES ONT ÉTÉ CRÉÉES AVEC SUCCÈS!')
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error)
    throw error
  }
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  createMissingTables()
    .then(() => {
      console.log('\n🏁 Migration terminée avec succès')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Échec de la migration:', error)
      process.exit(1)
    })
}

export { createMissingTables }