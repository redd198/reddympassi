import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaLock, FaUser } from 'react-icons/fa'

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('adminToken', data.token)
        onLogin(data.token)
      } else {
        // Messages d'erreur plus explicites
        if (response.status === 404) {
          setError('❌ Utilisateur non trouvé. Créez d\'abord l\'admin via /api/create-first-admin')
        } else if (response.status === 401) {
          setError('❌ Mot de passe incorrect')
        } else {
          setError(data.message || data.error || 'Erreur de connexion')
        }
      }
    } catch (error) {
      console.error('Erreur login:', error)
      setError('❌ Impossible de contacter le serveur. Vérifiez que l\'API est en ligne.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Panneau Admin</h1>
          <p className="text-gray-600">Connectez-vous pour accéder au dashboard</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <FaUser className="inline mr-2" />
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <FaLock className="inline mr-2" />
              Mot de passe
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Identifiants par défaut:</p>
          <p className="font-mono bg-gray-100 p-2 rounded mt-2">
            admin / Admin@2024
          </p>
        </div>

        {error && error.includes('Créez d\'abord') && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 mb-2">
              <strong>🔧 Solution :</strong> Créez l'utilisateur admin en accédant à :
            </p>
            <a
              href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/create-first-admin`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm break-all"
            >
              {import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/create-first-admin
            </a>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AdminLogin
