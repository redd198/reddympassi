import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaWhatsapp, FaEnvelope, FaGift } from 'react-icons/fa'

const LeadMagnetPopup = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('')
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    contact: '', // email ou whatsapp selon le choix
    telephone: '',
    preference: '' // 'email' ou 'whatsapp'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState('')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Vérifier si le popup a déjà été affiché
    const hasSeenPopup = localStorage.getItem('leadMagnetSeen')
    
    if (!hasSeenPopup) {
      // Afficher après 10 secondes ou au scroll
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 10000)

      const handleScroll = () => {
        if (window.scrollY > 300) {
          setIsVisible(true)
          window.removeEventListener('scroll', handleScroll)
        }
      }

      window.addEventListener('scroll', handleScroll)

      return () => {
        clearTimeout(timer)
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  // Compte à rebours pour fermeture automatique
  useEffect(() => {
    if ((isSuccess || isError) && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if ((isSuccess || isError) && countdown === 0) {
      handleClose()
    }
  }, [isSuccess, countdown])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('leadMagnetSeen', 'true')
  }

  const handleMethodSelect = (method) => {
    setSelectedMethod(method)
    setFormData({ ...formData, preference: method })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log('🚀 Envoi du formulaire lead magnet...')
    console.log('📊 Données:', formData)
    console.log('🌐 URL API:', import.meta.env.VITE_API_URL || 'http://localhost:5000')

    // MODE SIMULATION pour contourner les problèmes réseau
    const SIMULATION_MODE = false
    
    if (SIMULATION_MODE) {
      console.log('🎭 MODE SIMULATION ACTIVÉ')
      console.log('📝 Données qui seraient envoyées:', {
        prenom: formData.prenom,
        nom: formData.nom,
        telephone: formData.telephone,
        email: formData.preference === 'email' ? formData.contact : '',
        whatsapp: formData.preference === 'whatsapp' ? formData.contact : '',
        preference: formData.preference,
        source: 'livre-gratuit',
        produit: 'Économie Numérique en Afrique – Focus Congo-Brazzaville'
      })
      
      // Simuler un délai réseau
      setTimeout(() => {
        setIsSuccess(true)
        setIsError(false)
        if (formData.preference === 'email') {
          setMessage('🎉 [SIMULATION] Parfait ! Votre guide PDF serait envoyé par email. Vérifiez votre boîte de réception (et vos spams).')
        } else {
          setMessage('🎉 [SIMULATION] Parfait ! Votre inscription est confirmée. Vous recevriez bientôt le lien de téléchargement sur WhatsApp.')
        }
        setCountdown(5)
        setIsSubmitting(false)
      }, 1500)
      return
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      console.log('🔗 URL finale utilisée:', apiUrl)
      
      const response = await fetch(`${apiUrl}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prenom: formData.prenom,
          nom: formData.nom,
          telephone: formData.telephone,
          email: formData.preference === 'email' ? formData.contact : '',
          whatsapp: formData.preference === 'whatsapp' ? formData.contact : '',
          preference: formData.preference,
          source: 'livre-gratuit',
          produit: 'Économie Numérique en Afrique – Focus Congo-Brazzaville'
        }),
      })

      const data = await response.json()
      console.log('📥 Réponse serveur:', data)
      console.log('✅ Status:', response.status, response.ok)
      
      if (response.ok) {
        setIsSuccess(true)
        setIsError(false)
        if (data.pdfSent) {
          if (formData.preference === 'email') {
            setMessage('🎉 Parfait ! Votre guide PDF a été envoyé par email. Vérifiez votre boîte de réception (et vos spams).')
          } else {
            setMessage('🎉 Parfait ! Votre inscription est confirmée. Vous recevrez bientôt le lien de téléchargement sur WhatsApp.')
          }
        } else {
          setMessage('✅ Inscription réussie ! Vous recevrez bientôt votre guide.')
        }
        setCountdown(5)
      } else {
        setIsError(true)
        setIsSuccess(false)
        setMessage(data.error || '❌ Une erreur est survenue. Veuillez réessayer.')
        setCountdown(5)
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi:', error)
      setIsError(true)
      setIsSuccess(false)
      setMessage('❌ Erreur de connexion. Vérifiez votre connexion internet et réessayez.')
      setCountdown(5)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Popup */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header avec gradient */}
              <div className="bg-gradient-to-r from-reddy-blue to-reddy-red p-6 text-white relative">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
                
                <div className="flex items-center gap-3 mb-2">
                  <FaGift size={24} />
                  <h2 className="text-xl font-bold">Cadeau Exclusif !</h2>
                </div>
                <p className="text-sm opacity-90">
                  Recevez GRATUITEMENT notre guide "Économie Numérique en Afrique"
                </p>
              </div>

              {/* Contenu */}
              <div className="p-6">
                {!isSuccess ? (
                  <>
                    {!selectedMethod ? (
                      // Étape 1: Choix du moyen de contact
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Comment souhaitez-vous recevoir votre guide ?
                        </h3>
                        
                        <div className="space-y-3">
                          <button
                            onClick={() => handleMethodSelect('whatsapp')}
                            className="w-full flex items-center justify-center gap-3 p-4 border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-all duration-300 hover:scale-105"
                          >
                            <FaWhatsapp size={24} />
                            <span className="font-semibold">Via WhatsApp</span>
                          </button>
                          
                          <button
                            onClick={() => handleMethodSelect('email')}
                            className="w-full flex items-center justify-center gap-3 p-4 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105"
                          >
                            <FaEnvelope size={24} />
                            <span className="font-semibold">Via Email</span>
                          </button>
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-4">
                          ✅ Économie Numérique en Afrique • ✅ Focus Congo-Brazzaville • ✅ Analyse complète
                        </p>
                      </div>
                    ) : (
                      // Étape 2: Formulaire
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Votre prénom
                          </label>
                          <input
                            type="text"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reddy-blue focus:border-transparent"
                            placeholder="Entrez votre prénom"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Votre nom de famille
                          </label>
                          <input
                            type="text"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reddy-blue focus:border-transparent"
                            placeholder="Entrez votre nom"
                          />
                        </div>

                        {selectedMethod === 'email' ? (
                          // Mode Email : Nom + Email
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Votre adresse email
                            </label>
                            <input
                              type="email"
                              name="contact"
                              value={formData.contact}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reddy-blue focus:border-transparent"
                              placeholder="votre@email.com"
                            />
                          </div>
                        ) : (
                          // Mode WhatsApp : Nom + WhatsApp
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Votre numéro WhatsApp
                            </label>
                            <input
                              type="tel"
                              name="contact"
                              value={formData.contact}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reddy-blue focus:border-transparent"
                              placeholder="+242 XX XX XX XX"
                            />
                          </div>
                        )}
                        
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedMethod('')}
                            className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Retour
                          </button>
                          
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-gradient-to-r from-reddy-blue to-reddy-red text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                          >
                            {isSubmitting ? 'Envoi...' : 'Recevoir le Guide'}
                          </button>
                        </div>
                        
                        <p className="text-xs text-gray-500 text-center">
                          🔒 Vos données sont sécurisées. Pas de spam.
                        </p>
                      </form>
                    )}
                  </>
                ) : (
                  // Étape 3: Succès ou Erreur
                  <div className="text-center py-4">
                    {/* Animation de succès ou erreur */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className={`w-20 h-20 ${isSuccess ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      {isSuccess ? (
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </motion.div>
                    
                    <h3 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-gray-800' : 'text-red-600'}`}>
                      {isSuccess ? 'Guide envoyé ! 🎉' : 'Erreur d\'envoi ❌'}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {message}
                    </p>
                    
                    {/* Compte à rebours */}
                    <div className="mb-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                        <div className="w-6 h-6 bg-reddy-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {countdown}
                        </div>
                        <span className="text-sm text-gray-600">
                          Fermeture automatique dans {countdown}s
                        </span>
                      </div>
                    </div>
                    
                    {/* CTA Buttons */}
                    <div className="space-y-3 mb-4">
                      {isSuccess ? (
                        <>
                          <a
                            href="/livres"
                            onClick={handleClose}
                            className="block w-full py-3 bg-gradient-to-r from-reddy-blue to-reddy-red text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                          >
                            📚 Découvrir nos livres
                          </a>
                          
                          <a
                            href="/reserver"
                            onClick={handleClose}
                            className="block w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300"
                          >
                            💼 Réserver un coaching
                          </a>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setIsError(false)
                            setIsSuccess(false)
                            setSelectedMethod('')
                            setFormData({
                              prenom: '',
                              nom: '',
                              contact: '',
                              telephone: '',
                              preference: ''
                            })
                          }}
                          className="block w-full py-3 bg-gradient-to-r from-reddy-blue to-reddy-red text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                        >
                          🔄 Réessayer
                        </button>
                      )}
                      
                      <button
                        onClick={handleClose}
                        className="block w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
                      >
                        ✕ Fermer
                      </button>
                    </div>
                    
                    {/* Bonus info - seulement en cas de succès */}
                    {isSuccess && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>🎁 Bonus exclusif :</strong>
                        </p>
                        <p className="text-xs text-gray-600">
                          Vous recevrez également des conseils hebdomadaires sur l'économie numérique et les opportunités en Afrique !
                        </p>
                      </div>
                    )}
                    
                    {/* Bouton fermer manuel */}
                    <button
                      onClick={handleClose}
                      className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      Fermer maintenant
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default LeadMagnetPopup