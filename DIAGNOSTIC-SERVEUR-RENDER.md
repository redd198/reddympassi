# 🚨 DIAGNOSTIC SERVEUR RENDER - URGENCE

## 🎯 PROBLÈME DÉTECTÉ
```
POST https://reddympassi-api.onrender.com/api/reservations 
net::ERR_INTERNET_DISCONNECTED
```

## 🔍 VÉRIFICATIONS IMMÉDIATES

### 1. Vérifier l'état du service
1. Aller sur [Render Dashboard](https://dashboard.render.com)
2. Chercher ton service backend `reddympassi-api`
3. Vérifier le statut :
   - 🟢 **Live** = Service actif
   - 🟡 **Building** = En cours de déploiement
   - 🔴 **Failed** = Service crashé
   - ⚪ **Sleeping** = Service endormi (plan gratuit)

### 2. Réveiller le service (si endormi)
```bash
# Tester l'URL directement
curl https://reddympassi-api.onrender.com/health
```

Ou ouvrir dans le navigateur :
```
https://reddympassi-api.onrender.com/health
```

### 3. Vérifier les logs
1. Dans Render Dashboard
2. Cliquer sur ton service backend
3. Aller dans l'onglet "Logs"
4. Chercher les erreurs récentes

## 🚀 SOLUTIONS RAPIDES

### Solution 1: Redémarrer le service
1. Dans Render Dashboard
2. Cliquer sur "Manual Deploy" → "Deploy latest commit"
3. Attendre 2-3 minutes

### Solution 2: Vérifier les variables d'environnement
- `DATABASE_URL` doit pointer vers Supabase
- `PORT` doit être défini
- `NODE_ENV=production`

### Solution 3: Forcer le réveil
```bash
# Faire plusieurs requêtes pour réveiller
curl https://reddympassi-api.onrender.com/
curl https://reddympassi-api.onrender.com/api/health
curl https://reddympassi-api.onrender.com/api/leads
```

## 📋 CHECKLIST DE VÉRIFICATION

- [ ] Service Render actif (statut Live)
- [ ] Logs sans erreurs critiques
- [ ] Variables d'environnement correctes
- [ ] DATABASE_URL pointe vers Supabase
- [ ] Dernier déploiement réussi

## 🎯 TEST RAPIDE

Une fois le service réveillé, tester :
```
https://reddympassi-api.onrender.com/api/reservations
```

Devrait retourner une liste (même vide) au lieu d'une erreur de connexion.

## ⚡ ACTION IMMÉDIATE

1. **Vérifier le statut** sur Render Dashboard
2. **Redéployer** si nécessaire
3. **Attendre 3 minutes** que le service soit actif
4. **Retester** le formulaire de réservation