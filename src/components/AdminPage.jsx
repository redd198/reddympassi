import { useState, useEffect } from 'react'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

const AdminPage = () => {
  const [token, setToken] = useState(null)

  useEffect(() => {
    console.log('🔐 AdminPage: Vérification du token...')
    const savedToken = localStorage.getItem('adminToken')
    if (savedToken) {
      console.log('✅ Token trouvé, chargement du dashboard')
      setToken(savedToken)
    } else {
      console.log('❌ Pas de token, affichage du login')
    }
  }, [])

  const handleLogin = (newToken) => {
    console.log('✅ Login réussi')
    setToken(newToken)
  }

  const handleLogout = () => {
    console.log('👋 Déconnexion')
    localStorage.removeItem('adminToken')
    setToken(null)
  }

  console.log('🎨 AdminPage render, token:', token ? 'présent' : 'absent')

  if (!token) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return <AdminDashboard token={token} onLogout={handleLogout} />
}

export default AdminPage
