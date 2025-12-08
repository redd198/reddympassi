import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaRocket, FaMoneyBillWave, FaUsers, FaChartLine, FaCheckCircle } from 'react-icons/fa'
import Navbar from './Navbar'

const AffiliatePage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    whatsapp: '',
    mobile_money_operateur: 'airtel',
    mobile_money_numero: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [affiliateCode, setAffiliateCode] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/affiliation/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (response.ok) {
        setIsSuccess(true)
        setAffiliateCode(data.code)
      } else {
        alert(data.message || 'Erreur lors de l\'inscription')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'inscription. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const benefits = [
    {
      icon: FaMoneyBillWave,
      title: '30% de Commission',
      description: 'Gagnez jusqu\'à 30% sur chaque vente de formation'
    },
    {
      icon: FaRocket,
      title: 'Paiements Rapides',
      description: 'Recevez vos commissions via Mobile Money chaque mois'
    },
    {
      icon: FaUsers,
      title: 'Support Dédié',
      description: 'Équipe disponible pour vous aider à réussir'
    },
    {
      icon: FaChartLine,
      title: 'Dashboard Complet',
      description: 'Suivez vos ventes et commissions en temps réel'
    }
  ]

  const commissions = [
    { produit: 'Formations', taux: '30%', exemple: '15,000 FCFA sur 50,000 FCFA' },
    { produit: 'Coaching', taux: '20%', exemple: '20,000 FCFA sur 100,000 FCFA' },
    { produit: 'Livres', taux: '15%', exemple: '3,000 FCFA sur 20,000 FCFA' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20 max-w-6xl">
        {!isSuccess ? (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-reddy-blue mb-4">
                Programme d'Affiliation
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Gagnez de l'argent en partageant nos formations et services d'économie numérique
              </p>
            </motion.div>

            {/* Benefits */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-lg text-center"
                >
                  <benefit.icon className="text-4xl text-reddy-blue mx-auto mb-3" />
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Commission Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                💰 Grille de Commissions
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4">Produit</th>
                      <th className="text-center py-3 px-4">Commission</th>
                      <th className="text-right py-3 px-4">Exemple</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissions.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 px-4 font-semibold">{item.produit}</td>
                        <td className="py-4 px-4 text-center">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                            {item.taux}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right text-gray-600">{item.exemple}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>🎁 Bonus :</strong> Gagnez 10,000 FCFA dès votre première vente ! 
                  Plus vous vendez, plus votre commission augmente (jusqu'à +15%).
                </p>
              </div>
            </motion.div>

            {/* Registration Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Rejoignez le Programme
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reddy-blue"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reddy-blue"
                      placeholder="Votre prénom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reddy-blue"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reddy-blue"
                      placeholder="+242 XX XX XX XX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opérateur Mobile Money *
                    </label>
                    <select
                      name="mobile_money_operateur"
                      value={formData.mobile_money_operateur}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reddy-blue"
                    >
                      <option value="airtel">Airtel Money</option>
                      <option value="mtn">MTN Mobile Money</option>
                      <option value="orange">Orange Money</option>
                      <option value="moov">Moov Money</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro Mobile Money *
                    </label>
                    <input
                      type="tel"
                      name="mobile_money_numero"
                      value={formData.mobile_money_numero}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reddy-blue"
                      placeholder="+242 XX XX XX XX"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    En vous inscrivant, vous acceptez de promouvoir nos produits de manière éthique 
                    et de respecter nos conditions d'affiliation.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-reddy-blue to-reddy-red text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Inscription en cours...' : 'Devenir Affilié 🚀'}
                </button>
              </form>
            </motion.div>
          </>
        ) : (
          // Success Message
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-5xl text-green-500" />
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Bienvenue dans le Programme ! 🎉
            </h2>

            <p className="text-lg text-gray-600 mb-6">
              Votre inscription a été validée avec succès.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
              <p className="text-sm text-gray-600 mb-2">Votre code affilié unique :</p>
              <p className="text-3xl font-bold text-reddy-blue mb-4">{affiliateCode}</p>
              <p className="text-sm text-gray-600">
                Utilisez ce code pour tracker vos ventes et commissions
              </p>
            </div>

            <div className="space-y-4 text-left mb-8">
              <h3 className="font-bold text-lg text-gray-800">Prochaines étapes :</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1" />
                  <p className="text-gray-700">
                    Vous recevrez un email avec votre lien d'affiliation personnalisé
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1" />
                  <p className="text-gray-700">
                    Accédez à votre dashboard pour suivre vos performances
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1" />
                  <p className="text-gray-700">
                    Téléchargez le matériel marketing pour promouvoir nos produits
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <a
                href={`/affiliation/dashboard?code=${affiliateCode}`}
                className="px-6 py-3 bg-reddy-blue text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Accéder au Dashboard
              </a>
              <a
                href="/"
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
              >
                Retour à l'accueil
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AffiliatePage