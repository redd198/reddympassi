import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mysqlPool from './db.js'
import postgresPool from './db-postgres.js'
import { getLocationFromIP, getClientIP } from './tracking.js'
import { sendLeadNotification, sendReservationNotification, sendCommandeNotification, sendValidationEmail } from './email.js'
import { adaptQuery, extractRows, extractInsertId, dbType } from './db-helper.js'

dotenv.config()

// Détecter automatiquement le type de base de données
const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql://')
const pool = isPostgres ? postgresPool : mysqlPool

console.log(`🗄️  Base de données: ${dbType}`)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Route API pour tracker les visiteurs (appelée depuis le frontend)
app.post('/api/track-visitor', async (req, res) => {
  try {
    const { pageUrl } = req.body
    const clientIP = getClientIP(req)
    const userAgent = req.headers['user-agent'] || 'Unknown'
    
    // Enregistrer le visiteur
    const { query, params } = adaptQuery(
      `INSERT INTO visitors (ip_address, user_agent, page_url, country, city) 
       VALUES (?, ?, ?, ?, ?)`,
      [clientIP, userAgent, pageUrl || '/', 'Non disponible', 'Non disponible']
    )
    
    await pool.query(query, params)
    res.json({ success: true })
  } catch (error) {
    console.log('⚠️ Erreur tracking visiteur:', error.message)
    res.json({ success: false }) // Ne pas bloquer le site
  }
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
    
    // Charger le bon fichier SQL selon le type de base de données
    const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql://')
    const sqlFile = isPostgres ? 'database-postgres.sql' : 'database.sql'
    const sqlPath = join(__dirname, sqlFile)
    
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

    // Vérifier si l'email a déjà une réservation en attente
    const { query: checkQuery, params: checkParams } = adaptQuery(
      'SELECT COUNT(*) as count FROM reservations WHERE email = ? AND statut = ?',
      [email, 'en_attente']
    )
    const checkResult = await pool.query(checkQuery, checkParams)
    const rows = extractRows(checkResult)
    
    if (rows[0].count > 0) {
      return res.status(400).json({ 
        error: 'Vous avez déjà une réservation en attente de validation. Veuillez patienter ou nous contacter sur WhatsApp.' 
      })
    }

    const { query, params } = adaptQuery(
      `INSERT INTO reservations 
       (nom, whatsapp, email, theme, objectif, date_souhaitee, heure_souhaitee, paiement) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nom, whatsapp, email, theme, objectif, date, heure, paiement]
    )
    
    const result = await pool.query(query, params)
    const insertId = extractInsertId(result)

    // Envoyer notification email
    await sendReservationNotification({ nom, whatsapp, email, theme, objectif, date, heure, paiement })

    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès',
      id: insertId
    })
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Route pour récupérer toutes les réservations
app.get('/api/reservations', async (req, res) => {
  try {
    const { query, params } = adaptQuery('SELECT * FROM reservations ORDER BY created_at DESC', [])
    const result = await pool.query(query, params)
    const rows = extractRows(result)
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

    // Vérifier si l'email a déjà une commande en attente pour ce livre
    const { query: checkQuery, params: checkParams } = adaptQuery(
      'SELECT COUNT(*) as count FROM commandes_livres WHERE email = ? AND livre = ? AND statut = ?',
      [email, livre, 'en_attente']
    )
    const checkResult = await pool.query(checkQuery, checkParams)
    const rows = extractRows(checkResult)
    
    if (rows[0].count > 0) {
      return res.status(400).json({ 
        error: 'Vous avez déjà commandé ce livre. Votre commande est en cours de traitement.' 
      })
    }

    const { query, params } = adaptQuery(
      `INSERT INTO commandes_livres (nom, email, whatsapp, livre) 
       VALUES (?, ?, ?, ?)`,
      [nom, email, whatsapp, livre]
    )
    
    const result = await pool.query(query, params)
    const insertId = extractInsertId(result)

    // Envoyer notification email
    await sendCommandeNotification({ nom, email, whatsapp, livre })

    res.status(201).json({
      success: true,
      message: 'Commande enregistrée avec succès',
      id: insertId
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

    const { query, params } = adaptQuery(
      `INSERT INTO leads (prenom, email, whatsapp, preference, source, produit) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [prenom, email, whatsapp, preference || 'whatsapp', source || 'site-web', produit || 'Livre gratuit']
    )
    
    const result = await pool.query(query, params)
    const insertId = extractInsertId(result)

    // Envoyer notification email
    await sendLeadNotification({ prenom, email, whatsapp, preference, source, produit })

    res.status(201).json({
      success: true,
      message: 'Lead enregistré avec succès',
      id: insertId
    })
  } catch (error) {
    // PostgreSQL utilise '23505' pour duplicate key, MySQL utilise 'ER_DUP_ENTRY'
    if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
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

    const { query, params } = adaptQuery(
      'INSERT INTO newsletter (email) VALUES (?)',
      [email]
    )
    
    await pool.query(query, params)

    res.status(201).json({
      success: true,
      message: 'Inscription réussie'
    })
  } catch (error) {
    // PostgreSQL utilise '23505' pour duplicate key, MySQL utilise 'ER_DUP_ENTRY'
    if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
      return res.status(400).json({ error: 'Cet email est déjà inscrit' })
    }
    console.error('Erreur lors de l\'inscription:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============= ROUTES ADMIN =============

// Créer le premier admin (à utiliser une seule fois)
app.get('/api/create-first-admin', async (req, res) => {
  try {
    // Vérifier si un admin existe déjà
    const { query: checkQuery, params: checkParams } = adaptQuery('SELECT COUNT(*) as count FROM admins', [])
    const checkResult = await pool.query(checkQuery, checkParams)
    const rows = extractRows(checkResult)
    
    if (rows[0].count > 0) {
      return res.json({ 
        success: false, 
        message: 'Un admin existe déjà. Cette route ne peut être utilisée qu\'une seule fois.' 
      })
    }

    // Créer l'admin
    const hashedPassword = await bcrypt.hash('Admin@2024', 10)
    const { query: insertQuery, params: insertParams } = adaptQuery(
      'INSERT INTO admins (username, password, email) VALUES (?, ?, ?)',
      ['admin', hashedPassword, 'reddympassi@gmail.com']
    )
    
    await pool.query(insertQuery, insertParams)

    res.json({
      success: true,
      message: 'Admin créé avec succès',
      credentials: {
        username: 'admin',
        password: 'Admin@2024'
      }
    })
  } catch (error) {
    console.error('Erreur création admin:', error)
    res.status(500).json({ error: error.message })
  }
})

// Login admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const { query, params } = adaptQuery('SELECT * FROM admins WHERE username = ?', [username])
    const result = await pool.query(query, params)
    const rows = extractRows(result)
    
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
    const { query: q1, params: p1 } = adaptQuery('SELECT COUNT(*) as count FROM leads', [])
    const { query: q2, params: p2 } = adaptQuery('SELECT COUNT(*) as count FROM reservations', [])
    const { query: q3, params: p3 } = adaptQuery('SELECT COUNT(*) as count FROM commandes_livres', [])
    const { query: q4, params: p4 } = adaptQuery('SELECT COUNT(*) as count FROM visitors', [])
    const { query: q5, params: p5 } = adaptQuery('SELECT COUNT(*) as count FROM visitors WHERE DATE(created_at) = CURRENT_DATE', [])
    
    const leadsCount = extractRows(await pool.query(q1, p1))
    const reservationsCount = extractRows(await pool.query(q2, p2))
    const commandesCount = extractRows(await pool.query(q3, p3))
    const visitorsCount = extractRows(await pool.query(q4, p4))
    const visitorsToday = extractRows(await pool.query(q5, p5))
    
    // Top pays
    const { query: q6, params: p6 } = adaptQuery(`
      SELECT country, COUNT(*) as count 
      FROM visitors 
      WHERE country != ? 
      GROUP BY country 
      ORDER BY count DESC 
      LIMIT 10
    `, ['Inconnu'])
    const topCountries = extractRows(await pool.query(q6, p6))

    // Leads récents
    const { query: q7, params: p7 } = adaptQuery('SELECT * FROM leads ORDER BY created_at DESC LIMIT 5', [])
    const recentLeads = extractRows(await pool.query(q7, p7))

    res.json({
      stats: {
        leads: parseInt(leadsCount[0]?.count || 0),
        reservations: parseInt(reservationsCount[0]?.count || 0),
        commandes: parseInt(commandesCount[0]?.count || 0),
        visitors: parseInt(visitorsCount[0]?.count || 0),
        visitorsToday: parseInt(visitorsToday[0]?.count || 0)
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
    const { query, params } = adaptQuery('SELECT * FROM leads ORDER BY created_at DESC', [])
    const result = await pool.query(query, params)
    const rows = extractRows(result)
    res.json(rows)
  } catch (error) {
    console.error('Erreur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Récupérer toutes les réservations (admin)
app.get('/api/admin/reservations', authenticateToken, async (req, res) => {
  try {
    const { query, params } = adaptQuery('SELECT * FROM reservations ORDER BY created_at DESC', [])
    const result = await pool.query(query, params)
    const rows = extractRows(result)
    res.json(rows)
  } catch (error) {
    console.error('Erreur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Récupérer toutes les commandes
app.get('/api/admin/commandes', authenticateToken, async (req, res) => {
  try {
    const { query, params } = adaptQuery('SELECT * FROM commandes_livres ORDER BY created_at DESC', [])
    const result = await pool.query(query, params)
    const rows = extractRows(result)
    res.json(rows)
  } catch (error) {
    console.error('Erreur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Ajouter la colonne statut si elle n'existe pas (migration)
app.get('/api/admin/migrate-commandes', authenticateToken, async (req, res) => {
  try {
    const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql://')
    
    if (isPostgres) {
      await pool.query(`
        ALTER TABLE commandes_livres 
        ADD COLUMN IF NOT EXISTS statut VARCHAR(50) DEFAULT 'en_attente'
      `)
    } else {
      // MySQL
      await pool.query(`
        ALTER TABLE commandes_livres 
        ADD COLUMN statut VARCHAR(50) DEFAULT 'en_attente'
      `)
    }
    
    res.json({ success: true, message: 'Migration effectuée' })
  } catch (error) {
    // Si la colonne existe déjà, ignorer l'erreur
    res.json({ success: true, message: 'Colonne déjà existante ou migration effectuée' })
  }
})

// Route de test pour vérifier la configuration email
app.get('/api/admin/test-email', authenticateToken, async (req, res) => {
  try {
    const testCommande = {
      nom: 'Test User',
      email: process.env.ADMIN_EMAIL || 'reddympassi@gmail.com',
      whatsapp: '+242050416661',
      livre: 'Livre de test'
    }
    
    const testMessage = `Bonjour ${testCommande.nom},\n\nCeci est un email de test pour vérifier la configuration.\n\nCordialement,\nL'équipe`
    
    await sendValidationEmail(testCommande, testMessage)
    
    res.json({ 
      success: true, 
      message: 'Email de test envoyé avec succès',
      sentTo: testCommande.email,
      config: {
        EMAIL_USER: process.env.EMAIL_USER ? '✅ Configuré' : '❌ Manquant',
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '✅ Configuré' : '❌ Manquant',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL ? '✅ Configuré' : '❌ Manquant'
      }
    })
  } catch (error) {
    console.error('❌ Erreur test email:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message,
      config: {
        EMAIL_USER: process.env.EMAIL_USER ? '✅ Configuré' : '❌ Manquant',
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '✅ Configuré' : '❌ Manquant',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL ? '✅ Configuré' : '❌ Manquant'
      }
    })
  }
})

// Route de fix pour supprimer la contrainte CHECK et recréer la colonne statut
app.get('/api/admin/fix-statut-constraint', authenticateToken, async (req, res) => {
  try {
    const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql://')
    
    if (!isPostgres) {
      return res.json({ success: false, message: 'Cette route est uniquement pour PostgreSQL' })
    }

    // Étape 1 : Supprimer la contrainte CHECK si elle existe
    try {
      await pool.query(`
        ALTER TABLE commandes_livres 
        DROP CONSTRAINT IF EXISTS commandes_livres_statut_check
      `)
      console.log('✅ Contrainte CHECK supprimée')
    } catch (err) {
      console.log('⚠️ Erreur suppression contrainte:', err.message)
    }

    // Étape 2 : Supprimer la colonne statut si elle existe
    try {
      await pool.query(`
        ALTER TABLE commandes_livres 
        DROP COLUMN IF EXISTS statut
      `)
      console.log('✅ Colonne statut supprimée')
    } catch (err) {
      console.log('⚠️ Erreur suppression colonne:', err.message)
    }

    // Étape 3 : Recréer la colonne statut proprement
    await pool.query(`
      ALTER TABLE commandes_livres 
      ADD COLUMN statut VARCHAR(50) DEFAULT 'en_attente'
    `)
    console.log('✅ Colonne statut recréée')

    // Étape 4 : Vérifier la structure
    const result = await pool.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'commandes_livres' AND column_name = 'statut'
    `)
    
    res.json({ 
      success: true, 
      message: 'Contrainte CHECK supprimée et colonne statut recréée avec succès',
      columnInfo: result.rows
    })
  } catch (error) {
    console.error('❌ Erreur fix statut:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message,
      detail: error.detail 
    })
  }
})

// Valider une commande et envoyer un message
app.post('/api/admin/commandes/:id/valider', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { canal, message } = req.body

    if (!canal || !message) {
      return res.status(400).json({ error: 'Canal et message requis' })
    }

    // Récupérer les infos de la commande
    const { query: selectQuery, params: selectParams } = adaptQuery(
      'SELECT * FROM commandes_livres WHERE id = ?',
      [id]
    )
    const result = await pool.query(selectQuery, selectParams)
    const commandes = extractRows(result)
    
    if (commandes.length === 0) {
      return res.status(404).json({ error: 'Commande non trouvée' })
    }

    const commande = commandes[0]

    // Mettre à jour le statut de la commande
    const { query: updateQuery, params: updateParams } = adaptQuery(
      'UPDATE commandes_livres SET statut = ? WHERE id = ?',
      ['validee', id]
    )
    await pool.query(updateQuery, updateParams)

    // Préparer le message avec les variables
    const messageFinal = message
      .replace(/{nom}/g, commande.nom)
      .replace(/{livre}/g, commande.livre)
      .replace(/{email}/g, commande.email)
      .replace(/{whatsapp}/g, commande.whatsapp)

    // Générer le lien selon le canal
    let lien = ''
    let emailSent = false
    
    if (canal === 'whatsapp') {
      const whatsappNumber = commande.whatsapp.replace(/[^0-9]/g, '')
      lien = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageFinal)}`
    } else if (canal === 'email') {
      // Envoyer l'email automatiquement
      try {
        await sendValidationEmail(commande, messageFinal)
        emailSent = true
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError)
        // En cas d'erreur, générer quand même le lien mailto comme fallback
        lien = `mailto:${commande.email}?subject=${encodeURIComponent('Confirmation de commande')}&body=${encodeURIComponent(messageFinal)}`
      }
    }

    res.json({
      success: true,
      message: emailSent ? 'Commande validée et email envoyé' : 'Commande validée',
      lien,
      canal,
      emailSent
    })
  } catch (error) {
    console.error('Erreur validation commande:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Récupérer les visiteurs
app.get('/api/admin/visitors', authenticateToken, async (req, res) => {
  try {
    const { query, params } = adaptQuery('SELECT * FROM visitors ORDER BY created_at DESC LIMIT 100', [])
    const result = await pool.query(query, params)
    const rows = extractRows(result)
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
    const { query, params } = adaptQuery('UPDATE leads SET statut = ? WHERE id = ?', [statut, req.params.id])
    await pool.query(query, params)
    res.json({ success: true })
  } catch (error) {
    console.error('Erreur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============= ROUTES DE SUPPRESSION =============

// Supprimer une réservation
app.delete('/api/admin/reservations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { query, params } = adaptQuery('DELETE FROM reservations WHERE id = ?', [id])
    await pool.query(query, params)
    res.json({ success: true, message: 'Réservation supprimée' })
  } catch (error) {
    console.error('Erreur suppression réservation:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Supprimer une commande
app.delete('/api/admin/commandes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { query, params } = adaptQuery('DELETE FROM commandes_livres WHERE id = ?', [id])
    await pool.query(query, params)
    res.json({ success: true, message: 'Commande supprimée' })
  } catch (error) {
    console.error('Erreur suppression commande:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Supprimer un visiteur
app.delete('/api/admin/visitors/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { query, params } = adaptQuery('DELETE FROM visitors WHERE id = ?', [id])
    await pool.query(query, params)
    res.json({ success: true, message: 'Visiteur supprimé' })
  } catch (error) {
    console.error('Erreur suppression visiteur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Supprimer un lead
app.delete('/api/admin/leads/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { query, params } = adaptQuery('DELETE FROM leads WHERE id = ?', [id])
    await pool.query(query, params)
    res.json({ success: true, message: 'Lead supprimé' })
  } catch (error) {
    console.error('Erreur suppression lead:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`)
})
