# 🎯 TEST FINAL EN LOCAL - POPUP LEAD MAGNET

## ✅ CONFIGURATION ACTUELLE
- ✅ **Backend simple** : http://localhost:5000 (ProcessId: 2)
- ✅ **Frontend Vite** : http://localhost:5173 (ProcessId: 4)
- ✅ **API testée** : Fonctionne parfaitement
- ✅ **Configuration** : `.env` pointe vers localhost

## 🧪 ÉTAPES DE TEST

### 1. **Ouvrir le site**
- Va sur http://localhost:5173

### 2. **Réinitialiser le popup**
- Ouvre la console (F12)
- Tape : `localStorage.removeItem('leadMagnetSeen')`
- Tape : `location.reload()`

### 3. **Déclencher le popup**
- **Attendre 10 secondes** OU
- **Scroller vers le bas**

### 4. **Tester le formulaire**

#### Test Email :
1. Choisir "Via Email"
2. Remplir :
   - Prénom: Test
   - Nom: Local
   - Email: test@local.com
3. Cliquer "Recevoir le Guide"

#### Test WhatsApp :
1. Choisir "Via WhatsApp"
2. Remplir :
   - Prénom: Test
   - Nom: WhatsApp
   - WhatsApp: +242123456789
3. Cliquer "Recevoir le Guide"

## 📊 RÉSULTATS ATTENDUS

### Dans la console navigateur :
```
🚀 Envoi du formulaire lead magnet...
📊 Données: {prenom: "Test", nom: "Local", ...}
🌐 URL API: http://localhost:5000
🔗 URL finale utilisée: http://localhost:5000
📥 Réponse serveur: {success: true, pdfSent: true, ...}
✅ Status: 201 true
```

### Message de succès :
- **Email** : "🎉 Parfait ! Votre guide PDF a été envoyé par email..."
- **WhatsApp** : "🎉 Parfait ! Votre inscription est confirmée. Vous recevrez bientôt le lien..."

### Dans les logs serveur :
```
📥 Lead reçu: { prenom: 'Test', nom: 'Local', ... }
✅ Lead enregistré: Test Local (email)
```

## 🎉 SI ÇA MARCHE

Tu verras :
1. ✅ Le popup s'affiche
2. ✅ Le formulaire s'envoie
3. ✅ Le message de succès apparaît
4. ✅ Les logs serveur confirment la réception
5. ✅ Le popup se ferme automatiquement après 5s

## 🚨 SI ÇA NE MARCHE PAS

Vérifie dans la console navigateur :
- Erreurs JavaScript ?
- Requête bloquée ?
- URL correcte ?

## 🔧 COMMANDES UTILES

```bash
# Redémarrer le backend si nécessaire
# Dans server/
node test-server-simple.js

# Redémarrer le frontend si nécessaire
npm run dev

# Tester l'API directement
curl -X POST http://localhost:5000/api/leads -H "Content-Type: application/json" -d "{\"prenom\":\"Test\",\"nom\":\"Direct\",\"email\":\"test@direct.com\",\"preference\":\"email\",\"source\":\"livre-gratuit\"}"
```

## 🎯 OBJECTIF

Valider que le système de lead magnet fonctionne parfaitement en local avec :
- ✅ Popup qui s'affiche
- ✅ Formulaires adaptatifs (Email/WhatsApp)
- ✅ Envoi des données
- ✅ Messages de succès
- ✅ UX complète

Une fois que ça marche en local, on pourra déployer en production ! 🚀