import { motion } from 'framer-motion'
import { FaLinkedin, FaYoutube, FaWhatsapp, FaArrowRight, FaPlay, FaCalendarAlt, FaClock, FaEnvelope, FaBriefcase, FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import Navbar from './Navbar'

const BlogPage = () => {
  const [articles, setArticles] = useState([])
  const [opportunites, setOpportunites] = useState([])
  const [featuredVideo, setFeaturedVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingOpportunites, setLoadingOpportunites] = useState(true)
  const [loadingVideo, setLoadingVideo] = useState(true)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterWhatsapp, setNewsletterWhatsapp] = useState('')
  const [newsletterType, setNewsletterType] = useState('email') // 'email' ou 'whatsapp'
  const [newsletterStatus, setNewsletterStatus] = useState('')

  // Charger les articles depuis l'API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/blog/articles`)
        const data = await response.json()
        setArticles(data)
      } catch (error) {
        console.error('Erreur chargement articles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  // Charger les opportunités IT depuis l'API
  useEffect(() => {
    const fetchOpportunites = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/emploi/opportunites`)
        const data = await response.json()
        setOpportunites(data)
      } catch (error) {
        console.error('Erreur chargement opportunités:', error)
      } finally {
        setLoadingOpportunites(false)
      }
    }
    fetchOpportunites()
  }, [])

  // Charger la vidéo mise en avant depuis l'API
  useEffect(() => {
    const fetchFeaturedVideo = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/featured-video`)
        const data = await response.json()
        setFeaturedVideo(data)
      } catch (error) {
        console.error('Erreur chargement vidéo:', error)
      } finally {
        setLoadingVideo(false)
      }
    }
    fetchFeaturedVideo()
  }, [])

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    
    const payload = {
      type: newsletterType,
      email: newsletterType === 'email' ? newsletterEmail : null,
      whatsapp: newsletterType === 'whatsapp' ? newsletterWhatsapp : null
    }
    
    console.log('📤 Envoi newsletter:', payload)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      console.log('📥 Réponse status:', response.status)
      const data = await response.json()
      console.log('📥 Réponse data:', data)

      if (response.ok) {
        setNewsletterStatus('success')
        setNewsletterEmail('')
        setNewsletterWhatsapp('')
        alert('✅ Inscription réussie ! Merci de vous être abonné.')
        setTimeout(() => setNewsletterStatus(''), 3000)
      } else {
        setNewsletterStatus('error')
        alert(`❌ ${data.error || 'Erreur lors de l\'inscription'}`)
        setTimeout(() => setNewsletterStatus(''), 3000)
      }
    } catch (error) {
      console.error('❌ Erreur catch:', error)
      setNewsletterStatus('error')
      alert(`❌ Erreur de connexion au serveur: ${error.message}`)
      setTimeout(() => setNewsletterStatus(''), 3000)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  // Fonction pour déterminer la couleur selon la catégorie
  const getCategoryColor = (category) => {
    const colors = {
      'Tendances': 'reddy-blue',
      'Innovation': 'reddy-red',
      'Conseils': 'reddy-blue',
      'Actualités': 'reddy-red'
    }
    return colors[category] || 'reddy-blue'
  }

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
          className="container mx-auto max-w-6xl text-center relative z-10"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-reddy-blue mb-4">
            Blog & Actualités
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto">
            Suivez les tendances du numérique africain, découvrez des analyses approfondies et restez informés des dernières innovations qui transforment le continent.
          </p>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Des conseils pratiques, des témoignages et des innovations qui façonnent l'avenir digital de l'Afrique.
          </p>
        </motion.div>
      </section>

      {/* Featured Video Section */}
      {!loadingVideo && featuredVideo && (
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-reddy-blue to-reddy-blue/90 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Video Thumbnail */}
                <div className="relative h-64 md:h-auto bg-gray-900 group cursor-pointer">
                  <img
                    src={featuredVideo.thumbnail}
                    alt={featuredVideo.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-reddy-red rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                      <FaPlay className="text-white text-2xl ml-1" />
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-8 md:p-12 flex flex-col justify-center text-white">
                  <span className="text-sm font-semibold text-reddy-red bg-white px-3 py-1 rounded-full inline-block w-fit mb-4">
                    Actualité en vidéo
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    {featuredVideo.title}
                  </h3>
                  <p className="text-blue-100 leading-relaxed mb-6">
                    {featuredVideo.description}
                  </p>
                  <a
                    href={featuredVideo.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white font-semibold hover:gap-4 transition-all duration-300"
                  >
                    Regarder la vidéo
                    <FaArrowRight />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Articles Grid Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-reddy-blue text-center mb-4"
          >
            Derniers articles
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-gray-600 mb-12"
          >
            Restez informés des dernières tendances et innovations
          </motion.p>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-reddy-blue mx-auto"></div>
              <p className="text-gray-600 mt-4">Chargement des articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-xl">Aucun article publié pour le moment.</p>
              <p className="text-gray-500 mt-2">Revenez bientôt pour découvrir nos derniers contenus !</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {articles.map((article) => {
                const color = getCategoryColor(article.category)
                return (
              <motion.article
                key={article.id}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Article Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className={`flex items-center justify-center h-full text-${color} text-3xl font-bold`}>
                      {article.category}
                    </div>
                  )}
                  <span className={`absolute top-4 left-4 bg-${color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                    {article.category}
                  </span>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-reddy-blue" />
                      {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-reddy-red" />
                      {article.read_time || '5 min'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-reddy-blue transition-colors duration-300">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>

                  {article.external_link ? (
                    <a
                      href={article.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-reddy-blue hover:text-reddy-red font-semibold hover:gap-4 transition-all duration-300"
                    >
                      Lire l'article
                      <FaExternalLinkAlt className="text-sm" />
                    </a>
                  ) : (
                    <button className="inline-flex items-center gap-2 text-reddy-blue hover:text-reddy-red font-semibold hover:gap-4 transition-all duration-300">
                      Lire l'article
                      <FaArrowRight />
                    </button>
                  )}
                </div>
              </motion.article>
                )
              })}
            </motion.div>
          )}

        </div>
      </section>

      {/* Opportunités IT Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center text-reddy-blue mb-4"
          >
            💼 Opportunités d'Emploi IT
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-gray-600 mb-12"
          >
            Découvrez les dernières offres d'emploi dans le secteur IT
          </motion.p>

          {loadingOpportunites ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Chargement des opportunités...</p>
            </div>
          ) : opportunites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-xl">Aucune opportunité disponible pour le moment.</p>
              <p className="text-gray-500 mt-2">Revenez bientôt pour découvrir de nouvelles offres !</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid md:grid-cols-2 gap-6"
            >
              {opportunites.map((opp) => (
                <motion.div
                  key={opp.id}
                  variants={cardVariants}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-l-4 border-purple-600"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {opp.title}
                        </h3>
                        <p className="text-lg text-purple-600 font-semibold mb-1">
                          {opp.company}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-purple-600" />
                            {opp.location}
                          </span>
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                            {opp.type}
                          </span>
                        </div>
                      </div>
                      <FaBriefcase className="text-4xl text-purple-600 opacity-20" />
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                      {opp.description}
                    </p>

                    {/* Compétences */}
                    {opp.requirements && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Compétences requises :</p>
                        <p className="text-sm text-gray-600">{opp.requirements}</p>
                      </div>
                    )}

                    {/* Salaire */}
                    {opp.salary && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700">
                          💰 Salaire : <span className="text-green-600">{opp.salary}</span>
                        </p>
                      </div>
                    )}

                    {/* Bouton Postuler */}
                    {opp.link ? (
                      <a
                        href={opp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300"
                      >
                        Postuler maintenant
                        <FaExternalLinkAlt />
                      </a>
                    ) : (
                      <a
                        href={`https://wa.me/242050416661?text=Bonjour, je suis intéressé(e) par l'offre : ${encodeURIComponent(opp.title)} chez ${encodeURIComponent(opp.company)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
                      >
                        <FaWhatsapp />
                        Postuler via WhatsApp
                      </a>
                    )}

                    {/* Date de publication */}
                    <p className="text-xs text-gray-500 mt-4">
                      Publié le {new Date(opp.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter-section" className="py-16 px-6 bg-gradient-to-br from-reddy-blue/10 to-reddy-red/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto max-w-4xl text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-reddy-blue mb-4">
            Restez connectés
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Recevez nos derniers articles et actualités par Email ou WhatsApp
          </p>

          {/* Choix Email ou WhatsApp */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              type="button"
              onClick={() => setNewsletterType('email')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                newsletterType === 'email'
                  ? 'bg-reddy-blue text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaEnvelope />
              Email
            </button>
            <button
              type="button"
              onClick={() => setNewsletterType('whatsapp')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                newsletterType === 'whatsapp'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaWhatsapp />
              WhatsApp
            </button>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            {newsletterType === 'email' ? (
              <input
                type="email"
                placeholder="Votre adresse email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-reddy-blue focus:outline-none transition-colors duration-300"
              />
            ) : (
              <input
                type="tel"
                placeholder="Votre numéro WhatsApp (+242...)"
                value={newsletterWhatsapp}
                onChange={(e) => setNewsletterWhatsapp(e.target.value)}
                required
                className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-green-600 focus:outline-none transition-colors duration-300"
              />
            )}
            <button 
              type="submit"
              className={`px-8 py-4 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                newsletterType === 'email' ? 'bg-reddy-red' : 'bg-green-600'
              }`}
            >
              {newsletterStatus === 'success' ? '✓ Inscrit !' : 'S\'abonner'}
            </button>
          </form>
          
          {newsletterStatus === 'success' && (
            <p className="text-green-600 font-semibold mt-4">
              ✓ Merci ! Vous êtes maintenant abonné à notre newsletter.
            </p>
          )}
        </motion.div>
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

export default BlogPage
