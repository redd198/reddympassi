import { motion } from 'framer-motion'
import { FaLinkedin, FaYoutube, FaWhatsapp, FaCalendarAlt, FaLightbulb, FaCheckCircle } from 'react-icons/fa'
import { useState } from 'react'
import Navbar from './Navbar'

const BookingPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    whatsapp: '',
    email: '',
    theme: '',
    objectif: '',
    date: '',
    heure: '',
    paiement: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsSubmitted(true)
        
        // Réinitialiser après 5 secondes
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({
            nom: '',
            whatsapp: '',
            email: '',
            theme: '',
            objectif: '',
            date: '',
            heure: '',
            paiement: ''
          })
        }, 5000)
      } else {
        alert('Erreur lors de l\'envoi de la réservation')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur de connexion au serveur')
    }
  }

  const themes = [
    'E-commerce et vente en ligne',
    'Intelligence Artificielle appliquée',
    'Marketing digital & réseaux sociaux',
    'Entrepreneuriat numérique',
    'Développement d\'applications',
    'Autre (à préciser dans l\'objectif)'
  ]

  const paiements = [
    'Airtel Money',
    'MTN Mobile Money (MoMo)',
    'Carte Visa/Mastercard',
    'Autre (à discuter)'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-poppins">
      <Navbar />
      
      {/* Header Section */}
      <section className="relative py-20 px-6 overflow-hidden mt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-reddy-blue/5 via-transparent to-reddy-red/5"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto max-w-4xl text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <FaCalendarAlt className="text-6xl text-reddy-red" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-reddy-blue mb-4">
            Réservez votre session de coaching personnalisée
          </h1>
          <p className="text-xl md:text-2xl text-gray-700">
            Avancez concrètement dans votre projet numérique avec l'aide d'un expert Zieta+
          </p>
        </motion.div>
      </section>

      {/* Description Section */}
      <section className="py-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto max-w-3xl"
        >
          <div className="bg-gradient-to-br from-reddy-blue/10 to-reddy-red/10 rounded-2xl p-8 text-center">
            <FaLightbulb className="text-4xl text-reddy-red mx-auto mb-4" />
            <p className="text-lg text-gray-700 leading-relaxed">
              Choisissez le thème qui correspond à vos besoins, fixez un rendez-vous selon votre disponibilité, 
              et recevez un accompagnement adapté à votre réalité africaine et vos ambitions digitales.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          {!isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
            >
              <h2 className="text-3xl font-bold text-reddy-blue mb-8 text-center">
                Formulaire de réservation
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom complet */}
                <div>
                  <label htmlFor="nom" className="block text-gray-700 font-semibold mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-reddy-blue focus:outline-none transition-colors duration-300"
                    placeholder="Votre nom complet"
                  />
                </div>

                {/* WhatsApp et Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="whatsapp" className="block text-gray-700 font-semibold mb-2">
                      Numéro WhatsApp *
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-reddy-blue focus:outline-none transition-colors duration-300"
                      placeholder="+242 XX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                      Adresse email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-reddy-blue focus:outline-none transition-colors duration-300"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* Thème du coaching */}
                <div>
                  <label htmlFor="theme" className="block text-gray-700 font-semibold mb-2">
                    Thème du coaching *
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-reddy-blue focus:outline-none transition-colors duration-300"
                  >
                    <option value="">Sélectionnez un thème</option>
                    {themes.map((theme, index) => (
                      <option key={index} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>

                {/* Objectif principal */}
                <div>
                  <label htmlFor="objectif" className="block text-gray-700 font-semibold mb-2">
                    Objectif principal du coaching *
                  </label>
                  <textarea
                    id="objectif"
                    name="objectif"
                    value={formData.objectif}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-reddy-blue focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Décrivez brièvement ce que vous souhaitez accomplir avec cette session..."
                  ></textarea>
                </div>

                {/* Date et Heure */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-gray-700 font-semibold mb-2">
                      Date souhaitée *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-reddy-blue focus:outline-none transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label htmlFor="heure" className="block text-gray-700 font-semibold mb-2">
                      Heure souhaitée *
                    </label>
                    <input
                      type="time"
                      id="heure"
                      name="heure"
                      value={formData.heure}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-reddy-blue focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Mode de paiement */}
                <div>
                  <label htmlFor="paiement" className="block text-gray-700 font-semibold mb-2">
                    Mode de paiement préféré *
                  </label>
                  <select
                    id="paiement"
                    name="paiement"
                    value={formData.paiement}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-reddy-blue focus:outline-none transition-colors duration-300"
                  >
                    <option value="">Sélectionnez un mode de paiement</option>
                    {paiements.map((paiement, index) => (
                      <option key={index} value={paiement}>{paiement}</option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-reddy-red text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  🟦 Réserver maintenant
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FaCheckCircle className="text-7xl text-green-500 mx-auto mb-6" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-reddy-blue mb-4">
                Réservation confirmée !
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                Merci pour votre réservation ! Vous recevrez une confirmation sur WhatsApp dans les prochaines heures.
              </p>
              <p className="text-gray-600">
                Notre équipe vous contactera pour finaliser les détails de votre session de coaching.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-reddy-blue mb-6">
              Pourquoi choisir nos sessions de coaching ?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-4">💡</div>
                <h4 className="font-bold text-gray-800 mb-2">Expertise locale</h4>
                <p className="text-gray-600 text-sm">
                  Accompagnement adapté aux réalités africaines
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="font-bold text-gray-800 mb-2">Personnalisé</h4>
                <p className="text-gray-600 text-sm">
                  Sessions sur mesure selon vos objectifs
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-4">📈</div>
                <h4 className="font-bold text-gray-800 mb-2">Résultats concrets</h4>
                <p className="text-gray-600 text-sm">
                  Stratégies actionnables immédiatement
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2025 Reddy Mpassi — Tous droits réservés
            </p>
            
            <div className="flex gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-reddy-blue text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
              >
                <FaLinkedin size={20} />
              </a>
              
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-reddy-red text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
              >
                <FaYoutube size={20} />
              </a>
              
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default BookingPage
