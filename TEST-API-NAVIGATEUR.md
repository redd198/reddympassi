# 🧪 TEST API DEPUIS LE NAVIGATEUR

## ❌ PROBLÈME IDENTIFIÉ
- L'API fonctionne en PowerShell ✅
- Mais échoue depuis le navigateur avec `net::ERR_INTERNET_DISCONNECTED` ❌

## 🔧 SOLUTIONS À TESTER

### 1. Test direct dans la console navigateur
Ouvre la console (F12) sur http://localhost:5173 et exécute :

```javascript
// Test 1: Vérifier la connectivité
fetch('http://localhost:5000/api/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prenom: 'TestConsole',
    nom: 'Browser',
    email: 'console@test.com',
    preference: 'email',
    source: 'livre-gratuit'
  })
})
.then(response => {
  console.log('✅ Status:', response.status)
  return response.json()
})
.then(data => {
  console.log('📥 Réponse:', data)
})
.catch(error => {
  console.error('❌ Erreur:', error)
})
```

### 2. Vérifier les variables d'environnement
Dans la console navigateur :
```javascript
console.log('🌐 VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('🔧 Mode:', import.meta.env.MODE)
console.log('🏠 Base URL:', import.meta.env.BASE_URL)
```

### 3. Test avec URL absolue
Si le test 1 échoue, essaie avec l'URL complète :
```javascript
fetch('http://127.0.0.1:5000/api/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prenom: 'Test127',
    nom: 'IP',
    email: 'ip@test.com',
    preference: 'email',
    source: 'livre-gratuit'
  })
})
.then(response => response.json())
.then(data => console.log('✅ Avec 127.0.0.1:', data))
.catch(error => console.error('❌ Erreur 127.0.0.1:', error))
```

## 🔍 DIAGNOSTICS POSSIBLES

### Problème de réseau local :
- Windows Firewall bloque la connexion
- Antivirus bloque les requêtes localhost
- Proxy ou VPN interfère

### Problème de configuration :
- Variable d'environnement pas prise en compte
- Cache navigateur
- Service Worker qui interfère

### Problème de serveur :
- Port 5000 occupé par autre chose
- Serveur pas complètement démarré

## 🛠️ SOLUTIONS DE CONTOURNEMENT

### 1. Changer de port
Dans `server/.env` :
```env
PORT=3001
```

### 2. Utiliser 127.0.0.1 au lieu de localhost
Dans `.env` :
```env
VITE_API_URL=http://127.0.0.1:5000
```

### 3. Vider le cache navigateur
- Ctrl+Shift+R (rechargement forcé)
- Ou F12 > Network > Disable cache

### 4. Tester avec un autre navigateur
- Chrome, Firefox, Edge

## 📋 CHECKLIST DE DEBUG

- [ ] Serveur backend démarré (ProcessId: 9)
- [ ] Frontend démarré (ProcessId: 6)
- [ ] Test API PowerShell ✅
- [ ] Test API console navigateur
- [ ] Variables d'environnement correctes
- [ ] Pas d'erreurs CORS
- [ ] Cache navigateur vidé

## 🎯 RÉSULTAT ATTENDU

Si tout fonctionne, dans la console navigateur tu devrais voir :
```
✅ Status: 200
📥 Réponse: {success: true, message: "Lead enregistré avec succès", id: 6, pdfSent: true}
```