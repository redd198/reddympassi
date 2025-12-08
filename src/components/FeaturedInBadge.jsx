import { motion } from 'framer-motion'

const FeaturedInBadge = () => {
  const features = [
    {
      name: "Africa Tech Summit",
      logo: "🌍",
      year: "2024"
    },
    {
      name: "Digital Congo",
      logo: "🇨🇩",
      year: "2024"
    },
    {
      name: "Fintech Africa",
      logo: "💳",
      year: "2023"
    },
    {
      name: "Entrepreneur Magazine",
      logo: "📰",
      year: "2024"
    },
    {
      name: "YouTube Reddy-Insider",
      logo: "📺",
      year: "2024"
    }
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-12 bg-white border-t border-gray-100"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-4">
            Vu et reconnu par
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl">{feature.logo}</span>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">{feature.name}</p>
                <p className="text-xs text-gray-500">{feature.year}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-reddy-blue/10 to-reddy-red/10 rounded-full">
            <span className="text-sm text-gray-600">
              🏆 Expert reconnu en économie numérique africaine
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default FeaturedInBadge