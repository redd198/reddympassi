# 🚨 SOLUTION RAPIDE - POPUP LEAD MAGNET

## ❌ PROBLÈME ACTUEL
- Le popup ne fonctionne pas en local
- Erreur `net::ERR_INTERNET_DISCONNECTED`
- Les serveurs semblent fonctionner mais ne communiquent pas

## ✅ SOLUTION IMMÉDIATE

### 1. Redémarrer TOUT manuellement

**Dans ton terminal :**

```bash
# 1. Arrêter tous les processus
# Ctrl+C dans tous les terminaux ouverts

# 2. Démarrer le backend
cd server
npm run dev

# 3. Dans un NOUVEAU terminal, démarrer le frontend
cd ..
npm run dev

# 4. Tester sur http://localhost:5173
```

### 2. Si ça ne marche toujours pas

**Modifier temporairement le popup pour pointer vers la production :**

Dans `.env` :
```env
VITE_API_URL=https://reddympassi-api.onrender.com
```

Puis redémarrer le frontend :
```bash
npm run dev
```

### 3. Test rapide du popup

1. **Ouvrir** http://localhost:5173
2. **Console navigateur** (F12) et taper :
   ```javascript
   localStorage.removeItem('leadMagnetSeen')
   location.reload()
   ```
3. **Attendre 10 secondes** ou scroller
4. **Tester le formulaire**

## 🎯 RÉSULTAT ATTENDU

Si tu utilises l'API de production, le popup devrait fonctionner immédiatement car :
- ✅ L'API de production fonctionne
- ✅ Les tables existent en production
- ✅ Pas de problème de CORS ou de réseau local

## 🔧 POUR DÉBUGGER EN LOCAL PLUS TARD

1. **Vérifier les ports** :
   ```bash
   netstat -an | findstr :5000
   netstat -an | findstr :5173
   ```

2. **Tester l'API directement** :
   ```bash
   curl http://localhost:5000/api/leads -X POST -H "Content-Type: application/json" -d "{\"prenom\":\"Test\",\"nom\":\"User\",\"email\":\"test@test.com\",\"preference\":\"email\",\"source\":\"livre-gratuit\"}"
   ```

3. **Vérifier les logs** des deux serveurs

## 💡 CONSEIL

Pour l'instant, utilise l'API de production pour que le popup fonctionne. On pourra débugger le problème local plus tard si nécessaire.

L'important c'est que ton système fonctionne ! 🚀