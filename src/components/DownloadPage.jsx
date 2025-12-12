import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaDownload, FaWhatsapp, FaEnvelope, FaBook } from 'react-icons/fa'

const DownloadPage = () => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadCount, setDownloadCount] = useState(0)

  useEffect(() => {
    // Récupérer le nombre de téléchargements
    fetch('/api/download-stats')
      .then(res => res.json())
      .then(data => setDownloadCount(data.count || 0))
      .catch(err => console.error('Erreur stats:', err))
  }, [])

  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      // Enregistrer le téléchargement
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/track-download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          livre: 'Économie Numérique en Afrique – Focus Congo-Brazzaville',
          source: 'page-telechargement'
        })
      })
      
      // Télécharger le fichier
      const link = document.createElement('a')
      link.href = '/uploads/EconomieNumériqueenAfriqueFocusCongo-Brazzaville.pdf'
      link.download = 'Economie-Numerique-Afrique-Congo.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setDownloadCount(prev => prev + 1)
    } catch (error) {
      console.error('Erreur téléchargement:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-reddy-blue to-reddy-red p-8 text-white text-center">
            <FaBook size={48} className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Votre Livre Gratuit</h1>
            <p className="text-lg opacity-90">Économie Numérique en Afrique – Focus Congo-Brazzaville</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                📚 Téléchargez votre guide maintenant !
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Découvrez les opportunités de l'économie numérique en Afrique avec un focus spécial 
                sur le Congo-Brazzaville. Un guide complet pour entrepreneurs et professionnels.
              </p>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8 text-center">
              <p className="text-sm text-gray-600">
                <strong>{downloadCount.toLocaleString()}</strong> personnes ont déjà téléchargé ce guide
              </p>
            </div>

            {/* Download Button */}
            <div className="text-center mb-8">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-reddy-blue to-reddy-red text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 text-lg"
              >
                <FaDownload />
                {isDownloading ? 'Téléchargement...' : 'Télécharger le PDF'}
              </button>
            </div>

            {/* Bonus Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                🎁 Bonus Exclusifs
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaWhatsapp className="text-green-600 text-xl" />
                  <div>
                    <p className="font-medium text-gray-800">Communauté WhatsApp</p>
                    <p className="text-sm text-gray-600">Conseils exclusifs et opportunités</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-blue-600 text-xl" />
                  <div>
                    <p className="font-medium text-gray-800">Newsletter Hebdomadaire</p>
                    <p className="text-sm text-gray-600">Analyses et tendances du marché</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <a
                  href={process.env.REACT_APP_WHATSAPP_GROUP || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaWhatsapp />
                  Rejoindre la Communauté
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 text-center space-y-3">
              <a
                href="/livres"
                className="block w-full py-3 border-2 border-reddy-blue text-reddy-blue font-semibold rounded-lg hover:bg-reddy-blue hover:text-white transition-all duration-300"
              >
                📚 Découvrir nos autres livres
              </a>
              
              <a
                href="/reserver"
                className="block w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300"
              >
                💼 Réserver un coaching
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DownloadPage