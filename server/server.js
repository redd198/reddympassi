import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pgPool from './db-postgres.js'
import mysqlPool from './db.js'

dotenv.config()

// Utiliser PostgreSQL en production, MySQL en local
const pool = process.env.DATABASE_URL ? pgPool : mysqlPool

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API fonctionnelle' })
})

// Route pour créer une réservation
app.post('/api/reservations', async (req, res) => {
  try {
    const { nom, whatsapp, email, theme, objectif, date, heure, paiement } = req.body

    // Validation
    if (!nom || !whatsapp || !email || !theme || !objectif || !date || !heure || !paiement) {
      return res.status(400).json({ error: 'Tous les champs sont requis' })
    }

    const [result] = await pool.query(
      `INSERT INTO reservations 
       (nom, whatsapp, email, theme, objectif, date_souhaitee, heure_souhaitee, paiement) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nom, whatsapp, email, theme, objectif, date, heure, paiement]
    )

    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès',
      id: result.insertId
    })
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Route pour récupérer toutes les réservations
app.get('/api/reservations', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM reservations ORDER BY created_at DESC'
    )
    res.json(rows)
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Route pour créer une commande de livre
app.post('/api/commandes', async (req, res) => {
  try {
    const { nom, email, whatsapp, livre } = req.body

    if (!nom || !email || !whatsapp || !livre) {
      return res.status(400).json({ error: 'Tous les champs sont requis' })
    }

    const [result] = await pool.query(
      `INSERT INTO commandes_livres (nom, email, whatsapp, livre) 
       VALUES (?, ?, ?, ?)`,
      [nom, email, whatsapp, livre]
    )

    res.status(201).json({
      success: true,
      message: 'Commande enregistrée avec succès',
      id: result.insertId
    })
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Route pour l'inscription à la newsletter
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email requis' })
    }

    const [result] = await pool.query(
      'INSERT INTO newsletter (email) VALUES (?)',
      [email]
    )

    res.status(201).json({
      success: true,
      message: 'Inscription réussie'
    })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Cet email est déjà inscrit' })
    }
    console.error('Erreur lors de l\'inscription:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`)
})
