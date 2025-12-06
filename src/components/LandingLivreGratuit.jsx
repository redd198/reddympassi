import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaDownload, FaWhatsapp, FaEnvelope, FaBook, FaStar } from 'react-icons/fa'

const LandingLivreGratuit = () => {
  const [formData, setFormData] = useState({
    prenom: '',
    email: '',
    whatsapp: '',
    preference: 'whatsapp'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [downloadLink, setDownloadLink] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Enregistrer le lead dans la base de données
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'livre-gratuit',
          produit: 'Le cerveau de l\'entrepreneur e-commerce'
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        // Lien de téléchargement du livre (à remplacer par votre lien réel)
        setDownloadLink('/books/livre-gratuit.pdf')
        
        // Scroll vers le haut pour voir le message de succès
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        alert('Une erreur est survenue. Veuillez réessayer.')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur de connexion. Vérifiez votre connexion internet.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaCheckCircle className="text-white text-4xl" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            🎉 Félicitations !
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Votre livre gratuit vous attend !
          </p>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">
              📧 Vérifiez votre {formData.preference === 'whatsapp' ? 'WhatsApp' : 'email'}
            </h2>
            <p className="text-gray-700 mb-4">
              {formData.preference === 'whatsapp' ? (
                <>
                  Nous vous avons envoyé le lien de téléchargement sur WhatsApp.<br />
                  <span className="text-sm text-gray-600">Si vous ne recevez rien dans les 5 minutes, contactez-nous directement.</span>
                </>
              ) : (
                <>
                  Nous vous avons envoyé le lien de téléchargement par email.<br />
                  <span className="text-sm text-gray-600">Vérifiez aussi vos spams si vous ne le voyez pas.</span>
                </>
              )}
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold">
              {formData.preference === 'whatsapp' ? (
                <>
                  <FaWhatsapp className="text-2xl" />
                  <span>{formData.whatsapp}</span>
                </>
              ) : (
                <>
                  <FaEnvelope className="text-2xl" />
                  <span>{formData.email}</span>
                </>
              )}
            </div>
          </div>

          <a
            href={downloadLink}
            download
            className="inline-flex items-center gap-3 bg-gradient-to-r from-reddy-red to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-6"
          >
            <FaDownload />
            Télécharger maintenant
          </a>

          <div className="border-t border-gray-200 pt-8 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              🎁 Bonus : Rejoignez notre communauté
            </h3>
            <p className="text-gray-600 mb-6">
              Accédez à des conseils exclusifs, des opportunités en avant-première et posez vos questions directement !
            </p>
            <a
              href="https://wa.me/242050416661?text=Bonjour%20Reddy,%20je%20viens%20de%20télécharger%20le%20livre%20gratuit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp className="text-xl" />
              Rejoindre le groupe WhatsApp
            </a>
          </div>

          <div className="mt-8">
            <a href="/" className="text-blue-600 hover:underline">
              ← Retour à l'accueil
            </a>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-red-100 text-reddy-red px-4 py-2 rounded-full text-sm font-semibold mb-4"
          >
            🎁 100% GRATUIT
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Téléchargez GRATUITEMENT<br />
            <span className="text-reddy-red">"Le Cerveau de l'Entrepreneur E-commerce"</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-8"
          >
            Découvrez les secrets pour lancer et réussir votre business en ligne en Afrique
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Book Cover */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
              <img
                src="/books/book.png"
                alt="Couverture du livre"
                className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
              />
            </div>

            {/* What You'll Learn */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaBook className="text-reddy-blue" />
                Ce que vous allez découvrir :
              </h2>
              
              <ul className="space-y-4">
                {[
                  'Les fondamentaux de l\'e-commerce africain',
                  'Comment identifier une niche rentable au Congo',
                  'Les meilleures plateformes pour vendre en ligne',
                  'Stratégies de marketing digital adaptées à l\'Afrique',
                  'Gestion des paiements mobiles (Airtel Money, MTN)',
                  'Comment gérer la logistique et les livraisons',
                  'Études de cas de succès congolais',
                  'Les erreurs à éviter absolument'
                ].map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <FaCheckCircle className="text-green-500 text-xl flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Testimonials */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 mt-8">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-500 text-xl" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">
                "Ce livre m'a ouvert les yeux sur les opportunités du e-commerce au Congo. J'ai lancé ma boutique en ligne 2 mois après l'avoir lu !"
              </p>
              <p className="font-semibold text-gray-900">
                - Marie K., Entrepreneure à Brazzaville
              </p>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="sticky top-8"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border-4 border-reddy-red">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
                Recevez votre livre GRATUITEMENT
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Entrez vos coordonnées et téléchargez instantanément
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Prénom */}
                <div>
                  <label htmlFor="prenom" className="block text-gray-700 font-semibold mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                    placeholder="Votre prénom"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-reddy-blue focus:outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-reddy-blue focus:outline-none transition-colors"
                  />
                </div>

                {/* WhatsApp */}
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
                    placeholder="+242 06 123 45 67"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-reddy-blue focus:outline-none transition-colors"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Format : +242 suivi de votre numéro
                  </p>
                </div>

                {/* Préférence */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    Comment souhaitez-vous recevoir le livre ? *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                      <input
                        type="radio"
                        name="preference"
                        value="whatsapp"
                        checked={formData.preference === 'whatsapp'}
                        onChange={handleChange}
                        className="w-5 h-5 text-green-500"
                      />
                      <FaWhatsapp className="text-green-500 text-2xl" />
                      <span className="font-medium">WhatsApp (Recommandé - Plus rapide)</span>
                    </label>
                    
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <input
                        type="radio"
                        name="preference"
                        value="email"
                        checked={formData.preference === 'email'}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-500"
                      />
                      <FaEnvelope className="text-blue-500 text-2xl" />
                      <span className="font-medium">Email</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-reddy-red to-red-600 text-white py-4 rounded-full text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <FaDownload />
                      Recevoir mon livre GRATUIT
                    </>
                  )}
                </button>

                {/* Reassurance */}
                <div className="text-center space-y-2 text-sm text-gray-600">
                  <p className="flex items-center justify-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    Téléchargement immédiat
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    Pas de spam, promis
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    100% gratuit, aucune carte bancaire requise
                  </p>
                </div>
              </form>
            </div>

            {/* Trust Badge */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                🔒 Vos données sont sécurisées et ne seront jamais partagées
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LandingLivreGratuit
