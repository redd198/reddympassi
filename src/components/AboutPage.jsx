import { motion } from 'framer-motion'
import { FaLinkedin, FaYoutube, FaWhatsapp, FaBriefcase, FaGraduationCap, FaGlobe, FaHandshake } from 'react-icons/fa'
import Navbar from './Navbar'

const AboutPage = () => {
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

  const missions = [
    {
      icon: <FaBriefcase className="text-4xl text-reddy-red" />,
      title: "Zieta+ – Cofondateur et Directeur Général",
      description: "Développement de solutions numériques adaptées aux entreprises africaines."
    },
    {
      icon: <FaGraduationCap className="text-4xl text-reddy-blue" />,
      title: "Formation en économie numérique",
      description: "Animation de séminaires à l'EAD et l'IS2M avec plus de 50 participants."
    },
    {
      icon: <FaGlobe className="text-4xl text-reddy-red" />,
      title: "Projets digitaux",
      description: "Conception du site web du Conseil Éthique & Performance, création de la chaîne YouTube CEPCONGO, logos pour Kiminou, Wesley Consulting et Carrefour Congo."
    },
    {
      icon: <FaHandshake className="text-4xl text-reddy-blue" />,
      title: "Engagement communautaire",
      description: "Coaching et accompagnement des jeunes porteurs de projets numériques."
    }
  ]

  const galleryImages = [
    { src: "/gallery/cep.jfif", alt: "Conseil Éthique & Performance" },
    { src: "/gallery/images.jfif", alt: "Projet digital" },
    { src: "/gallery/les_etudiants_de_is2m.jpg", alt: "Étudiants de IS2M - Formation" },
    { src: "/gallery/LOGO-creer.jfif", alt: "Logo Créer" },
    { src: "/gallery/LOGO-ZIETAplus.png", alt: "Logo Zieta+" },
    { src: "/gallery/LOGO.jfif", alt: "Logo Projet" },
    { src: "/gallery/maquette-site.jpg", alt: "Maquette site web" },
    { src: "/gallery/téléchargement.jfif", alt: "Réalisation digitale" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-poppins">
      <Navbar />
      
      {/* Introduction Section */}
      <section className="relative py-20 px-6 overflow-hidden mt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-reddy-blue/5 via-transparent to-reddy-red/5"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto max-w-4xl text-center relative z-10"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-reddy-blue mb-4">
            À propos de Reddy Mpassi
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-12">
            Un acteur engagé pour la transformation numérique et la formation des talents africains.
          </p>

          {/* Profile Image with Halo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center mb-16"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-reddy-red/30 to-reddy-blue/30 rounded-2xl blur-3xl scale-110"></div>
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                <img
                  src="/reddy-mpassi.png"
                  alt="Reddy Mpassi"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Biography Section */}
      <section className="py-16 px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="container mx-auto max-w-4xl"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-reddy-blue mb-6">
              Biographie
            </h2>
            
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                <span className="font-semibold text-reddy-blue">Reddy Mpassi</span> est un coach en économie numérique et cofondateur de <span className="font-semibold text-reddy-red">Zieta+</span>, une startup africaine dédiée à la digitalisation des entreprises locales et à la création de solutions web innovantes.
              </p>
              
              <p>
                Diplômé et passionné par la <span className="font-semibold text-reddy-blue">transformation digitale</span>, il accompagne les jeunes entrepreneurs et organisations dans l'adoption d'outils numériques adaptés au contexte congolais et africain.
              </p>
              
              <p>
                En parallèle, il anime des formations et séminaires dans des établissements comme <span className="font-semibold text-reddy-blue">l'EAD</span> (École Africaine de Développement) et <span className="font-semibold text-reddy-blue">l'IS2M</span>, où il partage son expérience sur le marketing digital et l'économie numérique.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Missions & Achievements Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-reddy-blue text-center mb-12"
          >
            Missions et Réalisations
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {missions.map((mission, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  {mission.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                  {mission.title}
                </h3>
                <p className="text-gray-600 text-center text-sm leading-relaxed">
                  {mission.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-reddy-blue text-center mb-4"
          >
            Galerie & Médias
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-gray-600 mb-12"
          >
            Découvrez nos événements, formations et partenaires
          </motion.p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8"
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white border border-gray-200"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML = `<div class="flex items-center justify-center h-full text-gray-400 text-sm p-4 text-center">${image.alt}</div>`
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* YouTube Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <a
              href="https://youtube.com/@CEPCONGO"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-reddy-red text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <FaYoutube size={24} />
              Découvrez la chaîne YouTube CEPCONGO
            </a>
            <p className="text-gray-600 text-sm mt-3">
              Partenaire pour lequel nous avons créé et développé la chaîne
            </p>
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

export default AboutPage
