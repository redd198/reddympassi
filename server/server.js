import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
// Importer le pool MySQL
import mysqlPool from './db.js'

// Utiliser MySQL (compatible avec Railway)
const pool = mysqlPool
import { getLocationFromIP, getClientIP } from './tracking.js'
import { sendLeadNotification, sendReservationNotification, sendCommandeNotification } from './email.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Middleware pour tracker les visiteurs - DÉSACTIVÉ TEMPORAIREMENT
// (ipapi.co a une limite de requêtes)
app.use(async (req, res, next) => {
  next() // Passer directement sans tracking
})

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key_change_in_production', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' })
    }
    req.user = user
    next()
  })
}

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API fonctionnelle' })
})

// Route pour initialiser la base de données (à utiliser une seule fois)
app.get('/api/init-database', async (req, res) => {
  try {
    const fs = await import('fs')
    const { fileURLToPath } = await import('url')
    const { dirname, join } = await import('path')
    
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const sqlPath = join(__dirname, 'database-postgres.sql')
    
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Exécuter le script SQL
    await pool.query(sql)
    
    res.json({ success: true, message: 'Base de données initialisée avec succès' })
  } catch (error) {
    console.error('Erreur init DB:', error)
    res.status(500).json({ error: error.message })
  }
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

    // Envoyer notification email
    await sendReservationNotification({ nom, whatsapp, email, theme, objectif, date, heure, paiement })

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

    // Envoyer notification email
    await sendCommandeNotification({ nom, email, whatsapp, livre })

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

// Route pour enregistrer un lead (livre gratuit, webinaire, etc.)
app.post('/api/leads', async (req, res) => {
  try {
    const { prenom, email, whatsapp, preference, source, produit } = req.body

    if (!prenom || !email || !whatsapp) {
      return res.status(400).json({ error: 'Tous les champs sont requis' })
    }

    const [result] = await pool.query(
      `INSERT INTO leads (prenom, email, whatsapp, preference, source, produit) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [prenom, email, whatsapp, preference || 'whatsapp', source || 'site-web', produit || 'Livre gratuit']
    )

    // Envoyer notification email
    await sendLeadNotification({ prenom, email, whatsapp, preference, source, produit })

    res.status(201).json({
      success: true,
      message: 'Lead enregistré avec succès',
      id: result.insertId
    })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Cet email est déjà enregistré' })
    }
    console.error('Erreur lors de l\'enregistrement du lead:', error)
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

// ============= ROUTES ADMIN =============

// Login admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username])
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Identifiants incorrects' })
    }

    const admin = rows[0]
    const validPassword = await bcrypt.compare(password, admin.password)

    if (!validPassword) {
      return res.status(401).json({ error: 'Identifiants incorrects' })
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'secret_key_change_in_production',
      { expiresIn: '24h' }
    )

    res.json({
      success: true,
      token,
      admin: { id: admin.id, username: admin.username, email: admin.email }
    })
  } catch (error) {
    console.error('Erreur login:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Dashboard stats
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const [leadsCount] = await pool.query('SELECT COUNT(*) as count FROM leads')
    const [reservationsCount] = await pool.query('SELECT COUNT(*) as count FROM reservations')
    const [commandesCount] = await pool.query('SELECT COUNT(*) as count FROM commandes_livres')
    const [visitorsCount] = await pool.query('SELECT COUNT(*) as count FROM visitors')
    const [visitorsToday] = await pool.query('SELECT COUNT(*) as count FROM visitors WHERE DATE(created_at) = CURDATE()')
    
    // Top pays
    const [topCountries] = await pool.query(`
      SELECT country, COUNT(*) as count 
      FROM visitors 
      WHERE country != 'Inconnu'
      GROUP BY country 
      ORDER BY count DESC 
      LIMIT 10
    `)

    // Leads récents
    const [recentLeads] = await pool.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 5')

    res.json({
      stats: {
        leads: leadsCount[0].count,
        reservations: reservationsCount[0].count,
        commandes: commandesCount[0].count,
        visitors: visitorsCount[0].count,
        visitorsToday: visitorsToday[0].count
      },
      topCountries,
      recentLeads
    })
  } catch (error) {
    console.error('Erreur stats:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Récupérer tous les leads
app.get('/api/admin/leads', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM leads ORDER BY created_at DESC')
    res.json(rows)
  } catch (error) {
    console.error('Erreur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Récupérer toutes les réservations (admin)
app.get('/api/admin/reservations', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reservations ORDER BY created_at DESC')
    res.json(rows)
  } catch (error) {
    console.error('Erreur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Récupérer toutes les commandes
app.get('/api/admin/commandes', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM commandes_livres ORDER BY created_at DESC')
    res.json(rows)
  } catch (error) {
    console.error('Erreur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Récupérer les visiteurs
app.get('/api/admin/visitors', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM visitors ORDER BY created_at DESC LIMIT 100')
    res.json(rows)
  } catch (error) {
    console.error('Erreur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Mettre à jour le statut d'un lead
app.patch('/api/admin/leads/:id', authenticateToken, async (req, res) => {
  try {
    const { statut } = req.body
    await pool.query('UPDATE leads SET statut = ? WHERE id = ?', [statut, req.params.id])
    res.json({ success: true })
  } catch (error) {
    console.error('Erreur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`)
})
