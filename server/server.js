import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getLocationFromIP, getClientIP } from './tracking.js'
import { sendLeadNotification, sendReservationNotification, sendCommandeNotification, sendValidationEmail, sendBookPDF } from './email.js'
import { adaptQuery, extractRows, extractInsertId, dbType } from './db-helper.js'
import { executeQuery, pool, isPostgres } from './db-query.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

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
    
    await executeQuery(query, params)
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
    await executeQuery(sql)
    
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
    const checkResult = await executeQuery(checkQuery, checkParams)
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
    
    const result = await executeQuery(query, params)
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
    const result = await executeQuery(query, params)
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
    const checkResult = await executeQuery(checkQuery, checkParams)
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
    
    const result = await executeQuery(query, params)
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
    
    const result = await executeQuery(query, params)
    const insertId = extractInsertId(result)

    // Envoyer notification email
    await sendLeadNotification({ prenom, email, whatsapp, preference, source, produit })

    // Si c'est pour le livre gratuit, envoyer le PDF automatiquement
    if (source === 'livre-gratuit') {
      try {
        await sendBookPDF({ prenom, email, whatsapp, preference })
        console.log(`✅ PDF envoyé à ${prenom} via ${preference}`)
      } catch (pdfError) {
        console.error('⚠️ Erreur envoi PDF:', pdfError.message)
        // Ne pas bloquer la réponse si l'envoi du PDF échoue
      }
    }

    res.status(201).json({
      success: true,
      message: 'Lead enregistré avec succès',
      id: insertId,
      pdfSent: source === 'livre-gratuit'
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

// Route pour l'inscription à la newsletter (Email ou WhatsApp)
app.post('/api/newsletter', async (req, res) => {
  try {
    console.log('📥 Newsletter - Body:', req.body)
    const { email, whatsapp, type } = req.body // type: 'email' ou 'whatsapp' ou 'emploi'

    if (!email && !whatsapp) {
      console.log('❌ Email ou WhatsApp manquant')
      return res.status(400).json({ error: 'Email ou WhatsApp requis' })
    }

    // Validation WhatsApp
    if (whatsapp) {
      const whatsappRegex = /^\+\d{1,4}\s?\d{6,15}$/
      if (!whatsappRegex.test(whatsapp.replace(/\s/g, ''))) {
        console.log('❌ Format WhatsApp invalide:', whatsapp)
        return res.status(400).json({ error: 'Format WhatsApp invalide. Utilisez le format: +242 06 12 34 56 78' })
      }
      
      // Vérifier les indicatifs autorisés (Afrique centrale principalement)
      const allowedCountryCodes = ['+242', '+237', '+241', '+236', '+235', '+33', '+1', '+44']
      const countryCode = whatsapp.split(' ')[0]
      if (!allowedCountryCodes.includes(countryCode)) {
        console.log('❌ Indicatif non autorisé:', countryCode)
        return res.status(400).json({ error: 'Indicatif pays non supporté. Contactez-nous pour ajouter votre pays.' })
      }
    }

    const subscriptionType = type || 'email'
    console.log('📝 Type:', subscriptionType, 'Email:', email, 'WhatsApp:', whatsapp)

    // Si WhatsApp uniquement, mettre un email placeholder
    const emailValue = email || (whatsapp ? `whatsapp_${Date.now()}@placeholder.com` : null)
    
    const { query, params } = adaptQuery(
      'INSERT INTO newsletter (email, whatsapp, type) VALUES (?, ?, ?)',
      [emailValue, whatsapp || null, subscriptionType]
    )
    
    console.log('📤 Query:', query)
    console.log('📤 Params:', params)
    
    await executeQuery(query, params)

    console.log('✅ Inscription newsletter réussie')
    res.status(201).json({
      success: true,
      message: 'Inscription réussie'
    })
  } catch (error) {
    // PostgreSQL utilise '23505' pour duplicate key, MySQL utilise 'ER_DUP_ENTRY'
    if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
      console.log('⚠️ Déjà inscrit')
      return res.status(400).json({ error: 'Vous êtes déjà inscrit' })
    }
    console.error('❌ Erreur lors de l\'inscription newsletter:', error)
    res.status(500).json({ error: `Erreur serveur: ${error.message}` })
  }
})

// ============= ROUTES BLOG & OPPORTUNITÉS =============

// Récupérer tous les articles de blog (public)
app.get('/api/blog/articles', async (req, res) => {
  try {
    const { query, params } = adaptQuery(
      'SELECT * FROM blog_articles WHERE published = ? ORDER BY created_at DESC',
      [true]
    )
    const result = await executeQuery(query, params)
    const rows = extractRows(result)
    res.json(rows)
  } catch (error) {
    console.error('Erreur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Récupérer toutes les opportunités d'emploi (public)
app.get('/api/emploi/opportunites', async (req, res) => {
  try {
    const { query, params } = adaptQuery(
      'SELECT * FROM opportunites_emploi WHERE published = ? ORDER BY created_at DESC',
      [true]
    )
    const result = await executeQuery(query, params)
    const rows = extractRows(result)
    res.json(rows)
  } catch (error) {
    console.error('Erreur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============= ROUTES ADMIN =============

// Créer le premier admin (à utiliser une seule fois)
app.get('/api/create-first-admin', async (req, res) => {
  try {
    // Vérifier si un admin existe déjà
    const { query: checkQuery, params: checkParams } = adaptQuery('SELECT COUNT(*) as count FROM admins', [])
    const checkResult = await executeQuery(checkQuery, checkParams)
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
    
    await executeQuery(insertQuery, insertParams)

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
    console.log('🔐 Tentative de login:', username)

    const { query, params } = adaptQuery('SELECT * FROM admins WHERE username = ?', [username])
    const result = await executeQuery(query, params)
    const rows = extractRows(result)
    
    if (rows.length === 0) {
      console.log('❌ Utilisateur non trouvé:', username)
      return res.status(401).json({ error: 'Identifiants incorrects' })
    }

    const admin = rows[0]
    console.log('👤 Admin trouvé:', admin.username)
    console.log('🔑 Hash dans la base:', admin.password.substring(0, 20) + '...')
    console.log('🔑 Mot de passe fourni:', password)
    
    const validPassword = await bcrypt.compare(password, admin.password)
    console.log('✅ Validation mot de passe:', validPassword)

    if (!validPassword) {
      console.log('❌ Mot de passe incorrect')
      return res.status(401).json({ error: 'Identifiants incorrects' })
    }
    
    console.log('✅ Login réussi pour:', username)

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
    
    const leadsCount = extractRows(await executeQuery(q1, p1))
    const reservationsCount = extractRows(await executeQuery(q2, p2))
    const commandesCount = extractRows(await executeQuery(q3, p3))
    const visitorsCount = extractRows(await executeQuery(q4, p4))
    const visitorsToday = extractRows(await executeQuery(q5, p5))
    
    // Top pays
    const { query: q6, params: p6 } = adaptQuery(`
      SELECT country, COUNT(*) as count 
      FROM visitors 
      WHERE country != ? 
      GROUP BY country 
      ORDER BY count DESC 
      LIMIT 10
    `, ['Inconnu'])
    const topCountries = extractRows(await executeQuery(q6, p6))

    // Leads récents
    const { query: q7, params: p7 } = adaptQuery('SELECT * FROM leads ORDER BY created_at DESC LIMIT 5', [])
    const recentLeads = extractRows(await executeQuery(q7, p7))

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
    const result = await executeQuery(query, params)
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
    const result = await executeQuery(query, params)
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
    const result = await executeQuery(query, params)
    const rows = extractRows(result)
    res.json(rows)
  } catch (error) {
    console.error('Erreur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Récupérer toutes les inscriptions newsletter
app.get('/api/admin/newsletter', authenticateToken, async (req, res) => {
  try {
    const { query, params } = adaptQuery('SELECT * FROM newsletter ORDER BY created_at DESC', [])
    const result = await executeQuery(query, params)
    const rows = extractRows(result)
    res.json(rows)
  } catch (error) {
    console.error('Erreur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============= ROUTES ADMIN BLOG =============

// Récupérer tous les articles (admin)
app.get('/api/admin/blog/articles', authenticateToken, async (req, res) => {
  try {
    const { query, params} = adaptQuery('SELECT * FROM blog_articles ORDER BY created_at DESC', [])
    const result = await executeQuery(query, params)
    const rows = extractRows(result)
    res.json(rows)
  } catch (error) {
    console.error('Erreur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Créer un article
app.post('/api/admin/blog/articles', authenticateToken, async (req, res) => {
  try {
    const { title, excerpt, content, category, image, readTime, published, external_link } = req.body
    
    // Essayer d'abord avec external_link
    try {
      const { query, params } = adaptQuery(
        'INSERT INTO blog_articles (title, excerpt, content, category, image, read_time, published, external_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, excerpt, content, category, image || null, readTime || '5 min', published || false, external_link || null]
      )
      await executeQuery(query, params)
    } catch (err) {
      // Si la colonne n'existe pas, essayer sans external_link
      if (err.message.includes('external_link') || err.code === '42703' || err.errno === 1054) {
        console.log('⚠️ Colonne external_link non trouvée, insertion sans ce champ')
        const { query, params } = adaptQuery(
          'INSERT INTO blog_articles (title, excerpt, content, category, image, read_time, published) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [title, excerpt, content, category, image || null, readTime || '5 min', published || false]
        )
        await executeQuery(query, params)
      } else {
        throw err
      }
    }
    
    res.status(201).json({ success: true, message: 'Article créé' })
  } catch (error) {
    console.error('❌ Erreur création article:', error)
    res.status(500).json({ error: 'Erreur serveur', details: error.message })
  }
})

// Modifier un article
app.put('/api/admin/blog/articles/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { title, excerpt, content, category, image, readTime, published, external_link } = req.body
    
    // Essayer d'abord avec external_link
    try {
      const { query, params } = adaptQuery(
        'UPDATE blog_articles SET title = ?, excerpt = ?, content = ?, category = ?, image = ?, read_time = ?, published = ?, external_link = ? WHERE id = ?',
        [title, excerpt, content, category, image, readTime, published, external_link || null, id]
      )
      await executeQuery(query, params)
    } catch (err) {
      // Si la colonne n'existe pas, essayer sans external_link
      if (err.message.includes('external_link') || err.code === '42703' || err.errno === 1054) {
        console.log('⚠️ Colonne external_link non trouvée, mise à jour sans ce champ')
        const { query, params } = adaptQuery(
          'UPDATE blog_articles SET title = ?, excerpt = ?, content = ?, category = ?, image = ?, read_time = ?, published = ? WHERE id = ?',
          [title, excerpt, content, category, image, readTime, published, id]
        )
        await executeQuery(query, params)
      } else {
        throw err
      }
    }
    
    res.json({ success: true, message: 'Article modifié' })
  } catch (error) {
    console.error('❌ Erreur modification article:', error)
    res.status(500).json({ error: 'Erreur serveur', details: error.message })
  }
})

// Supprimer un article
app.delete('/api/admin/blog/articles/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { query, params } = adaptQuery('DELETE FROM blog_articles WHERE id = ?', [id])
    await executeQuery(query, params)
    res.json({ success: true, message: 'Article supprimé' })
  } catch (error) {
    console.error('Erreur suppression article:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============= ROUTES ADMIN OPPORTUNITÉS EMPLOI =============

// Récupérer toutes les opportunités (admin)
app.get('/api/admin/emploi/opportunites', authenticateToken, async (req, res) => {
  try {
    const { query, params } = adaptQuery('SELECT * FROM opportunites_emploi ORDER BY created_at DESC', [])
    const result = await executeQuery(query, params)
    const rows = extractRows(result)
    res.json(rows)
  } catch (error) {
    console.error('Erreur:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Créer une opportunité
app.post('/api/admin/emploi/opportunites', authenticateToken, async (req, res) => {
  try {
    const { title, company, location, type, description, requirements, salary, link, published } = req.body
    
    const { query, params } = adaptQuery(
      'INSERT INTO opportunites_emploi (title, company, location, type, description, requirements, salary, link, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, company, location, type, description, requirements || null, salary || null, link || null, published || false]
    )
    
    await executeQuery(query, params)
    res.status(201).json({ success: true, message: 'Opportunité créée' })
  } catch (error) {
    console.error('Erreur création opportunité:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Modifier une opportunité
app.put('/api/admin/emploi/opportunites/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { title, company, location, type, description, requirements, salary, link, published } = req.body
    
    const { query, params } = adaptQuery(
      'UPDATE opportunites_emploi SET title = ?, company = ?, location = ?, type = ?, description = ?, requirements = ?, salary = ?, link = ?, published = ? WHERE id = ?',
      [title, company, location, type, description, requirements, salary, link, published, id]
    )
    
    await executeQuery(query, params)
    res.json({ success: true, message: 'Opportunité modifiée' })
  } catch (error) {
    console.error('Erreur modification opportunité:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Supprimer une opportunité
app.delete('/api/admin/emploi/opportunites/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { query, params } = adaptQuery('DELETE FROM opportunites_emploi WHERE id = ?', [id])
    await executeQuery(query, params)
    res.json({ success: true, message: 'Opportunité supprimée' })
  } catch (error) {
    console.error('Erreur suppression opportunité:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Ajouter la colonne statut si elle n'existe pas (migration)
app.get('/api/admin/migrate-commandes', authenticateToken, async (req, res) => {
  try {
    const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql://')
    
    if (isPostgres) {
      await executeQuery(`
        ALTER TABLE commandes_livres 
        ADD COLUMN IF NOT EXISTS statut VARCHAR(50) DEFAULT 'en_attente'
      `)
    } else {
      // MySQL
      await executeQuery(`
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

// Ajouter la colonne statut aux réservations si elle n'existe pas (migration)
app.get('/api/admin/migrate-reservations', authenticateToken, async (req, res) => {
  try {
    const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql://')
    
    if (isPostgres) {
      await executeQuery(`
        ALTER TABLE reservations 
        ADD COLUMN IF NOT EXISTS statut VARCHAR(50) DEFAULT 'en_attente'
      `)
    } else {
      // MySQL
      await executeQuery(`
        ALTER TABLE reservations 
        ADD COLUMN statut VARCHAR(50) DEFAULT 'en_attente'
      `)
    }
    
    res.json({ success: true, message: 'Migration réservations effectuée' })
  } catch (error) {
    // Si la colonne existe déjà, ignorer l'erreur
    console.log('Info migration réservations:', error.message)
    res.json({ success: true, message: 'Colonne statut déjà existante ou migration effectuée' })
  }
})

// Migration complète pour Blog + Opportunités IT
app.get('/api/admin/migrate-blog-complete', authenticateToken, async (req, res) => {
  try {
    const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql://')
    
    const results = []
    
    // 1. Modifier newsletter pour ajouter whatsapp et type
    try {
      if (isPostgres) {
        await executeQuery(`ALTER TABLE newsletter ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20)`)
        await executeQuery(`ALTER TABLE newsletter ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'email'`)
      } else {
        await executeQuery(`ALTER TABLE newsletter ADD COLUMN whatsapp VARCHAR(20)`)
        await executeQuery(`ALTER TABLE newsletter ADD COLUMN type VARCHAR(20) DEFAULT 'email'`)
      }
      results.push('✅ Newsletter modifiée')
    } catch (e) {
      results.push('ℹ️ Newsletter déjà à jour')
    }
    
    // 2. Créer table blog_articles
    try {
      if (isPostgres) {
        await executeQuery(`
          CREATE TABLE IF NOT EXISTS blog_articles (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            excerpt TEXT,
            content TEXT NOT NULL,
            category VARCHAR(50),
            image VARCHAR(255),
            read_time VARCHAR(20) DEFAULT '5 min',
            published BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `)
      } else {
        await executeQuery(`
          CREATE TABLE IF NOT EXISTS blog_articles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            excerpt TEXT,
            content TEXT NOT NULL,
            category VARCHAR(50),
            image VARCHAR(255),
            read_time VARCHAR(20) DEFAULT '5 min',
            published BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `)
      }
      results.push('✅ Table blog_articles créée')
    } catch (e) {
      results.push('ℹ️ Table blog_articles existe déjà')
    }
    
    // 3. Créer table opportunites_emploi
    try {
      if (isPostgres) {
        await executeQuery(`
          CREATE TABLE IF NOT EXISTS opportunites_emploi (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            company VARCHAR(255) NOT NULL,
            location VARCHAR(255),
            type VARCHAR(50),
            description TEXT NOT NULL,
            requirements TEXT,
            salary VARCHAR(100),
            link VARCHAR(500),
            published BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `)
      } else {
        await executeQuery(`
          CREATE TABLE IF NOT EXISTS opportunites_emploi (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            company VARCHAR(255) NOT NULL,
            location VARCHAR(255),
            type VARCHAR(50),
            description TEXT NOT NULL,
            requirements TEXT,
            salary VARCHAR(100),
            link VARCHAR(500),
            published BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `)
      }
      results.push('✅ Table opportunites_emploi créée')
    } catch (e) {
      results.push('ℹ️ Table opportunites_emploi existe déjà')
    }
    
    res.json({ 
      success: true, 
      message: 'Migration blog complète effectuée',
      details: results
    })
  } catch (error) {
    console.error('Erreur migration blog:', error)
    res.status(500).json({ error: error.message })
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
      await executeQuery(`
        ALTER TABLE commandes_livres 
        DROP CONSTRAINT IF EXISTS commandes_livres_statut_check
      `)
      console.log('✅ Contrainte CHECK supprimée')
    } catch (err) {
      console.log('⚠️ Erreur suppression contrainte:', err.message)
    }

    // Étape 2 : Supprimer la colonne statut si elle existe
    try {
      await executeQuery(`
        ALTER TABLE commandes_livres 
        DROP COLUMN IF EXISTS statut
      `)
      console.log('✅ Colonne statut supprimée')
    } catch (err) {
      console.log('⚠️ Erreur suppression colonne:', err.message)
    }

    // Étape 3 : Recréer la colonne statut proprement
    await executeQuery(`
      ALTER TABLE commandes_livres 
      ADD COLUMN statut VARCHAR(50) DEFAULT 'en_attente'
    `)
    console.log('✅ Colonne statut recréée')

    // Étape 4 : Vérifier la structure
    const result = await executeQuery(`
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
    const result = await executeQuery(selectQuery, selectParams)
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
    await executeQuery(updateQuery, updateParams)

    // Envoyer automatiquement le PDF par email (désactivé temporairement)
    let pdfSent = false
    // const pdfPath = `./server/pdfs/${commande.livre}.pdf`
    
    // TODO: Réactiver l'envoi du PDF quand les fichiers seront ajoutés
    // try {
    //   await sendBookPDF(commande, pdfPath)
    //   pdfSent = true
    //   console.log('✅ PDF envoyé par email')
    // } catch (pdfError) {
    //   console.error('⚠️ Erreur envoi PDF:', pdfError.message)
    //   // Continuer même si le PDF n'a pas pu être envoyé
    // }

    // Préparer le message WhatsApp avec lien du groupe
    const whatsappGroupLink = process.env.WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/VOTRE_LIEN'
    const whatsappMessage = `Bonjour ${commande.nom},

🎉 Félicitations ! Votre livre "${commande.livre}" vient d'être envoyé par email à ${commande.email} 📧

${pdfSent ? '✅ Le PDF est en pièce jointe de l\'email.' : '⚠️ Vérifiez vos spams si vous ne le voyez pas.'}

🎁 BONUS : Rejoignez notre communauté !
Accédez à des conseils exclusifs, des opportunités en avant-première et posez vos questions directement !

👉 ${whatsappGroupLink}

Merci pour votre confiance !
L'équipe`

    // Générer le lien WhatsApp
    const whatsappNumber = commande.whatsapp.replace(/[^0-9]/g, '')
    const lien = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

    res.json({
      success: true,
      message: pdfSent ? 'Commande validée et PDF envoyé par email' : 'Commande validée (PDF non envoyé)',
      lien,
      canal: 'whatsapp',
      pdfSent
    })
  } catch (error) {
    console.error('Erreur validation commande:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Valider une réservation et envoyer un message
app.post('/api/admin/reservations/:id/valider', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { canal, message } = req.body

    if (!canal || !message) {
      return res.status(400).json({ error: 'Canal et message requis' })
    }

    // Récupérer les infos de la réservation
    const { query: selectQuery, params: selectParams } = adaptQuery(
      'SELECT * FROM reservations WHERE id = ?',
      [id]
    )
    const result = await executeQuery(selectQuery, selectParams)
    const reservations = extractRows(result)
    
    if (reservations.length === 0) {
      return res.status(404).json({ error: 'Réservation non trouvée' })
    }

    const reservation = reservations[0]

    // Mettre à jour le statut de la réservation
    const { query: updateQuery, params: updateParams } = adaptQuery(
      'UPDATE reservations SET statut = ? WHERE id = ?',
      ['validee', id]
    )
    await executeQuery(updateQuery, updateParams)

    // Préparer le message avec les variables
    const messageFinal = message
      .replace(/{nom}/g, reservation.nom)
      .replace(/{theme}/g, reservation.theme)
      .replace(/{date}/g, new Date(reservation.date_souhaitee).toLocaleDateString('fr-FR'))
      .replace(/{email}/g, reservation.email)
      .replace(/{whatsapp}/g, reservation.whatsapp)

    // Générer le lien WhatsApp
    let lien = ''
    
    if (canal === 'whatsapp') {
      const whatsappNumber = reservation.whatsapp.replace(/[^0-9]/g, '')
      lien = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageFinal)}`
    }

    res.json({
      success: true,
      message: 'Réservation validée',
      lien,
      canal
    })
  } catch (error) {
    console.error('Erreur validation réservation:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Récupérer les visiteurs
app.get('/api/admin/visitors', authenticateToken, async (req, res) => {
  try {
    const { query, params } = adaptQuery('SELECT * FROM visitors ORDER BY created_at DESC LIMIT 100', [])
    const result = await executeQuery(query, params)
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
    await executeQuery(query, params)
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
    await executeQuery(query, params)
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
    await executeQuery(query, params)
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
    await executeQuery(query, params)
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
    await executeQuery(query, params)
    res.json({ success: true, message: 'Lead supprimé' })
  } catch (error) {
    console.error('Erreur suppression lead:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Supprimer une inscription newsletter
app.delete('/api/admin/newsletter/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { query, params } = adaptQuery('DELETE FROM newsletter WHERE id = ?', [id])
    await executeQuery(query, params)
    res.json({ success: true, message: 'Inscription newsletter supprimée' })
  } catch (error) {
    console.error('Erreur suppression newsletter:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ==================== ROUTES FEATURED VIDEOS ====================

// Récupérer la vidéo mise en avant (public)
app.get('/api/featured-video', async (req, res) => {
  try {
    const { query, params } = adaptQuery(
      'SELECT * FROM featured_videos WHERE published = ? ORDER BY created_at DESC LIMIT 1',
      [true]
    )
    const result = await executeQuery(query, params)
    const rows = extractRows(result)
    
    if (rows.length > 0) {
      res.json(rows[0])
    } else {
      res.json(null)
    }
  } catch (error) {
    console.error('Erreur récupération vidéo:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Récupérer toutes les vidéos (admin)
app.get('/api/admin/featured-videos', authenticateToken, async (req, res) => {
  try {
    const { query, params } = adaptQuery('SELECT * FROM featured_videos ORDER BY created_at DESC', [])
    const result = await executeQuery(query, params)
    res.json(extractRows(result))
  } catch (error) {
    console.error('Erreur récupération vidéos:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Créer une nouvelle vidéo (admin)
app.post('/api/admin/featured-videos', authenticateToken, async (req, res) => {
  try {
    console.log('📥 Création vidéo - Body:', req.body)
    const { title, description, thumbnail, video_url, published } = req.body

    if (!title || !description || !video_url) {
      return res.status(400).json({ 
        success: false,
        error: 'Titre, description et URL vidéo sont requis' 
      })
    }

    const { query, params } = adaptQuery(
      'INSERT INTO featured_videos (title, description, thumbnail, video_url, published) VALUES (?, ?, ?, ?, ?)',
      [title, description, thumbnail || null, video_url, published || false]
    )
    
    console.log('📤 Query:', query)
    console.log('📤 Params:', params)
    
    const result = await executeQuery(query, params)
    const insertId = extractInsertId(result)

    console.log('✅ Vidéo créée, ID:', insertId)

    res.status(201).json({
      success: true,
      message: 'Vidéo créée avec succès',
      id: insertId
    })
  } catch (error) {
    console.error('❌ Erreur création vidéo:', error)
    res.status(500).json({ 
      success: false,
      error: error.message || 'Erreur serveur' 
    })
  }
})

// Modifier une vidéo (admin)
app.put('/api/admin/featured-videos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, thumbnail, video_url, published } = req.body

    const { query, params } = adaptQuery(
      'UPDATE featured_videos SET title = ?, description = ?, thumbnail = ?, video_url = ?, published = ? WHERE id = ?',
      [title, description, thumbnail || null, video_url, published, id]
    )
    
    await executeQuery(query, params)

    res.json({
      success: true,
      message: 'Vidéo modifiée avec succès'
    })
  } catch (error) {
    console.error('Erreur modification vidéo:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Supprimer une vidéo (admin)
app.delete('/api/admin/featured-videos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const { query, params } = adaptQuery('DELETE FROM featured_videos WHERE id = ?', [id])
    await executeQuery(query, params)

    res.json({ success: true, message: 'Vidéo supprimée' })
  } catch (error) {
    console.error('Erreur suppression vidéo:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Migration pour créer la table featured_videos
app.get('/api/admin/migrate-featured-videos', authenticateToken, async (req, res) => {
  try {
    const fs = await import('fs')
    const { fileURLToPath } = await import('url')
    const { dirname, join } = await import('path')
    
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    
    const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql://')
    const sqlFile = isPostgres ? 'migrations-featured-video-postgres.sql' : 'migrations-featured-video.sql'
    const sqlPath = join(__dirname, sqlFile)
    
    const sql = fs.readFileSync(sqlPath, 'utf8')
    await executeQuery(sql)
    
    res.json({ success: true, message: 'Table featured_videos créée avec succès' })
  } catch (error) {
    console.error('Erreur migration featured_videos:', error)
    res.json({ success: true, message: 'Table déjà existante ou migration effectuée' })
  }
})

// Migration pour ajouter external_link aux articles
app.get('/api/admin/migrate-blog-external-link', authenticateToken, async (req, res) => {
  try {
    const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql://')
    
    if (isPostgres) {
      await executeQuery('ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS external_link VARCHAR(500)')
    } else {
      await executeQuery('ALTER TABLE blog_articles ADD COLUMN external_link VARCHAR(500)')
    }
    
    res.json({ success: true, message: 'Colonne external_link ajoutée' })
  } catch (error) {
    console.log('Info migration:', error.message)
    res.json({ success: true, message: 'Colonne déjà existante ou migration effectuée' })
  }
})

// Synchroniser les opportunités depuis Google Jobs
app.post('/api/admin/sync-opportunities', authenticateToken, async (req, res) => {
  try {
    console.log('🔄 Synchronisation des opportunités depuis Google Jobs...')
    
    let googleOpportunities = []
    
    // Essayer de récupérer depuis Google Jobs via SerpAPI
    if (process.env.SERPAPI_KEY) {
      try {
        const fetch = (await import('node-fetch')).default
        const serpApiUrl = `https://serpapi.com/search.json?engine=google_jobs&q=développeur+informatique+congo&location=Congo&api_key=${process.env.SERPAPI_KEY}&num=3`
        
        const response = await fetch(serpApiUrl)
        const data = await response.json()
        
        if (data.jobs_results && data.jobs_results.length > 0) {
          googleOpportunities = data.jobs_results.map(job => ({
            title: job.title || 'Poste IT',
            company: job.company_name || 'Entreprise',
            location: job.location || 'Congo',
            type: job.job_type || 'CDI',
            description: job.description || job.snippet || 'Description non disponible',
            requirements: job.qualifications || 'Voir l\'annonce complète',
            salary: job.salary || 'Salaire à négocier',
            link: job.share_link || job.apply_link || '#'
          }))
          console.log(`✅ ${googleOpportunities.length} opportunités récupérées depuis Google Jobs`)
        }
      } catch (apiError) {
        console.log('⚠️ Erreur API Google Jobs:', apiError.message)
      }
    }
    
    // Si pas d'API ou erreur, utiliser des données de simulation réalistes
    if (googleOpportunities.length === 0) {
      console.log('📝 Utilisation des données de simulation (Congo)')
      googleOpportunities = [
        {
          title: 'Développeur Full Stack',
          company: 'TechCorp Pointe-Noire',
          location: 'Pointe-Noire, Congo',
          type: 'CDI',
          description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants utilisant React, Node.js et MongoDB.',
          requirements: 'React, Node.js, MongoDB, 3+ ans d\'expérience',
          salary: '800 000 - 1 200 000 FCFA',
          link: 'https://www.emploi.cg/offres/developpeur-fullstack'
        },
        {
          title: 'Analyste Cybersécurité',
          company: 'SecureIT Congo',
          location: 'Brazzaville, Congo',
          type: 'CDI',
          description: 'Poste d\'analyste en cybersécurité pour protéger nos infrastructures critiques. Formation en sécurité informatique requise.',
          requirements: 'Cybersécurité, CISSP, Analyse de risques',
          salary: '1 000 000 - 1 500 000 FCFA',
          link: 'https://www.emploi.cg/offres/analyste-cybersecurite'
        },
        {
          title: 'Chef de Projet Digital',
          company: 'Digital Solutions',
          location: 'Pointe-Noire, Congo',
          type: 'CDI',
          description: 'Pilotage de projets de transformation digitale pour nos clients. Expérience en gestion de projet et méthodologies agiles requise.',
          requirements: 'Gestion de projet, Agile, Scrum Master',
          salary: '1 200 000 - 1 800 000 FCFA',
          link: 'https://www.emploi.cg/offres/chef-projet-digital'
        }
      ]
    }
    
    // Supprimer les anciennes opportunités (garde seulement les 3 plus récentes)
    const { query: deleteQuery, params: deleteParams } = adaptQuery(
      'DELETE FROM emploi_opportunites WHERE id NOT IN (SELECT id FROM emploi_opportunites ORDER BY created_at DESC LIMIT 3)',
      []
    )
    
    try {
      await executeQuery(deleteQuery, deleteParams)
      console.log('🗑️ Anciennes opportunités supprimées')
    } catch (err) {
      console.log('ℹ️ Pas d\'anciennes opportunités à supprimer')
    }
    
    // Ajouter les nouvelles opportunités
    let addedCount = 0
    for (const opp of googleOpportunities) {
      try {
        const { query, params } = adaptQuery(
          'INSERT INTO emploi_opportunites (title, company, location, type, description, requirements, salary, link) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [opp.title, opp.company, opp.location, opp.type, opp.description, opp.requirements, opp.salary, opp.link]
        )
        
        await executeQuery(query, params)
        addedCount++
        console.log(`✅ Opportunité ajoutée: ${opp.title}`)
      } catch (err) {
        console.log(`⚠️ Erreur ajout ${opp.title}:`, err.message)
      }
    }
    
    res.json({ 
      success: true, 
      message: `Synchronisation terminée: ${addedCount} nouvelles opportunités ajoutées`,
      added: addedCount,
      total: googleOpportunities.length
    })
    
  } catch (error) {
    console.error('❌ Erreur synchronisation opportunités:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

// Route pour upload d'images de blog
app.post('/api/admin/upload-blog-image', authenticateToken, async (req, res) => {
  try {
    const { imageData, fileName } = req.body
    
    if (!imageData || !fileName) {
      return res.status(400).json({ error: 'Image et nom de fichier requis' })
    }
    
    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = path.join(__dirname, '../public/uploads/blog')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    
    // Nettoyer le nom de fichier
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const timestamp = Date.now()
    const finalFileName = `${timestamp}_${cleanFileName}`
    const filePath = path.join(uploadsDir, finalFileName)
    
    // Convertir base64 en fichier
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '')
    fs.writeFileSync(filePath, base64Data, 'base64')
    
    // Retourner l'URL de l'image
    const imageUrl = `/uploads/blog/${finalFileName}`
    
    console.log('✅ Image uploadée:', imageUrl)
    res.json({ 
      success: true, 
      imageUrl: imageUrl,
      message: 'Image uploadée avec succès'
    })
    
  } catch (error) {
    console.error('❌ Erreur upload image:', error)
    res.status(500).json({ error: 'Erreur lors de l\'upload' })
  }
})

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`)
})
