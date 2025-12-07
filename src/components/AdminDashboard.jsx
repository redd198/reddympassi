import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUsers, FaCalendar, FaBook, FaGlobe, FaSignOutAlt, FaChartLine, FaWhatsapp, FaTrash, FaEnvelope, FaNewspaper, FaBriefcase, FaEdit, FaEye, FaBars, FaTimes, FaSyncAlt, FaPlay } from 'react-icons/fa'

const AdminDashboard = ({ token, onLogout }) => {
  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [leads, setLeads] = useState([])
  const [reservations, setReservations] = useState([])
  const [commandes, setCommandes] = useState([])
  const [visitors, setVisitors] = useState([])
  const [newsletter, setNewsletter] = useState([])
  const [blogArticles, setBlogArticles] = useState([])
  const [opportunites, setOpportunites] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true) // Menu ouvert par défaut sur desktop
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [selectedCommande, setSelectedCommande] = useState(null)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [validationType, setValidationType] = useState('commande') // 'commande' ou 'reservation'
  const [validationCanal, setValidationCanal] = useState('whatsapp')
  const [validationMessage, setValidationMessage] = useState('')
  
  // États pour les formulaires Blog, Opportunités et Vidéos
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [showOpportuniteModal, setShowOpportuniteModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [showCommandeModal, setShowCommandeModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [selectedReservationDetail, setSelectedReservationDetail] = useState(null)
  const [selectedCommandeDetail, setSelectedCommandeDetail] = useState(null)
  const [editingArticle, setEditingArticle] = useState(null)
  const [editingOpportunite, setEditingOpportunite] = useState(null)
  const [editingVideo, setEditingVideo] = useState(null)
  const [articleForm, setArticleForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Innovation',
    image: '',
    read_time: '5 min',
    published: false,
    external_link: ''
  })
  const [opportuniteForm, setOpportuniteForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'CDI',
    description: '',
    requirements: '',
    salary: '',
    link: '',
    published: false
  })
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    thumbnail: '',
    video_url: '',
    published: false
  })

  const fetchData = async (abortController = null) => {
    try {
      console.log('🔄 Début fetchData...')
      const headers = { 'Authorization': `Bearer ${token}` }
      const options = abortController ? { headers, signal: abortController.signal } : { headers }
      
      const [statsRes, leadsRes, reservationsRes, commandesRes, visitorsRes, newsletterRes, blogRes, opportunitesRes, videosRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/stats`, options),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/leads`, options),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/reservations`, options),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/commandes`, options),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/visitors`, options),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/newsletter`, options),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/blog/articles`, options),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/emploi/opportunites`, options),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/featured-videos`, options)
      ])

      console.log('✅ Requêtes terminées')
      
      setStats(await statsRes.json())
      setLeads(await leadsRes.json())
      setReservations(await reservationsRes.json())
      setCommandes(await commandesRes.json())
      setVisitors(await visitorsRes.json())
      setNewsletter(await newsletterRes.json())
      setBlogArticles(await blogRes.json())
      setOpportunites(await opportunitesRes.json())
      setVideos(await videosRes.json())
      
      console.log('✅ Données chargées')
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('❌ Erreur fetchData:', error)
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('🚀 AdminDashboard mounted')
    let mounted = true
    const abortController = new AbortController()
    
    if (mounted) {
      fetchData(abortController)
    }
    
    // Auto-refresh toutes les 2 minutes (au lieu de 30 secondes)
    // Réduit la charge mémoire et évite l'écran blanc
    const interval = setInterval(() => {
      if (mounted) {
        fetchData()
      }
    }, 120000) // 2 minutes
    
    // Timeout de sécurité : rafraîchir la page après 10 minutes
    const timeout = setTimeout(() => {
      if (mounted) {
        console.log('⏰ Timeout 10min - Reload page')
        window.location.reload()
      }
    }, 600000) // 10 minutes
    
    return () => {
      console.log('🛑 AdminDashboard unmounting')
      mounted = false
      abortController.abort()
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [token])

  const handleValidateCommande = (commande) => {
    setValidationType('commande')
    setSelectedCommande(commande)
    setSelectedReservation(null)
    setValidationMessage(`Bonjour ${commande.nom},\n\nVotre commande pour le livre "${commande.livre}" a été validée !\n\nNous vous contacterons très prochainement pour finaliser la livraison.\n\nMerci pour votre confiance !\n\nCordialement,\nL'équipe`)
    setShowValidationModal(true)
  }

  const handleValidateReservation = (reservation) => {
    setValidationType('reservation')
    setSelectedReservation(reservation)
    setSelectedCommande(null)
    setValidationMessage(`Bonjour ${reservation.nom},\n\nVotre réservation pour le coaching "${reservation.theme}" a été validée !\n\nDate souhaitée : ${new Date(reservation.date_souhaitee).toLocaleDateString('fr-FR')}\n\nNous vous contacterons très prochainement pour confirmer les détails et vous envoyer le document de confirmation.\n\nMerci pour votre confiance !\n\nCordialement,\nL'équipe`)
    setShowValidationModal(true)
  }

  const submitValidation = async () => {
    try {
      const isCommande = validationType === 'commande'
      const item = isCommande ? selectedCommande : selectedReservation
      const itemId = item.id
      const itemType = isCommande ? 'commandes' : 'reservations'
      const itemLabel = isCommande ? 'Commande' : 'Réservation'
      
      // Fermer le modal immédiatement pour une meilleure UX
      setShowValidationModal(false)
      setSelectedCommande(null)
      setSelectedReservation(null)

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/${itemType}/${itemId}/valider`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            canal: validationCanal,
            message: validationMessage
          })
        }
      )

      const data = await response.json()

      if (data.success) {
        // Toujours ouvrir WhatsApp
        if (data.lien) {
          window.open(data.lien, '_blank')
        }
        
        alert(`✅ ${itemLabel} validée ! Le lien WhatsApp a été ouvert.`)
        
        // Rafraîchir les données après l'alerte
        await fetchData()
      } else {
        alert('❌ Erreur : ' + (data.message || 'Erreur inconnue'))
      }
    } catch (error) {
      console.error('Erreur validation:', error)
      alert('❌ Erreur lors de la validation')
    }
  }

  // Fonction de suppression générique
  const handleDelete = async (type, id, name) => {
    if (!window.confirm(`Confirmer la suppression ?\n\nCette action est irréversible. Voulez-vous vraiment supprimer cet enregistrement ?\n\n${name || ''}`)) {
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/${type}/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (data.success) {
        alert('✅ Suppression effectuée')
        await fetchData()
      } else {
        alert('❌ Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur suppression:', error)
      alert('❌ Erreur lors de la suppression')
    }
  }

  // Fonctions Blog
  const handleNewArticle = () => {
    setEditingArticle(null)
    setArticleForm({
      title: '',
      excerpt: '',
      content: '',
      category: 'Innovation',
      image: '',
      read_time: '5 min',
      published: false,
      external_link: ''
    })
    setShowBlogModal(true)
  }

  const handleEditArticle = (article) => {
    setEditingArticle(article)
    setArticleForm({
      ...article,
      external_link: article.external_link || ''
    })
    console.log('🔍 Article chargé:', article.title, 'external_link:', article.external_link)
    setShowBlogModal(true)
  }

  const handleSaveArticle = async () => {
    try {
      console.log('💾 Sauvegarde article:', articleForm.title, 'external_link:', articleForm.external_link)
      
      const url = editingArticle
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/blog/articles/${editingArticle.id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/blog/articles`
      
      const method = editingArticle ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articleForm)
      })

      const data = await response.json()

      if (data.success) {
        alert(`✅ Article ${editingArticle ? 'modifié' : 'créé'} avec succès`)
        setShowBlogModal(false)
        await fetchData()
      } else {
        alert('❌ Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('❌ Erreur lors de la sauvegarde')
    }
  }

  // Fonctions Opportunités
  const handleSyncOpportunities = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/sync-opportunities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (response.ok) {
        alert(`✅ ${data.message}`)
        // Recharger les opportunités
        fetchOpportunites()
      } else {
        alert(`❌ Erreur: ${data.error}`)
      }
    } catch (error) {
      console.error('Erreur sync opportunités:', error)
      alert('❌ Erreur de connexion au serveur')
    }
  }

  const handleNewOpportunite = () => {
    setEditingOpportunite(null)
    setOpportuniteForm({
      title: '',
      company: '',
      location: '',
      type: 'CDI',
      description: '',
      requirements: '',
      salary: '',
      link: '',
      published: false
    })
    setShowOpportuniteModal(true)
  }

  const handleEditOpportunite = (opp) => {
    setEditingOpportunite(opp)
    setOpportuniteForm(opp)
    setShowOpportuniteModal(true)
  }

  const handleSaveOpportunite = async () => {
    try {
      const url = editingOpportunite
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/emploi/opportunites/${editingOpportunite.id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/emploi/opportunites`
      
      const method = editingOpportunite ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(opportuniteForm)
      })

      const data = await response.json()

      if (data.success) {
        alert(`✅ Opportunité ${editingOpportunite ? 'modifiée' : 'créée'} avec succès`)
        setShowOpportuniteModal(false)
        await fetchData()
      } else {
        alert('❌ Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('❌ Erreur lors de la sauvegarde')
    }
  }

  // Fonctions Vidéos
  const handleNewVideo = () => {
    setEditingVideo(null)
    setVideoForm({
      title: '',
      description: '',
      thumbnail: '',
      video_url: '',
      published: false
    })
    setShowVideoModal(true)
  }

  const handleEditVideo = (video) => {
    setEditingVideo(video)
    setVideoForm(video)
    setShowVideoModal(true)
  }

  const handleSaveVideo = async () => {
    try {
      console.log('📤 Envoi vidéo:', videoForm)
      
      const url = editingVideo
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/featured-videos/${editingVideo.id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/featured-videos`
      
      const method = editingVideo ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(videoForm)
      })

      console.log('📥 Réponse status:', response.status)
      const data = await response.json()
      console.log('📥 Réponse data:', data)

      if (data.success) {
        alert(`✅ Vidéo ${editingVideo ? 'modifiée' : 'créée'} avec succès`)
        setShowVideoModal(false)
        await fetchData()
      } else {
        alert(`❌ Erreur lors de la sauvegarde: ${data.error || data.message || 'Erreur inconnue'}`)
      }
    } catch (error) {
      console.error('❌ Erreur catch:', error)
      alert(`❌ Erreur lors de la sauvegarde: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setLoading(true)
              fetchData()
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
          <button
            onClick={onLogout}
            className="ml-4 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    )
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'leads', label: 'Leads', icon: FaUsers },
    { id: 'reservations', label: 'Réservations', icon: FaCalendar },
    { id: 'commandes', label: 'Commandes', icon: FaBook },
    { id: 'blog', label: 'Blog', icon: FaNewspaper },
    { id: 'opportunites', label: 'Opportunités IT', icon: FaBriefcase },
    { id: 'videos', label: 'Vidéos', icon: FaPlay },
    { id: 'newsletter', label: 'Newsletter', icon: FaEnvelope },
    { id: 'visitors', label: 'Visiteurs', icon: FaGlobe }
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className="fixed left-0 top-0 h-full w-70 bg-white shadow-xl z-40 flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Admin</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-600 hover:text-gray-800"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                // Fermer le menu sur mobile après sélection
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false)
                }
              }}
              className={`w-full flex items-center gap-3 px-6 py-4 transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white border-r-4 border-blue-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            <FaSignOutAlt />
            Déconnexion
          </button>
        </div>
      </motion.aside>

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-70' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className="bg-white shadow-md sticky top-0 z-20">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaBars size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
            </div>
            <button
              onClick={() => {
                setLoading(true)
                fetchData()
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Rafraîchir les données"
            >
              <FaSyncAlt />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard icon={FaUsers} label="Total Leads" value={stats.stats.leads} color="blue" />
              <StatCard icon={FaCalendar} label="Réservations" value={stats.stats.reservations} color="green" />
              <StatCard icon={FaBook} label="Commandes" value={stats.stats.commandes} color="purple" />
              <StatCard icon={FaGlobe} label="Visiteurs (Aujourd'hui)" value={stats.stats.visitorsToday} color="orange" />
            </div>

            {/* Top Countries */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">🌍 Top Pays des Visiteurs</h2>
              <div className="space-y-3">
                {stats.topCountries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-semibold">{country.country}</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{country.count} visites</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Leads */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">🎯 Leads Récents</h2>
              <div className="space-y-4">
                {stats.recentLeads.map(lead => (
                  <div key={lead.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="font-semibold">{lead.prenom}</p>
                    <p className="text-sm text-gray-600">{lead.email} • {lead.whatsapp}</p>
                    <p className="text-xs text-gray-500">{new Date(lead.created_at).toLocaleString('fr-FR')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">📋 Liste des Leads</h2>
              <p className="text-gray-600">{leads.length} entrée(s)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedLead(lead)
                            setShowLeadModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-800 font-semibold hover:underline text-left"
                        >
                          {lead.prenom}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">{lead.email}</div>
                          <div className="text-gray-500">{lead.whatsapp}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          lead.statut === 'converti' ? 'bg-green-100 text-green-800' :
                          lead.statut === 'en_cours' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.statut || 'nouveau'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedLead(lead)
                              setShowLeadModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                            title="Voir les détails"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleDelete('leads', lead.id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-2"
                            title="Supprimer ce lead"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">📅 Liste des Réservations</h2>
              <p className="text-gray-600">{reservations.length} entrée(s)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thème</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date souhaitée</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedReservationDetail(reservation)
                            setShowReservationModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-800 font-semibold hover:underline text-left"
                        >
                          {reservation.nom}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{reservation.theme}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(reservation.date_souhaitee).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          reservation.statut === 'validee' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reservation.statut === 'validee' ? '✓ Validée' : '⏳ En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedReservationDetail(reservation)
                              setShowReservationModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                            title="Voir les détails"
                          >
                            <FaEye />
                          </button>
                          {reservation.statut !== 'validee' && (
                            <button
                              onClick={() => handleValidateReservation(reservation)}
                              className="text-green-600 hover:text-green-800 transition-colors p-2"
                              title="Valider"
                            >
                              ✓
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete('reservations', reservation.id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-2"
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Commandes Tab */}
        {activeTab === 'commandes' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">📚 Liste des Commandes</h2>
              <p className="text-gray-600">{commandes.length} entrée(s)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {commandes.map((commande) => (
                    <tr key={commande.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedCommandeDetail(commande)
                            setShowCommandeModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-800 font-semibold hover:underline text-left"
                        >
                          {commande.nom}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{commande.livre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          commande.statut === 'validee' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {commande.statut === 'validee' ? '✓ Validée' : '⏳ En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(commande.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedCommandeDetail(commande)
                              setShowCommandeModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                            title="Voir les détails"
                          >
                            <FaEye />
                          </button>
                          {commande.statut !== 'validee' && (
                            <button
                              onClick={() => handleValidateCommande(commande)}
                              className="text-green-600 hover:text-green-800 transition-colors p-2"
                              title="Valider"
                            >
                              ✓
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete('commandes', commande.id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-2"
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">📰 Articles de Blog</h2>
                <p className="text-gray-600">{blogArticles.length} article(s)</p>
              </div>
              <button 
                onClick={handleNewArticle}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                + Nouvel article
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {blogArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{article.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          article.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {article.published ? '✓ Publié' : '○ Brouillon'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(article.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditArticle(article)}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete('blog/articles', article.id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-2"
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Opportunités IT Tab */}
        {activeTab === 'opportunites' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">💼 Opportunités d'Emploi IT</h2>
                <p className="text-gray-600">{opportunites.length} opportunité(s)</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleSyncOpportunities}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
                >
                  🔄 Synchroniser
                </button>
                <button 
                  onClick={handleNewOpportunite}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  + Nouvelle opportunité
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {opportunites.map((opp) => (
                    <tr key={opp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{opp.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{opp.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{opp.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{opp.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          opp.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {opp.published ? '✓ Publié' : '○ Brouillon'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditOpportunite(opp)}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete('emploi/opportunites', opp.id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-2"
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vidéos Tab */}
        {activeTab === 'videos' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">🎥 Vidéos Mises en Avant</h2>
                <p className="text-gray-600">{videos?.length || 0} vidéo(s)</p>
              </div>
              <button 
                onClick={handleNewVideo}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                + Nouvelle vidéo
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL Vidéo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {videos && videos.length > 0 ? (
                    videos.map((video) => (
                      <tr key={video.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{video.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                            <FaPlay className="text-xs" />
                            Voir la vidéo
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            video.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {video.published ? '✓ Publié' : '○ Brouillon'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(video.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditVideo(video)}
                              className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                              title="Modifier"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete('featured-videos', video.id)}
                              className="text-red-600 hover:text-red-800 transition-colors p-2"
                              title="Supprimer"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="text-gray-400">
                          <FaPlay className="text-6xl mx-auto mb-4 opacity-20" />
                          <p className="text-xl font-semibold text-gray-600 mb-2">Aucune vidéo</p>
                          <p className="text-gray-500 mb-4">Créez votre première vidéo mise en avant</p>
                          <button
                            onClick={handleNewVideo}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                          >
                            + Créer une vidéo
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <DataTable
            title="📧 Inscriptions Newsletter"
            data={newsletter}
            columns={[
              { key: 'email', label: 'Email' },
              { key: 'whatsapp', label: 'WhatsApp' },
              { key: 'type', label: 'Type' },
              { key: 'created_at', label: 'Date d\'inscription', format: (val) => new Date(val).toLocaleDateString('fr-FR') },
              { 
                key: 'actions', 
                label: 'Actions', 
                format: (val, row) => (
                  <button
                    onClick={() => handleDelete('newsletter', row.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Supprimer cette inscription"
                  >
                    <FaTrash />
                  </button>
                )
              }
            ]}
          />
        )}

        {/* Visitors Tab */}
        {activeTab === 'visitors' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">🌍 Liste des Visiteurs</h2>
              <p className="text-gray-600">{visitors.length} entrée(s)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jour</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mois</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Année</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {visitors.map((visitor) => {
                    const date = new Date(visitor.created_at)
                    const mois = date.toLocaleDateString('fr-FR', { month: 'long' })
                    return (
                      <tr key={visitor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{date.getDate().toString().padStart(2, '0')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{mois}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{date.getFullYear()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{date.toLocaleTimeString('fr-FR')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.page_url}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDelete('visitors', visitor.id, `Visite du ${date.toLocaleDateString('fr-FR')}`)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <FaTrash /> Supprimer
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de validation */}
      {showValidationModal && (selectedCommande || selectedReservation) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <h3 className="text-2xl font-bold">
                {validationType === 'commande' ? 'Valider la commande' : 'Valider la réservation'}
              </h3>
              <p className="text-gray-600 mt-1">
                {validationType === 'commande' 
                  ? `Commande de ${selectedCommande.nom} - ${selectedCommande.livre}`
                  : `Réservation de ${selectedReservation.nom} - ${selectedReservation.theme}`
                }
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Canal de communication */}
              <div>
                <label className="block text-sm font-semibold mb-3">Canal de communication</label>
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-green-500 bg-green-50 text-green-700">
                  <FaWhatsapp className="text-xl" />
                  <span className="font-semibold">WhatsApp uniquement</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ℹ️ L'envoi par email n'est pas disponible sur Render (SMTP bloqué)
                </p>
              </div>

              {/* Message personnalisé */}
              <div>
                <label className="block text-sm font-semibold mb-2">Message de validation</label>
                <textarea
                  value={validationMessage}
                  onChange={(e) => setValidationMessage(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Personnalisez votre message..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  {validationType === 'commande' 
                    ? `Variables disponibles: {nom}, {livre}, {email}, {whatsapp}`
                    : `Variables disponibles: {nom}, {theme}, {date}, {email}, {whatsapp}`
                  }
                </p>
              </div>

              {/* Aperçu */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">Aperçu du message :</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {validationType === 'commande' 
                    ? validationMessage
                        .replace(/{nom}/g, selectedCommande.nom)
                        .replace(/{livre}/g, selectedCommande.livre)
                        .replace(/{email}/g, selectedCommande.email)
                        .replace(/{whatsapp}/g, selectedCommande.whatsapp)
                    : validationMessage
                        .replace(/{nom}/g, selectedReservation.nom)
                        .replace(/{theme}/g, selectedReservation.theme)
                        .replace(/{date}/g, new Date(selectedReservation.date_souhaitee).toLocaleDateString('fr-FR'))
                        .replace(/{email}/g, selectedReservation.email)
                        .replace(/{whatsapp}/g, selectedReservation.whatsapp)
                  }
                </p>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowValidationModal(false)
                  setSelectedCommande(null)
                  setSelectedReservation(null)
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={submitValidation}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <FaWhatsapp />
                Valider et envoyer via WhatsApp
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Blog Article */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8"
          >
            <div className="p-6 border-b">
              <h3 className="text-2xl font-bold">
                {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
              </h3>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold mb-2">Titre *</label>
                <input
                  type="text"
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({...articleForm, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Titre de l'article"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Catégorie *</label>
                <select
                  value={articleForm.category}
                  onChange={(e) => setArticleForm({...articleForm, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Innovation">Innovation</option>
                  <option value="Tendances">Tendances</option>
                  <option value="Conseils">Conseils</option>
                  <option value="Actualités">Actualités</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Résumé *</label>
                <textarea
                  value={articleForm.excerpt}
                  onChange={(e) => setArticleForm({...articleForm, excerpt: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Résumé court de l'article"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Contenu complet *</label>
                <textarea
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                  rows={8}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Contenu complet de l'article"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">URL Image</label>
                  <input
                    type="text"
                    value={articleForm.image}
                    onChange={(e) => setArticleForm({...articleForm, image: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL d'une image (Unsplash, Pexels, etc.)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Temps de lecture</label>
                  <input
                    type="text"
                    value={articleForm.read_time}
                    onChange={(e) => setArticleForm({...articleForm, read_time: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="5 min"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Lien externe (optionnel)</label>
                <input
                  type="url"
                  value={articleForm.external_link}
                  onChange={(e) => setArticleForm({...articleForm, external_link: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/article-complet"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si rempli, le bouton "Lire l'article" redirigera vers ce lien
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={articleForm.published}
                  onChange={(e) => setArticleForm({...articleForm, published: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="text-sm font-semibold">
                  Publier immédiatement
                </label>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowBlogModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveArticle}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingArticle ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Opportunité */}
      {showOpportuniteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8"
          >
            <div className="p-6 border-b">
              <h3 className="text-2xl font-bold">
                {editingOpportunite ? 'Modifier l\'opportunité' : 'Nouvelle opportunité'}
              </h3>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold mb-2">Titre du poste *</label>
                <input
                  type="text"
                  value={opportuniteForm.title}
                  onChange={(e) => setOpportuniteForm({...opportuniteForm, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Développeur Full Stack"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Entreprise *</label>
                  <input
                    type="text"
                    value={opportuniteForm.company}
                    onChange={(e) => setOpportuniteForm({...opportuniteForm, company: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom de l'entreprise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Lieu</label>
                  <input
                    type="text"
                    value={opportuniteForm.location}
                    onChange={(e) => setOpportuniteForm({...opportuniteForm, location: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Brazzaville, Congo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Type de contrat *</label>
                <select
                  value={opportuniteForm.type}
                  onChange={(e) => setOpportuniteForm({...opportuniteForm, type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Stage">Stage</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Alternance">Alternance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <textarea
                  value={opportuniteForm.description}
                  onChange={(e) => setOpportuniteForm({...opportuniteForm, description: e.target.value})}
                  rows={5}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Description complète du poste"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Compétences requises</label>
                <textarea
                  value={opportuniteForm.requirements}
                  onChange={(e) => setOpportuniteForm({...opportuniteForm, requirements: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="React, Node.js, PostgreSQL..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Salaire</label>
                  <input
                    type="text"
                    value={opportuniteForm.salary}
                    onChange={(e) => setOpportuniteForm({...opportuniteForm, salary: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="À négocier"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Lien candidature</label>
                  <input
                    type="url"
                    value={opportuniteForm.link}
                    onChange={(e) => setOpportuniteForm({...opportuniteForm, link: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published-opp"
                  checked={opportuniteForm.published}
                  onChange={(e) => setOpportuniteForm({...opportuniteForm, published: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="published-opp" className="text-sm font-semibold">
                  Publier immédiatement
                </label>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowOpportuniteModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveOpportunite}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingOpportunite ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Vidéo */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8"
          >
            <div className="p-6 border-b">
              <h3 className="text-2xl font-bold">
                {editingVideo ? 'Modifier la vidéo' : 'Nouvelle vidéo'}
              </h3>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold mb-2">Titre *</label>
                <input
                  type="text"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Titre de la vidéo"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <textarea
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
                  rows={5}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Description de la vidéo"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">URL de la vidéo (YouTube) *</label>
                <input
                  type="url"
                  value={videoForm.video_url}
                  onChange={(e) => setVideoForm({...videoForm, video_url: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Copiez l'URL complète de la vidéo YouTube
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">URL de la miniature (optionnel)</label>
                <input
                  type="text"
                  value={videoForm.thumbnail}
                  onChange={(e) => setVideoForm({...videoForm, thumbnail: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="/blog/video-thumbnail.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Chemin vers l'image de miniature (ex: /blog/video.jpg)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published-video"
                  checked={videoForm.published}
                  onChange={(e) => setVideoForm({...videoForm, published: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="published-video" className="text-sm font-semibold">
                  Publier immédiatement
                </label>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Note :</strong> Une seule vidéo peut être publiée à la fois. Si vous publiez cette vidéo, elle remplacera la vidéo actuellement affichée sur la page Blog.
                </p>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowVideoModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveVideo}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingVideo ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Détails Lead */}
      {showLeadModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">📋 Détails du Lead</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Ajouté le {new Date(selectedLead.created_at).toLocaleDateString('fr-FR')} à {new Date(selectedLead.created_at).toLocaleTimeString('fr-FR')}
                </p>
              </div>
              <button
                onClick={() => setShowLeadModal(false)}
                className="text-white hover:text-gray-200 text-2xl font-bold ml-4"
                title="Fermer"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Informations Personnelles */}
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUsers className="text-blue-600" />
                  Informations Personnelles
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Prénom</p>
                    <p className="text-gray-900 font-semibold">{selectedLead.prenom}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Email</p>
                    <p className="text-gray-900">{selectedLead.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">WhatsApp</p>
                    <p className="text-gray-900">{selectedLead.whatsapp}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Préférence</p>
                    <p className="text-gray-900 capitalize">{selectedLead.preference || 'Non spécifié'}</p>
                  </div>
                </div>
              </div>

              {/* Informations Lead */}
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBook className="text-green-600" />
                  Informations Lead
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Source</p>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {selectedLead.source}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Statut</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedLead.statut === 'converti' ? 'bg-green-100 text-green-800' :
                      selectedLead.statut === 'en_cours' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedLead.statut || 'nouveau'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Produit d'intérêt</p>
                    <p className="text-gray-900 font-semibold">{selectedLead.produit}</p>
                  </div>
                </div>
              </div>

              {/* Actions Rapides */}
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4">Actions Rapides</h4>
                <div className="flex gap-3">
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <FaEnvelope />
                    Envoyer un email
                  </a>
                  <a
                    href={`https://wa.me/${selectedLead.whatsapp.replace(/[^0-9]/g, '')}?text=Bonjour ${selectedLead.prenom}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    <FaWhatsapp />
                    Contacter sur WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 rounded-b-xl flex gap-3 justify-between items-center flex-shrink-0">
              <button
                onClick={() => {
                  if (window.confirm('Êtes-vous sûr de vouloir supprimer ce lead ?')) {
                    handleDelete('leads', selectedLead.id)
                    setShowLeadModal(false)
                  }
                }}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
              >
                Supprimer
              </button>
              <button
                onClick={() => setShowLeadModal(false)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Détails Réservation */}
      {showReservationModal && selectedReservationDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-xl flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">📅 Détails de la Réservation</h3>
                <p className="text-green-100 text-sm mt-1">
                  Créée le {new Date(selectedReservationDetail.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <button
                onClick={() => setShowReservationModal(false)}
                className="text-white hover:text-gray-200 text-2xl font-bold ml-4"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4">Informations Client</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Nom</p>
                    <p className="text-gray-900 font-semibold">{selectedReservationDetail.nom}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Email</p>
                    <p className="text-gray-900">{selectedReservationDetail.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">WhatsApp</p>
                    <p className="text-gray-900">{selectedReservationDetail.whatsapp}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4">Détails Réservation</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Thème</p>
                    <p className="text-gray-900 font-semibold">{selectedReservationDetail.theme}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Date souhaitée</p>
                    <p className="text-gray-900">{new Date(selectedReservationDetail.date_souhaitee).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Statut</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedReservationDetail.statut === 'validee' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedReservationDetail.statut === 'validee' ? '✓ Validée' : '⏳ En attente'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4">Actions Rapides</h4>
                <div className="flex gap-3">
                  <a
                    href={`mailto:${selectedReservationDetail.email}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <FaEnvelope />
                    Email
                  </a>
                  <a
                    href={`https://wa.me/${selectedReservationDetail.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    <FaWhatsapp />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 rounded-b-xl flex gap-3 justify-between items-center flex-shrink-0">
              {selectedReservationDetail.statut !== 'validee' && (
                <button
                  onClick={() => {
                    handleValidateReservation(selectedReservationDetail)
                    setShowReservationModal(false)
                  }}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                >
                  ✓ Valider
                </button>
              )}
              <button
                onClick={() => setShowReservationModal(false)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Détails Commande */}
      {showCommandeModal && selectedCommandeDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-xl flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">📚 Détails de la Commande</h3>
                <p className="text-purple-100 text-sm mt-1">
                  Créée le {new Date(selectedCommandeDetail.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <button
                onClick={() => setShowCommandeModal(false)}
                className="text-white hover:text-gray-200 text-2xl font-bold ml-4"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4">Informations Client</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Nom</p>
                    <p className="text-gray-900 font-semibold">{selectedCommandeDetail.nom}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Email</p>
                    <p className="text-gray-900">{selectedCommandeDetail.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">WhatsApp</p>
                    <p className="text-gray-900">{selectedCommandeDetail.whatsapp}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4">Détails Commande</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Livre</p>
                    <p className="text-gray-900 font-semibold">{selectedCommandeDetail.livre}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Statut</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedCommandeDetail.statut === 'validee' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedCommandeDetail.statut === 'validee' ? '✓ Validée' : '⏳ En attente'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Date</p>
                    <p className="text-gray-900">{new Date(selectedCommandeDetail.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4">Actions Rapides</h4>
                <div className="flex gap-3">
                  <a
                    href={`mailto:${selectedCommandeDetail.email}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <FaEnvelope />
                    Email
                  </a>
                  <a
                    href={`https://wa.me/${selectedCommandeDetail.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    <FaWhatsapp />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 rounded-b-xl flex gap-3 justify-between items-center flex-shrink-0">
              {selectedCommandeDetail.statut !== 'validee' && (
                <button
                  onClick={() => {
                    handleValidateCommande(selectedCommandeDetail)
                    setShowCommandeModal(false)
                  }}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                >
                  ✓ Valider
                </button>
              )}
              <button
                onClick={() => setShowCommandeModal(false)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </div>
  )
}

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${colors[color]} text-white rounded-xl shadow-lg p-6`}
    >
      <Icon className="text-4xl mb-3 opacity-80" />
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm opacity-90">{label}</p>
    </motion.div>
  )
}

const DataTable = ({ title, data, columns }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-600">{data.length} entrée(s)</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {col.format ? col.format(row[col.key]) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard
