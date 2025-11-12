import { motion } from 'framer-motion'
import { FaLinkedin, FaYoutube, FaWhatsapp, FaExternalLinkAlt } from 'react-icons/fa'
import Navbar from './Navbar'

const ProjectsPage = () => {
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

  const projects = [
    {
      name: "Zieta+",
      subtitle: "Cofondateur & Coordinateur",
      logo: "/projects/zieta-logo.png",
      description: "Entreprise que j'ai cofondée, spécialisée dans les solutions digitales africaines. Coordination d'une équipe de développeurs pour la création de ZietaBus, une application innovante de transport intégrant paiements mobiles et modèle freemium adapté au marché local.",
      link: "https://zietabus.netlify.app/",
      color: "reddy-red"
    },
    {
      name: "Conseil Éthique & Performance",
      subtitle: "Cabinet de Regis Mike Mvila",
      logo: "/projects/cep-logo.png",
      description: "Conception et développement du site web officiel pour ce cabinet de conseil stratégique. Création de l'identité visuelle complète et mise en place d'une présence digitale professionnelle pour accompagner la croissance du cabinet.",
      link: "https://cep-partners.cg",
      color: "reddy-blue"
    },
    {
      name: "Hymmeldat Rodolphe Dibakala",
      subtitle: "KIMINOU Brand",
      logo: "/projects/kiminou-logo.png",
      description: "Accompagnement stratégique d'une entrepreneure d'exception, élue au bureau mondial de la Jeune Chambre Internationale. Création complète de l'identité visuelle de sa marque KIMINOU : logo, cartes de visite et stratégie de communication audiovisuelle.",
      link: "https://www.adiac-congo.com/content/jeune-chambre-internationale-la-congolaise-elue-au-bureau-mondial-revient-sur-ses-missions",
      color: "reddy-red"
    },
    {
      name: "QUALISYS CONSULTING",
      subtitle: "Cabinet de Eric KOUAM, PhD - Dakar",
      logo: "/projects/qualisys-logo.png",
      description: "Collaboration avec ce cabinet international de conseil en management et IT. Réalisation complète du logo, conception de la maquette du site web et design de l'identité visuelle pour ce cabinet dirigé par un expert certifié ITIL Master, PMI et CISA.",
      link: "https://qualisysconsulting.com/",
      color: "reddy-blue"
    },
    {
      name: "EISMV",
      subtitle: "École Inter-États des Sciences et Médecine Vétérinaires - Dakar",
      logo: "/projects/eismv-logo.png",
      description: "Suivi et maintenance du site web de cette prestigieuse école vétérinaire de Dakar. Mise à jour régulière du contenu et publication de la revue vétérinaire en collaboration avec le Professeur BAKOU Niangoran Serge.",
      link: "https://www.eismv.org/",
      color: "reddy-red"
    },
    {
      name: "Carrefour Congo",
      subtitle: "Think Tank",
      logo: "/projects/carrefour-logo.png",
      description: "Création du logo pour cette plateforme de réflexion créée par des jeunes africains engagés. Un projet qui incarne l'innovation et le leadership de la jeunesse africaine dans les débats stratégiques et économiques.",
      link: "https://www.thinktank-carrefour.cg/",
      color: "reddy-red"
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
            Mes Projets & Réalisations
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Des initiatives concrètes au service de la transformation digitale africaine.
          </p>
        </motion.div>
      </section>

      {/* Projects Grid Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Project Logo */}
                <div className="p-8 flex justify-center items-center bg-gradient-to-br from-gray-50 to-white min-h-[200px]">
                  <div className="relative">
                    <div className={`absolute inset-0 bg-${project.color}/10 rounded-full blur-2xl`}></div>
                    <div className="relative w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={project.logo}
                        alt={project.name}
                        className="w-24 h-24 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = `<div class="text-${project.color} text-3xl font-bold">${project.name.charAt(0)}</div>`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className={`text-2xl font-bold text-${project.color} mb-1`}>
                    {project.name}
                  </h3>
                  {project.subtitle && (
                    <p className="text-sm text-gray-500 mb-3 font-semibold">
                      {project.subtitle}
                    </p>
                  )}
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Link Button */}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 text-${project.color} font-semibold hover:underline transition-all duration-300`}
                    >
                      Voir le projet
                      <FaExternalLinkAlt size={14} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Other Achievements Section */}
      <section className="py-16 px-6 bg-white/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto max-w-4xl text-center"
        >
          <div className="bg-gradient-to-br from-reddy-blue/5 to-reddy-red/5 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-reddy-blue mb-4">
              Autres Réalisations
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              D'autres projets sont actuellement en développement, alliant innovation, impact et formation dans le domaine de l'économie numérique africaine.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-reddy-blue mb-4">
              👥 Notre Équipe
            </h2>
            <p className="text-xl text-gray-700">
              Les talents qui portent nos projets et accompagnent votre transformation digitale
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-8 mb-12"
          >
            {/* Team Member 1 */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(230, 57, 70, 0.2)", transition: { duration: 0.3 } }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="h-64 bg-gradient-to-br from-reddy-blue/20 to-reddy-red/20 flex items-center justify-center overflow-hidden">
                <img
                  src="/team/red.png"
                  alt="Reddy Mpassi"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML = '<div class="text-6xl text-reddy-blue">👤</div>'
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-reddy-blue mb-1">
                  Reddy Mpassi
                </h3>
                <p className="text-reddy-red font-semibold mb-3">
                  Cofondateur & Coach en Économie Numérique | Expert Senior
                </p>
                <p className="text-gray-600 text-sm mb-3">
                  Formateur dans les instituts : EAD, IPC, ECES
                </p>
                <p className="text-gray-600 text-sm italic leading-relaxed">
                  "Passionné par la transformation digitale africaine, j'accompagne les entrepreneurs dans leur transition vers le numérique."
                </p>
              </div>
            </motion.div>

            {/* Team Member 2 */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(29, 53, 87, 0.2)", transition: { duration: 0.3 } }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="h-64 bg-gradient-to-br from-reddy-red/20 to-reddy-blue/20 flex items-center justify-center overflow-hidden">
                <img
                  src="/team/rene.png"
                  alt="René Kounkou"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML = '<div class="text-6xl text-reddy-red">👤</div>'
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-reddy-blue mb-1">
                  René Kounkou
                </h3>
                <p className="text-reddy-red font-semibold mb-3">
                  Expert externe en Contrôle Qualité & Validation Technique
                </p>
                <p className="text-gray-600 text-sm italic leading-relaxed">
                  "Consultant senior intervenant dans la vérification technique et la qualité logicielle des projets développés par l'équipe Zieta+. Mon expertise en développement full-stack, automatisation de tests et conformité des livrables garantit la fiabilité et la stabilité de chaque solution mise en ligne."
                </p>
              </div>
            </motion.div>

            {/* Team Member 3 */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(230, 57, 70, 0.2)", transition: { duration: 0.3 } }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="h-64 bg-gradient-to-br from-reddy-blue/20 to-reddy-red/20 flex items-center justify-center overflow-hidden">
                <img
                  src="/team/loutaladio.png"
                  alt="LOUTALADIO Danick Arcel"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML = '<div class="text-6xl text-reddy-blue">👤</div>'
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-reddy-blue mb-1">
                  LOUTALADIO Danick Arcel
                </h3>
                <p className="text-reddy-red font-semibold mb-3">
                  Étudiant en Génie Informatique | Développeur web Frontend junior
                </p>
                <p className="text-gray-600 text-sm italic leading-relaxed">
                  "Passionné par le développement web moderne, je contribue à créer des interfaces utilisateur élégantes et performantes pour les projets Zieta+."
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <a
              href="/team/equipe.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-gradient-to-r from-reddy-blue to-reddy-red text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              🔹 Voir le profil complet de l'équipe
            </a>
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

export default ProjectsPage
