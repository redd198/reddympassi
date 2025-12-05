import { motion } from 'framer-motion'
import { FaLinkedin, FaYoutube, FaWhatsapp, FaArrowRight, FaPlay, FaCalendarAlt, FaClock } from 'react-icons/fa'
import { useState } from 'react'
import Navbar from './Navbar'

const BlogPage = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('')

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail })
      })

      const data = await response.json()

      if (response.ok) {
        setNewsletterStatus('success')
        setNewsletterEmail('')
        setTimeout(() => setNewsletterStatus(''), 3000)
      } else {
        setNewsletterStatus('error')
        alert(data.error || 'Erreur lors de l\'inscription')
        setTimeout(() => setNewsletterStatus(''), 3000)
      }
    } catch (error) {
      console.error('Erreur:', error)
      setNewsletterStatus('error')
      alert('Erreur de connexion au serveur')
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

  const articles = [
    {
      id: 1,
      type: "article",
      image: "/blog/paiement-electroniques.jpg",
      category: "Tendances",
      title: "Numérique : l'essor de la finance numérique au Congo au cœur de « Brazza Fintech tour 2020 »",
      excerpt: "Le Brazza Fintech Tour 2020 met en lumière l'évolution de la finance numérique au Congo. Un événement clé pour comprendre les innovations fintech et les opportunités de transformation digitale du secteur financier congolais.",
      date: "15 Janvier 2025",
      readTime: "5 min",
      color: "reddy-blue",
      link: "https://www.adiac-congo.com/content/numerique-lessor-de-la-finance-numerique-au-congo-au-coeur-de-brazza-fintech-tour-2020"
    },
    {
      id: 2,
      type: "article",
      image: "/blog/IA.jpg",
      category: "Innovation",
      title: "IA : les startups africaines ont levé 1,2 milliard $ en 6 ans",
      excerpt: "Une analyse des investissements massifs dans les startups africaines spécialisées en intelligence artificielle. Découvrez les chiffres clés et les perspectives de croissance du secteur IA sur le continent.",
      date: "10 Janvier 2025",
      readTime: "7 min",
      color: "reddy-red",
      link: "https://cio-mag.com/ia-les-startups-africaines-ont-leve-12-milliard-en-6-ans/"
    },
    {
      id: 3,
      type: "article",
      image: "/blog/cfa.jfif",
      category: "Conseils",
      title: "e-commerce en Afrique - mode d'emploi",
      excerpt: "Un guide complet pour comprendre les spécificités du e-commerce africain : défis logistiques, solutions de paiement adaptées, stratégies marketing locales et opportunités de croissance sur le continent.",
      date: "5 Janvier 2025",
      readTime: "6 min",
      color: "reddy-blue",
      link: "https://www.numilog.com/1553348/e-commerce-en-afrique--mode-d-emploi.ebook?utm_source=PDF-excerpt"
    },
  ]

  const featuredVideo = {
    title: "L'Afrique accélère son inclusion à l'intelligence artificielle",
    description: "Découvrez comment l'Afrique s'approprie l'intelligence artificielle pour transformer son économie et créer des solutions innovantes adaptées aux réalités locales. Une analyse approfondie des initiatives et opportunités du continent.",
    thumbnail: "/blog/video-ia-afrique.jpg",
    videoUrl: "https://www.youtube.com/watch?v=YSVi4X10OUY"
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
                  href={featuredVideo.videoUrl}
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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {articles.map((article) => (
              <motion.article
                key={article.id}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Article Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = `<div class="flex items-center justify-center h-full text-${article.color} text-3xl font-bold">${article.category}</div>`
                    }}
                  />
                  {article.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-12 h-12 bg-reddy-red rounded-full flex items-center justify-center">
                        <FaPlay className="text-white ml-1" />
                      </div>
                    </div>
                  )}
                  <span className={`absolute top-4 left-4 bg-${article.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                    {article.category}
                  </span>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-reddy-blue" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-reddy-red" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-reddy-blue transition-colors duration-300">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>

                  {article.link ? (
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 text-${article.color} font-semibold hover:gap-4 transition-all duration-300`}
                    >
                      {article.type === "video" ? "Voir la vidéo" : "Lire l'article"}
                      <FaArrowRight />
                    </a>
                  ) : (
                    <button className={`inline-flex items-center gap-2 text-${article.color} font-semibold hover:gap-4 transition-all duration-300`}>
                      {article.type === "video" ? "Voir la vidéo" : "Lire l'article"}
                      <FaArrowRight />
                    </button>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-reddy-blue/10 to-reddy-red/10">
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
            Recevez nos derniers articles et actualités directement dans votre boîte mail
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-reddy-blue focus:outline-none transition-colors duration-300"
            />
            <button 
              type="submit"
              className="px-8 py-4 bg-reddy-red text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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
