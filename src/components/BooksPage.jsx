import { motion } from 'framer-motion'
import { FaLinkedin, FaYoutube, FaWhatsapp, FaBook, FaDownload, FaShoppingCart } from 'react-icons/fa'
import { useState } from 'react'
import Navbar from './Navbar'

const BooksPage = () => {
  const [orderForm, setOrderForm] = useState({
    nom: '',
    email: '',
    whatsapp: '',
    livre: ''
  })
  
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOrderClick = (bookTitle) => {
    // Vérifier si l'utilisateur a déjà une commande en cours
    const existingOrder = localStorage.getItem('pendingOrder')
    if (existingOrder) {
      const orderData = JSON.parse(existingOrder)
      alert(`⚠️ Vous avez déjà une commande en cours pour "${orderData.livre}".\n\nVeuillez attendre qu'elle soit traitée avant de commander à nouveau.\n\nSi vous pensez qu'il s'agit d'une erreur, contactez-nous sur WhatsApp.`)
      return
    }
    
    setOrderForm({ ...orderForm, livre: bookTitle })
    setShowOrderForm(true)
  }

  const handleChange = (e) => {
    setOrderForm({
      ...orderForm,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Vérifier si l'utilisateur a déjà une commande en cours
    const existingOrder = localStorage.getItem('pendingOrder')
    if (existingOrder) {
      const orderData = JSON.parse(existingOrder)
      alert(`Vous avez déjà une commande en cours pour "${orderData.livre}". Veuillez attendre qu'elle soit traitée avant de commander à nouveau.`)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/commandes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderForm)
      })

      if (response.ok) {
        // Sauvegarder la commande en cours dans localStorage
        localStorage.setItem('pendingOrder', JSON.stringify({
          livre: orderForm.livre,
          date: new Date().toISOString()
        }))
        
        // Délai de 1.5 secondes avant d'afficher le message de félicitation
        setTimeout(() => {
          setIsSubmitting(false)
          setOrderSubmitted(true)
        }, 1500)
      } else {
        setIsSubmitting(false)
        alert('Erreur lors de l\'envoi de la commande')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setIsSubmitting(false)
      alert('Erreur de connexion au serveur')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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

  const books = [
    {
      id: 1,
      title: "Le cerveau de l'entrepreneur e-commerce",
      subtitle: "Psychologie et stratégie pour réussir en ligne",
      description: "Un guide complet sur la psychologie, la stratégie et la réussite dans le e-commerce africain. Découvrez les secrets des entrepreneurs qui réussissent.",
      cover: "/books/book.png",
      type: "gratuit",
      pdfLink: "/books/cerveau-entrepreneur.pdf",
      price: "Gratuit",
      color: "reddy-blue"
    },
    {
      id: 2,
      title: "Développement d'Applications en 24h",
      subtitle: "Guide pratique pour créer des apps sans coder",
      description: "Apprenez à concevoir et développer des applications web fonctionnelles en un temps record, sans compétences avancées en programmation. Méthodes no-code et low-code.",
      cover: "/books/book-payant.png",
      type: "payant",
      price: "5 000 FCFA",
      oldPrice: "15 000 FCFA",
      color: "reddy-red"
    }
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
          className="container mx-auto max-w-6xl text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <FaBook className="text-6xl text-reddy-red" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-reddy-blue mb-4">
            Découvrez Nos Livres
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Des ressources pratiques pour accélérer votre transformation digitale
          </p>
        </motion.div>
      </section>

      {/* Books Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-2 gap-12"
          >
            {books.map((book) => (
              <motion.div
                key={book.id}
                variants={cardVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                {/* Book Cover */}
                <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = `<div class="text-${book.color} text-6xl font-bold p-8 text-center"><FaBook /></div>`
                    }}
                  />
                  
                  {/* Badge */}
                  <div className={`absolute top-4 right-4 ${book.type === 'gratuit' ? 'bg-green-500' : 'bg-reddy-red'} text-white px-4 py-2 rounded-full font-bold shadow-lg`}>
                    {book.oldPrice && (
                      <div className="text-xs line-through opacity-75 mb-1">
                        {book.oldPrice}
                      </div>
                    )}
                    <div>{book.price}</div>
                    {book.oldPrice && (
                      <div className="text-xs mt-1 bg-yellow-400 text-reddy-red px-2 py-1 rounded-full">
                        PROMO
                      </div>
                    )}
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-8">
                  <h3 className={`text-2xl md:text-3xl font-bold text-${book.color} mb-2`}>
                    {book.title}
                  </h3>
                  <p className="text-lg text-gray-600 font-semibold mb-4">
                    {book.subtitle}
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {book.description}
                  </p>

                  {/* Action Button */}
                  {book.type === 'gratuit' ? (
                    <a
                      href="/landing/livre-gratuit"
                      className={`flex items-center justify-center gap-3 w-full py-4 px-6 bg-green-500 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                    >
                      <FaDownload />
                      Recevoir mon livre GRATUIT
                    </a>
                  ) : (
                    <button
                      onClick={() => handleOrderClick(book.title)}
                      className={`flex items-center justify-center gap-3 w-full py-4 px-6 bg-${book.color} text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                    >
                      <FaShoppingCart />
                      Commander maintenant
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
          >
            {!orderSubmitted ? (
              <>
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
                >
                  ×
                </button>

                <h3 className="text-2xl font-bold text-reddy-blue mb-6">
                  Commander le livre
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Livre sélectionné
                    </label>
                    <input
                      type="text"
                      value={orderForm.livre}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={orderForm.nom}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-reddy-blue focus:outline-none"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={orderForm.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-reddy-blue focus:outline-none"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={orderForm.whatsapp}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-reddy-blue focus:outline-none"
                      placeholder="+242 XX XXX XXXX"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-reddy-red text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      'Envoyer la commande'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl text-green-500 mb-4 animate-bounce">🎉</div>
                <h3 className="text-3xl font-bold text-green-600 mb-4">
                  Félicitations !
                </h3>
                <h4 className="text-xl font-semibold text-reddy-blue mb-3">
                  Votre commande est en cours de traitement
                </h4>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Nous avons bien reçu votre commande pour <strong>"{orderForm.livre}"</strong>.
                </p>
                <p className="text-gray-600 mb-6">
                  Notre équipe vous contactera très bientôt via WhatsApp au <strong>{orderForm.whatsapp}</strong> pour finaliser votre commande.
                </p>
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800 font-semibold">
                    ⚠️ Vous ne pourrez pas passer une nouvelle commande tant que celle-ci n'est pas traitée.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowOrderForm(false)
                    setOrderSubmitted(false)
                  }}
                  className="px-8 py-3 bg-reddy-blue text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
                >
                  Fermer
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Info Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-reddy-blue mb-6">
              Pourquoi lire nos livres ?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-4">📚</div>
                <h4 className="font-bold text-gray-800 mb-2">Contenu pratique</h4>
                <p className="text-gray-600 text-sm">
                  Des stratégies actionnables immédiatement
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-4">🌍</div>
                <h4 className="font-bold text-gray-800 mb-2">Contexte africain</h4>
                <p className="text-gray-600 text-sm">
                  Adapté aux réalités du marché africain
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-4">💡</div>
                <h4 className="font-bold text-gray-800 mb-2">Expertise éprouvée</h4>
                <p className="text-gray-600 text-sm">
                  Basé sur des années d'expérience terrain
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

export default BooksPage
