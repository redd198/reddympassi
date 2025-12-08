import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp, FaTimes } from 'react-icons/fa'

const FloatingWhatsApp = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const whatsappNumber = "242050416661"
  const defaultMessage = "Bonjour Reddy, je souhaite en savoir plus sur vos services d'économie numérique !"

  const quickMessages = [
    {
      text: "💼 Coaching Business",
      message: "Bonjour Reddy, je suis intéressé(e) par vos services de coaching en économie numérique."
    },
    {
      text: "📚 Formations",
      message: "Salut ! J'aimerais connaître vos formations disponibles en économie numérique."
    },
    {
      text: "🚀 Consultation",
      message: "Bonjour, je souhaite une consultation pour mon projet digital en Afrique."
    },
    {
      text: "📖 Livre Gratuit",
      message: "Bonjour Reddy, comment puis-je obtenir votre guide gratuit sur l'économie numérique ?"
    }
  ]

  const handleQuickMessage = (message) => {
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setIsExpanded(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 bg-white rounded-2xl shadow-2xl p-4 w-80 border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <FaWhatsapp className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Reddy Mpassi</h3>
                  <p className="text-xs text-green-500">En ligne • Répond rapidement</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Message d'accueil */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-700">
                👋 Salut ! Comment puis-je vous aider avec votre projet d'économie numérique ?
              </p>
            </div>

            {/* Messages rapides */}
            <div className="space-y-2">
              {quickMessages.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickMessage(item.message)}
                  className="w-full text-left p-2 text-sm bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                >
                  {item.text}
                </button>
              ))}
            </div>

            {/* Message personnalisé */}
            <button
              onClick={() => handleQuickMessage(defaultMessage)}
              className="w-full mt-3 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              💬 Envoyer un message
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton principal */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaTimes size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="whatsapp"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaWhatsapp size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Notification badge */}
      {!isExpanded && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
        >
          <span className="text-white text-xs font-bold">1</span>
        </motion.div>
      )}
    </div>
  )
}

export default FloatingWhatsApp