import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 5000

// Middleware
app.use(cors())
app.use(express.json())

console.log('🚀 Démarrage du serveur de test simple...')

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Serveur de test fonctionnel !' })
})

// Route pour les leads (simulation)
app.post('/api/leads', (req, res) => {
  console.log('📥 Lead reçu:', req.body)
  
  const { prenom, nom, email, whatsapp, preference, source, produit } = req.body
  
  // Simulation d'un ID
  const id = Date.now()
  
  // Log pour debug
  console.log(`✅ Lead enregistré: ${prenom} ${nom} (${preference})`)
  
  // Réponse de succès
  res.status(201).json({
    success: true,
    message: 'Lead enregistré avec succès',
    id: id,
    pdfSent: true
  })
})

// Route pour les statistiques (simulation)
app.get('/api/admin/stats', (req, res) => {
  res.json({
    stats: {
      leads: 5,
      reservations: 3,
      commandes: 2,
      visitors: 150,
      visitorsToday: 25,
      downloads: 8,
      downloadsToday: 3
    },
    topCountries: [
      { country: 'Congo-Brazzaville', count: 45 },
      { country: 'France', count: 32 },
      { country: 'Cameroun', count: 28 }
    ],
    recentLeads: []
  })
})

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur de test démarré sur http://localhost:${PORT}`)
  console.log(`🔗 Test: http://localhost:${PORT}`)
  console.log(`📊 API Leads: http://localhost:${PORT}/api/leads`)
})

// Gestion des erreurs
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non gérée:', error.message)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée:', reason)
})