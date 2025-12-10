import { motion } from 'framer-motion'
import { FaLinkedin, FaYoutube, FaWhatsapp, FaShoppingCart, FaRobot, FaBullhorn, FaBriefcase, FaCalendarAlt, FaQuoteLeft } from 'react-icons/fa'
import Navbar from './Navbar'

const CoachingPage = () => {
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

  const itemVariants = {
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  const themes = [
    {
      icon: <FaShoppingCart className="text-5xl" />,
      title: "E-commerce et vente en ligne",
      description: "De l'idée à la boutique rentable.",
      color: "reddy-red"
    },
    {
      icon: <FaRobot className="text-5xl" />,
      title: "Intelligence Artificielle appliquée",
      description: "Automatiser, analyser et innover avec l'IA.",
      color: "reddy-blue"
    },
    {
      icon: <FaBullhorn className="text-5xl" />,
      title: "Marketing digital & réseaux sociaux",
      description: "Stratégies de visibilité et tunnels de vente.",
      color: "reddy-red"
    },
    {
      icon: <FaBriefcase className="text-5xl" />,
      title: "Entrepreneuriat numérique",
      description: "Construire un modèle économique viable en Afrique.",
      color: "reddy-blue"
    },
  ]

  const formations = [
    {
      title: "Économie numérique en Afrique",
      description: null,
      descriptionJSX: (
        <>
          Programme de formation exploité à{' '}
          <a 
            href="https://eadcongo.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-reddy-blue font-semibold hover:underline"
          >
            l'EAD Université
          </a>
          . Comprendre les enjeux, les modèles économiques et les opportunités du digital africain.
        </>
      ),
      date: "En cours",
      status: "Session actuelle",
      buttonText: "Rejoindre la formation",
      buttonLink: "/reserver",
      color: "reddy-blue",
      image: "/formations/e-n.jpg"
    },
    {
      title: "Le cerveau de l'entrepreneur e-commerce",
      description: "Un parcours complet sur la psychologie, la stratégie et la réussite dans le e-commerce africain.",
      date: "Janvier 2026",
      status: "À venir",
      buttonText: "Découvrir le programme",
      buttonLink: "/reserver",
      color: "reddy-red",
      image: "/formations/c-e.jpg"
    },
    {
      title: "Développement App",
      description: "Apprenez à concevoir et développer des applications web complètes en un temps record, sans compétences avancées en programmation.",
      date: "Mars 2026",
      status: "À venir",
      buttonText: "Je m'inscris",
      buttonLink: "/reserver",
      color: "reddy-blue",
      image: "/formations/a-i.jpg"
    },
  ]

  const testimonials = [
    {
      name: "Marie Kongo",
      role: "Étudiante à l'EAD",
      photo: "/testimonials/marie.jpg",
      quote: "Grâce à la formation de Reddy Mpassi, j'ai lancé ma première boutique en ligne et compris comment structurer mon business digital."
    },
    {
      name: "Jean-Paul Mbemba",
      role: "Entrepreneur à Brazzaville",
      photo: "/testimonials/jean-paul.jpg",
      quote: "Les séminaires sur le marketing digital m'ont permis de tripler ma visibilité en ligne et d'attirer de nouveaux clients chaque semaine."
    },
    {
      name: "Grace Nzila",
      role: "Entrepreneure à Pointe-Noire",
      photo: "/testimonials/grace.jpg",
      quote: "Un accompagnement professionnel et humain. J'ai acquis les compétences nécessaires pour digitaliser mon entreprise avec confiance."
    },
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-reddy-blue mb-4">
            Coaching & Formations
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto">
            Former, inspirer et accompagner la nouvelle génération d'entrepreneurs numériques africains.
          </p>
        </motion.div>
      </section>

      {/* Themes Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-reddy-blue text-center mb-12"
          >
            Thématiques principales
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-2 gap-8"
          >
            {themes.map((theme, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-l-4 border-${theme.color}`}
              >
                <div className={`text-${theme.color} mb-4`}>
                  {theme.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {theme.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {theme.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Formations Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-reddy-blue text-center mb-4"
          >
            Formations en cours ou à venir
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-gray-600 mb-12"
          >
            Rejoignez nos programmes de formation et développez vos compétences
          </motion.p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {formations.map((formation, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Formation Image */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={formation.image}
                    alt={formation.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = `<div class="text-${formation.color} text-4xl font-bold p-8 text-center">${formation.title.split(' ')[0]}</div>`
                    }}
                  />
                </div>

                {/* Formation Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FaCalendarAlt className={`text-${formation.color}`} />
                    <span className={`text-sm font-semibold text-${formation.color}`}>
                      {formation.status} • {formation.date}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {formation.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {formation.descriptionJSX || formation.description}
                  </p>

                  <a
                    href={formation.buttonLink}
                    className={`block w-full py-3 px-6 bg-${formation.color} text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center`}
                  >
                    {formation.buttonText}
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-reddy-blue text-center mb-4"
          >
            Témoignages
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-gray-600 mb-12"
          >
            Ce que disent nos participants
          </motion.p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-lg p-8 relative"
              >
                <FaQuoteLeft className="text-4xl text-reddy-red/20 absolute top-6 right-6" />
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-reddy-red/20 to-reddy-blue/20 flex items-center justify-center overflow-hidden">
                    <img
                      src={testimonial.photo}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.innerHTML = `<div class="text-reddy-blue text-2xl font-bold">${testimonial.name.charAt(0)}</div>`
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-reddy-blue/10 to-reddy-red/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto max-w-4xl text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-reddy-blue mb-6">
            Prêt à développer vos compétences ?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Rejoignez la communauté des entrepreneurs numériques africains
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/reserver"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-reddy-red text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Réserver une session de coaching
            </motion.a>
            
            <motion.a
              href="/livres"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-reddy-blue text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Découvrir nos livres
            </motion.a>
          </div>
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
                href="https://www.linkedin.com/in/reddy-insider"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-reddy-blue text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
              >
                <FaLinkedin size={20} />
              </a>
              
              <a
                href="https://www.youtube.com/@Reddy-Insider"
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

export default CoachingPage
