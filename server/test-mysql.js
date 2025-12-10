import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function testMySQL() {
  console.log('🔍 Test de connexion MySQL...')
  console.log('Configuration:')
  console.log('- Host:', process.env.DB_HOST || 'localhost')
  console.log('- User:', process.env.DB_USER || 'root')
  console.log('- Database:', process.env.DB_NAME || 'reddy_portfolio')
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'reddy_portfolio'
    })
    
    console.log('✅ Connexion MySQL réussie !')
    
    // Tester une requête simple
    const [rows] = await connection.execute('SELECT 1 as test')
    console.log('✅ Requête test réussie:', rows[0])
    
    await connection.end()
    console.log('🔌 Connexion fermée')
    
  } catch (error) {
    console.error('❌ Erreur MySQL:', error.message)
    console.error('Code:', error.code)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Solution: Démarrez MySQL/XAMPP/WAMP')
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Solution: Créez la base de données "reddy_portfolio"')
    }
  }
}

testMySQL()