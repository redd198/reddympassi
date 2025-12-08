import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaEye, FaUsers, FaGlobe } from 'react-icons/fa'

const LiveVisitorCounter = () => {
  const [stats, setStats] = useState({
    currentVisitors: 0,
    totalVisitors: 0,
    countriesCount: 0
  })

  useEffect(() => {
    // Simuler des visiteurs en temps réel (en attendant l'API)
    const simulateVisitors = () => {
      setStats(prev => ({
        currentVisitors: Math.floor(Math.random() * 15) + 5, // 5-20 visiteurs
        totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 3) + 1,
        countriesCount: Math.floor(Math.random() * 10) + 15 // 15-25 pays
      }))
    }

    // Initialiser avec des valeurs de base
    setStats({
      currentVisitors: Math.floor(Math.random() * 15) + 5,
      totalVisitors: Math.floor(Math.random() * 1000) + 2500,
      countriesCount: Math.floor(Math.random() * 10) + 15
    })

    // Mettre à jour toutes les 30 secondes
    const interval = setInterval(simulateVisitors, 30000)

    return () => clearInterval(interval)
  }, [])

  const statItems = [
    {
      icon: FaEye,
      value: stats.currentVisitors,
      label: "En ligne maintenant",
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      icon: FaUsers,
      value: stats.totalVisitors.toLocaleString(),
      label: "Visiteurs total",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: FaGlobe,
      value: stats.countriesCount,
      label: "Pays représentés",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-6 left-6 z-40 hidden lg:block"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 min-w-[280px]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">Activité en temps réel</span>
        </div>
        
        <div className="space-y-3">
          {statItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className={`w-8 h-8 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                <item.icon className={`${item.color}`} size={14} />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-800">{item.value}</span>
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            🌍 Communauté grandissante d'entrepreneurs africains
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default LiveVisitorCounter