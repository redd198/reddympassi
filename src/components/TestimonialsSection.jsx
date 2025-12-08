import { motion } from 'framer-motion'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Marie Kouassi",
      role: "Entrepreneure E-commerce",
      location: "Abidjan, Côte d'Ivoire",
      text: "Grâce aux conseils de Reddy, j'ai pu lancer ma boutique en ligne qui génère maintenant 500k FCFA/mois. Son expertise en économie numérique est exceptionnelle !",
      rating: 5,
      avatar: "👩🏾‍💼"
    },
    {
      name: "Jean-Claude Mbala",
      role: "Développeur Fintech",
      location: "Kinshasa, RDC",
      text: "Le coaching de Reddy m'a permis de comprendre les enjeux de la fintech en Afrique. Aujourd'hui, je travaille sur une app de paiement mobile révolutionnaire.",
      rating: 5,
      avatar: "👨🏿‍💻"
    },
    {
      name: "Fatou Diallo",
      role: "Consultante Digital",
      location: "Dakar, Sénégal",
      text: "Les formations de Reddy sont concrètes et adaptées au contexte africain. J'ai multiplié mes revenus par 3 en appliquant ses stratégies digitales.",
      rating: 5,
      avatar: "👩🏾‍🎓"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-reddy-blue mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez comment nos accompagnements transforment les projets digitaux en Afrique
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 text-reddy-blue/20">
                <FaQuoteLeft size={24} />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" size={16} />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-reddy-blue to-reddy-red rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Rejoignez plus de <strong>500+ entrepreneurs</strong> qui ont transformé leur business
          </p>
          <a
            href="/reserver"
            className="inline-block px-8 py-4 bg-reddy-red text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            Commencer mon transformation 🚀
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection