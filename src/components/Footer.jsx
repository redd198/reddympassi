import { FaLinkedin, FaYoutube, FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-reddy-blue to-reddy-blue/90 text-white py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <div className="space-y-2">
              <a 
                href="mailto:contact@reddympassi.site" 
                className="flex items-center gap-2 hover:text-reddy-red transition-colors"
              >
                <FaEnvelope />
                <span>contact@reddympassi.site</span>
              </a>
              <a 
                href="https://wa.me/242050416661" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-reddy-red transition-colors"
              >
                <FaWhatsapp />
                <span>+242 05 041 66 61</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
            <div className="space-y-2">
              <a href="/about" className="block hover:text-reddy-red transition-colors">À propos</a>
              <a href="/projets" className="block hover:text-reddy-red transition-colors">Projets</a>
              <a href="/coaching" className="block hover:text-reddy-red transition-colors">Coaching</a>
              <a href="/livres" className="block hover:text-reddy-red transition-colors">Nos Livres</a>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Suivez-nous</h3>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/reddy-insider"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-reddy-blue hover:scale-110 transition-transform"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://www.youtube.com/@Reddy-Insider"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-reddy-red hover:scale-110 transition-transform"
              >
                <FaYoutube size={20} />
              </a>
              <a
                href="https://wa.me/242050416661"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 hover:scale-110 transition-transform"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-6 text-center text-sm">
          <p>© 2025 Reddy Mpassi — Tous droits réservés</p>
          <p className="mt-2 text-white/80">Coach en Économie Numérique & Cofondateur de Zieta+</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
