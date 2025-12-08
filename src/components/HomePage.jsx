import { motion } from 'framer-motion'
import { FaLinkedin, FaYoutube, FaWhatsapp } from 'react-icons/fa'
import Navbar from './Navbar'
import LeadMagnetPopup from './LeadMagnetPopup'
import FloatingWhatsApp from './FloatingWhatsApp'
import LiveVisitorCounter from './LiveVisitorCounter'
import { useVisitorTracking } from '../hooks/useVisitorTracking'

const HomePage = () => {
  // Tracker les visiteurs
  useVisitorTracking()
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-poppins">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-reddy-blue/10 via-transparent to-reddy-red/10"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Image */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-center md:justify-start order-1 md:order-1"
            >
              <div className="relative">
                {/* Halo Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-reddy-red/30 to-reddy-blue/30 rounded-full blur-3xl scale-110"></div>
                
                {/* Profile Image */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src="/coach.png"
                    alt="Reddy Mpassi - Coach en Économie Numérique"
                    className="w-full h-full object-cover object-[center_20%]"
                    loading="eager"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Side - Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center md:text-left order-2 md:order-2"
            >
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-reddy-blue mb-4 leading-tight"
              >
                Reddy Mpassi
              </motion.h1>
              
              <motion.h2
                variants={itemVariants}
                className="text-xl md:text-2xl font-semibold text-reddy-red mb-6"
              >
                Coach en Économie Numérique & Cofondateur de Zieta+
              </motion.h2>
              
              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed max-w-xl"
              >
                Accompagner la transformation digitale en Afrique, entre innovation, éducation et entrepreneuriat.
              </motion.p>
              
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start flex-wrap"
              >
                <a
                  href="/projets"
                  className="px-8 py-4 bg-reddy-blue text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
                >
                  Découvrir mes projets
                </a>
                
                <a
                  href="/livres"
                  className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
                >
                  Nos livres
                </a>
                
                <a
                  href="/reserver"
                  className="px-8 py-4 bg-reddy-red text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
                >
                  Réserver une session de coaching
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="fixed left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-20"
        >
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-reddy-blue shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          >
            <FaLinkedin size={24} />
          </a>
          
          <a
            href="https://www.youtube.com/@Reddy-Insider"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-reddy-red shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          >
            <FaYoutube size={24} />
          </a>
          
          <a
            href="https://wa.me/242050416661?text=Bonjour%20Reddy,%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20services"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          >
            <FaWhatsapp size={24} />
          </a>
        </motion.div>

        {/* Mobile Social Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex lg:hidden gap-4 z-20"
        >
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-reddy-blue shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          >
            <FaLinkedin size={20} />
          </a>
          
          <a
            href="https://www.youtube.com/@Reddy-Insider"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-reddy-red shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          >
            <FaYoutube size={20} />
          </a>
          
          <a
            href="https://wa.me/242050416661?text=Bonjour%20Reddy,%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20services"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          >
            <FaWhatsapp size={20} />
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-600 text-sm border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <p>© 2025 Reddy Mpassi — Tous droits réservés</p>
      </footer>

      {/* Lead Magnet Popup */}
      <LeadMagnetPopup />
      
      {/* Floating WhatsApp */}
      <FloatingWhatsApp />
      
      {/* Live Visitor Counter */}
      <LiveVisitorCounter />
    </div>
  )
}

export default HomePage
