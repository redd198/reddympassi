# 🚨 FIX PRODUCTION - CRÉER LES TABLES MANQUANTES

## ❌ PROBLÈME
- Popup fonctionne ✅
- Données capturées ✅  
- API appelée ✅
- **Erreur 500** : Tables `leads` et `pdf_downloads` manquantes ❌

## ✅ SOLUTION IMMÉDIATE

### Option 1: Via l'interface Render/Supabase
1. **Connecte-toi** à ton dashboard Render ou Supabase
2. **Ouvre la console SQL** de ta base de données
3. **Exécute ces requêtes** :

```sql
-- Table leads
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100),
    telephone VARCHAR(20),
    email VARCHAR(255),
    whatsapp VARCHAR(20),
    preference VARCHAR(20) DEFAULT 'email',
    source VARCHAR(100) DEFAULT 'site-web',
    produit VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pdf_downloads
CREATE TABLE IF NOT EXISTS pdf_downloads (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
    nom VARCHAR(200),
    email VARCHAR(255),
    telephone VARCHAR(20),
    livre VARCHAR(255) DEFAULT 'Économie Numérique en Afrique – Focus Congo-Brazzaville',
    ip_address VARCHAR(45),
    user_agent TEXT,
    source VARCHAR(100) DEFAULT 'livre-gratuit',
    email_sent BOOLEAN DEFAULT FALSE,
    download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_pdf_downloads_date ON pdf_downloads(download_date);
```

### Option 2: Via un script de migration
Si tu as accès au serveur backend, ajoute ce script et exécute-le :

```javascript
// migrations-production.js
import { executeQuery } from './db-query.js'

const createTables = async () => {
  try {
    console.log('🚀 Création des tables en production...')
    
    // Table leads
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        prenom VARCHAR(100) NOT NULL,
        nom VARCHAR(100),
        telephone VARCHAR(20),
        email VARCHAR(255),
        whatsapp VARCHAR(20),
        preference VARCHAR(20) DEFAULT 'email',
        source VARCHAR(100) DEFAULT 'site-web',
        produit VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Table pdf_downloads
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS pdf_downloads (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
        nom VARCHAR(200),
        email VARCHAR(255),
        telephone VARCHAR(20),
        livre VARCHAR(255) DEFAULT 'Économie Numérique en Afrique – Focus Congo-Brazzaville',
        ip_address VARCHAR(45),
        user_agent TEXT,
        source VARCHAR(100) DEFAULT 'livre-gratuit',
        email_sent BOOLEAN DEFAULT FALSE,
        download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    console.log('✅ Tables créées avec succès !')
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

createTables()
```

## 🧪 TEST APRÈS CRÉATION

Une fois les tables créées :

1. **Retourne sur ton site**
2. **Vide le localStorage** : `localStorage.removeItem('leadMagnetSeen')`
3. **Recharge et teste** le popup à nouveau
4. **Tu devrais voir** le message de succès ! ✅

## 📊 VÉRIFICATION

Pour vérifier que ça marche :
1. **Teste le popup** → Message de succès
2. **Va dans l'admin** → Nouvelles statistiques
3. **Onglet téléchargements** → Données visibles

## 🎯 RÉSULTAT ATTENDU

Après avoir créé les tables :
- ✅ Popup fonctionne
- ✅ Données enregistrées
- ✅ Message de succès affiché
- ✅ Statistiques mises à jour
- ✅ Admin dashboard complet

Le système sera alors 100% fonctionnel en production ! 🚀