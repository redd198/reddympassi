import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUsers, FaCalendar, FaBook, FaGlobe, FaSignOutAlt, FaChartLine, FaWhatsapp, FaTrash, FaEnvelope } from 'react-icons/fa'

const AdminDashboard = ({ token, onLogout }) => {
  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [leads, setLeads] = useState([])
  const [reservations, setReservations] = useState([])
  const [commandes, setCommandes] = useState([])
  const [visitors, setVisitors] = useState([])
  const [newsletter, setNewsletter] = useState([])
  const [loading, setLoading] = useState(true)
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [selectedCommande, setSelectedCommande] = useState(null)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [validationType, setValidationType] = useState('commande') // 'commande' ou 'reservation'
  const [validationCanal, setValidationCanal] = useState('whatsapp')
  const [validationMessage, setValidationMessage] = useState('')

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` }
      
      const [statsRes, leadsRes, reservationsRes, commandesRes, visitorsRes, newsletterRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/stats`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/leads`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/reservations`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/commandes`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/visitors`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/newsletter`, { headers })
      ])

      setStats(await statsRes.json())
      setLeads(await leadsRes.json())
      setReservations(await reservationsRes.json())
      setCommandes(await commandesRes.json())
      setVisitors(await visitorsRes.json())
      setNewsletter(await newsletterRes.json())
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Auto-refresh toutes les 30 secondes
    const interval = setInterval(() => {
      fetchData()
    }, 30000) // 30 secondes
    
    return () => clearInterval(interval)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Panneau d'Administration</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            <FaSignOutAlt />
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
            { id: 'leads', label: 'Leads', icon: FaUsers },
            { id: 'reservations', label: 'Réservations', icon: FaCalendar },
            { id: 'commandes', label: 'Commandes', icon: FaBook },
            { id: 'newsletter', label: 'Newsletter', icon: FaEnvelope },
            { id: 'visitors', label: 'Visiteurs', icon: FaGlobe }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

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
          <DataTable
            title="📋 Liste des Leads"
            data={leads}
            columns={[
              { key: 'prenom', label: 'Prénom' },
              { key: 'email', label: 'Email' },
              { key: 'whatsapp', label: 'WhatsApp' },
              { key: 'source', label: 'Source' },
              { key: 'produit', label: 'Produit' },
              { key: 'statut', label: 'Statut' },
              { key: 'created_at', label: 'Date', format: (val) => new Date(val).toLocaleDateString('fr-FR') },
              { 
                key: 'actions', 
                label: 'Actions', 
                format: (val, row) => (
                  <button
                    onClick={() => handleDelete('leads', row.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Supprimer ce lead"
                  >
                    <FaTrash />
                  </button>
                )
              }
            ]}
          />
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thème</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date souhaitée</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date création</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.nom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.whatsapp}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.theme}</td>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(reservation.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {reservation.statut !== 'validee' && (
                            <button
                              onClick={() => handleValidateReservation(reservation)}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                              ✓ Valider
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete('reservations', reservation.id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-2"
                            title="Supprimer cette réservation"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {commandes.map((commande) => (
                    <tr key={commande.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{commande.nom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{commande.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{commande.whatsapp}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{commande.livre}</td>
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
                          {commande.statut !== 'validee' && (
                            <button
                              onClick={() => handleValidateCommande(commande)}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                              ✓ Valider
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete('commandes', commande.id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-2"
                            title="Supprimer cette commande"
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

        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <DataTable
            title="📧 Inscriptions Newsletter"
            data={newsletter}
            columns={[
              { key: 'email', label: 'Email' },
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
