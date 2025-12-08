import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCalculator, FaChartLine, FaRocket } from 'react-icons/fa'
import Navbar from './Navbar'

const CalculatorsPage = () => {
  const [activeCalculator, setActiveCalculator] = useState('roi')

  // États pour ROI Marketing
  const [roiInputs, setRoiInputs] = useState({
    investissement: '',
    revenus: '',
    duree: '12'
  })
  const [roiResult, setRoiResult] = useState(null)

  // Calculer ROI
  const calculateROI = () => {
    const invest = parseFloat(roiInputs.investissement)
    const rev = parseFloat(roiInputs.revenus)
    const duree = parseInt(roiInputs.duree)

    if (invest && rev) {
      const roi = ((rev - invest) / invest) * 100
      const beneficeNet = rev - invest
      const roiMensuel = roi / duree

      setRoiResult({
        roi: roi.toFixed(2),
        beneficeNet: beneficeNet.toFixed(0),
        roiMensuel: roiMensuel.toFixed(2),
        verdict: roi > 100 ? 'Excellent' : roi > 50 ? 'Bon' : roi > 0 ? 'Acceptable' : 'À améliorer'
      })
    }
  }

  const calculators = [
    {
      id: 'roi',
      name: 'ROI Marketing Digital',
      icon: FaChartLine,
      description: 'Calculez le retour sur investissement de vos campagnes',
      color: 'blue'
    },
    {
      id: 'ecommerce',
      name: 'Simulateur E-commerce',
      icon: FaRocket,
      description: 'Estimez vos revenus potentiels',
      color: 'green'
    },
    {
      id: 'business',
      name: 'Évaluateur Business',
      icon: FaCalculator,
      description: 'Évaluez la viabilité de votre projet',
      color: 'purple'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-reddy-blue mb-4">
            Calculateurs Gratuits
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Outils professionnels pour évaluer vos projets digitaux
          </p>
        </motion.div>

        {/* Sélection calculateur */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {calculators.map((calc) => (
            <motion.button
              key={calc.id}
              onClick={() => {
                setActiveCalculator(calc.id)
                setRoiResult(null)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-6 rounded-2xl shadow-lg transition-all duration-300 ${
                activeCalculator === calc.id
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                  : 'bg-white text-gray-800 hover:shadow-xl'
              }`}
            >
              <calc.icon className="text-4xl mb-3 mx-auto" />
              <h3 className="font-bold text-lg mb-2">{calc.name}</h3>
              <p className={`text-sm ${activeCalculator === calc.id ? 'text-white/90' : 'text-gray-600'}`}>
                {calc.description}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Calculateur ROI */}
        {activeCalculator === 'roi' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Calculateur ROI Marketing</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investissement total (FCFA)
                </label>
                <input
                  type="number"
                  value={roiInputs.investissement}
                  onChange={(e) => setRoiInputs({...roiInputs, investissement: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="500000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenus générés (FCFA)
                </label>
                <input
                  type="number"
                  value={roiInputs.revenus}
                  onChange={(e) => setRoiInputs({...roiInputs, revenus: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="1500000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée (mois)
                </label>
                <select
                  value={roiInputs.duree}
                  onChange={(e) => setRoiInputs({...roiInputs, duree: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">1 mois</option>
                  <option value="3">3 mois</option>
                  <option value="6">6 mois</option>
                  <option value="12">12 mois</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={calculateROI}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Calculer mon ROI
            </button>
            
            {roiResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl"
              >
                <h3 className="text-xl font-bold text-blue-800 mb-4">Résultats :</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">ROI Total</p>
                    <p className="text-3xl font-bold text-blue-600">{roiResult.roi}%</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Bénéfice Net</p>
                    <p className="text-3xl font-bold text-green-600">{parseInt(roiResult.beneficeNet).toLocaleString()} FCFA</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">ROI Mensuel</p>
                    <p className="text-2xl font-bold text-purple-600">{roiResult.roiMensuel}%</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Verdict</p>
                    <p className="text-2xl font-bold text-gray-800">{roiResult.verdict}</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-reddy-blue to-reddy-red rounded-lg text-white text-center">
                  <p className="font-semibold mb-2">🎁 Besoin d'aide pour améliorer votre ROI ?</p>
                  <a
                    href="/reserver"
                    className="inline-block px-6 py-2 bg-white text-reddy-blue font-bold rounded-lg hover:shadow-lg transition-all"
                  >
                    Réserver une consultation gratuite
                  </a>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Autres calculateurs - Coming Soon */}
        {activeCalculator !== 'roi' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
          >
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Bientôt disponible !
            </h2>
            <p className="text-gray-600 mb-6">
              Ce calculateur sera disponible très prochainement.
            </p>
            <button
              onClick={() => setActiveCalculator('roi')}
              className="px-6 py-3 bg-reddy-blue text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Essayer le calculateur ROI
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CalculatorsPage