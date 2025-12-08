import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaWhatsapp, FaEnvelope, FaGift } from 'react-icons/fa'

const LeadMagnetPopup = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('')
  const [formData, setFormData] = useState({
    prenom: '',
    contact: '', // email ou whatsapp selon le choix
    preference: '' // 'email' ou 'whatsapp'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prenom: formData.prenom,
          email: formData.preference === 'email' ? formData.contact : '',
          whatsapp: formData.preference === 'whatsapp' ? formData.contact : '',
          preference: formData.preference,
          source: 'popup-lead-magnet',
          produit: 'Guide Économie Numérique Gratuit'
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        // Fermer après 3 secondes
        setTimeout(() => {
          handleClose()
        }, 3000)
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error)
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
                          ✅ Guide PDF de 25 pages • ✅ Checklist pratique • ✅ Ressources bonus
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
                            {selectedMethod === 'whatsapp' ? 'Numéro WhatsApp' : 'Adresse Email'}
                          </label>
                          <input
                            type={selectedMethod === 'whatsapp' ? 'tel' : 'email'}
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reddy-blue focus:border-transparent"
                            placeholder={selectedMethod === 'whatsapp' ? '+242 XX XX XX XX' : 'votre@email.com'}
                          />
                        </div>
                        
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
                  // Étape 3: Succès
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Parfait ! 🎉
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      Votre guide sera envoyé dans les prochaines minutes via {selectedMethod === 'whatsapp' ? 'WhatsApp' : 'Email'}.
                    </p>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-700">
                        💡 En attendant, explorez nos formations premium et opportunités d'emploi !
                      </p>
                    </div>
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