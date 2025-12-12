import { queryWithRetry } from './db-postgres.js'

async function testReservationsTable() {
  try {
    console.log('🔍 Test de la table reservations...')
    
    // 1. Vérifier que la table existe
    console.log('\n1️⃣ Vérification de l\'existence de la table...')
    const tableCheck = await queryWithRetry(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'reservations'
      );
    `)
    
    if (!tableCheck.rows[0].exists) {
      throw new Error('❌ Table reservations n\'existe pas')
    }
    console.log('✅ Table reservations existe')
    
    // 2. Vérifier la structure
    console.log('\n2️⃣ Vérification de la structure...')
    const structure = await queryWithRetry(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'reservations'
      ORDER BY ordinal_position;
    `)
    
    console.log('📋 Structure de la table:')
    structure.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`)
    })
    
    // 3. Vérifier les index
    console.log('\n3️⃣ Vérification des index...')
    const indexes = await queryWithRetry(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'reservations';
    `)
    
    console.log('📊 Index disponibles:')
    indexes.rows.forEach(idx => {
      console.log(`   - ${idx.indexname}`)
    })
    
    // 4. Test d'insertion
    console.log('\n4️⃣ Test d\'insertion...')
    const testData = {
      nom: 'Test User',
      whatsapp: '+242123456789',
      email: 'test@example.com',
      theme: 'E-commerce et vente en ligne',
      objectif: 'Test de fonctionnement de la table',
      date_souhaitee: '2025-01-15',
      heure_souhaitee: '14:30',
      paiement: 'Airtel Money'
    }
    
    const insertResult = await queryWithRetry(`
      INSERT INTO reservations 
      (nom, whatsapp, email, theme, objectif, date_souhaitee, heure_souhaitee, paiement) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, created_at;
    `, [
      testData.nom,
      testData.whatsapp, 
      testData.email,
      testData.theme,
      testData.objectif,
      testData.date_souhaitee,
      testData.heure_souhaitee,
      testData.paiement
    ])
    
    const insertedId = insertResult.rows[0].id
    console.log(`✅ Insertion réussie - ID: ${insertedId}`)
    
    // 5. Test de lecture
    console.log('\n5️⃣ Test de lecture...')
    const selectResult = await queryWithRetry(`
      SELECT * FROM reservations WHERE id = $1
    `, [insertedId])
    
    if (selectResult.rows.length > 0) {
      console.log('✅ Lecture réussie')
      console.log('📄 Données:', selectResult.rows[0])
    }
    
    // 6. Nettoyage (supprimer le test)
    console.log('\n6️⃣ Nettoyage...')
    await queryWithRetry(`DELETE FROM reservations WHERE id = $1`, [insertedId])
    console.log('✅ Données de test supprimées')
    
    // 7. Statistiques finales
    console.log('\n📊 STATISTIQUES FINALES:')
    const count = await queryWithRetry(`SELECT COUNT(*) as total FROM reservations`)
    console.log(`   - Nombre total de réservations: ${count.rows[0].total}`)
    
    console.log('\n🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS!')
    console.log('✅ La table reservations est prête à recevoir les données du formulaire')
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message)
    throw error
  }
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  testReservationsTable()
    .then(() => {
      console.log('\n🏁 Tests terminés avec succès')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Échec des tests:', error)
      process.exit(1)
    })
}

export { testReservationsTable }