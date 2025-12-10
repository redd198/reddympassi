# 🧪 TEST DU SYSTÈME DE TÉLÉCHARGEMENT PDF

## ✅ ÉTAPES RÉALISÉES
1. ✅ MySQL démarré (Apache + MySQL)
2. ✅ Tables `leads` et `pdf_downloads` créées
3. ✅ Serveur backend démarré sur port 5000
4. ✅ Frontend démarré sur port 5173

## 🧪 TESTS À EFFECTUER

### 1. Test du Lead Magnet Popup
1. **Ouvrir** http://localhost:5173
2. **Attendre 10 secondes** ou **scroller** pour déclencher le popup
3. **Choisir "Via Email"**
4. **Remplir** :
   - Prénom: Test
   - Nom: User
   - Email: test@example.com
5. **Cliquer "Recevoir le Guide"**
6. **Vérifier** le message de succès

### 2. Test du mode WhatsApp
1. **Déclencher** le popup à nouveau (vider localStorage si nécessaire)
2. **Choisir "Via WhatsApp"**
3. **Remplir** :
   - Prénom: Test
   - Nom: WhatsApp
   - WhatsApp: +242123456789
4. **Cliquer "Recevoir le Guide"**
5. **Vérifier** le message de succès

### 3. Test de la page de téléchargement
1. **Aller sur** http://localhost:5173/telecharger
2. **Cliquer "Télécharger le PDF"**
3. **Vérifier** que le fichier se télécharge

### 4. Test de l'admin dashboard
1. **Aller sur** http://localhost:5173/admin
2. **Se connecter** avec les identifiants admin
3. **Vérifier** :
   - Carte "Téléchargements" affiche le bon nombre
   - Onglet "Téléchargements" fonctionne
   - Données des leads visibles

## 🔍 VÉRIFICATIONS BASE DE DONNÉES

### Vérifier les leads créés :
```sql
SELECT * FROM leads ORDER BY created_at DESC LIMIT 5;
```

### Vérifier les téléchargements :
```sql
SELECT * FROM pdf_downloads ORDER BY download_date DESC LIMIT 5;
```

## 📊 RÉSULTATS ATTENDUS

### Mode Email :
- ✅ Lead enregistré dans la table `leads`
- ✅ Téléchargement enregistré dans `pdf_downloads`
- ✅ `email_sent = true`
- ✅ Message : "PDF envoyé par email"

### Mode WhatsApp :
- ✅ Lead enregistré dans la table `leads`
- ✅ Téléchargement enregistré dans `pdf_downloads`
- ✅ `email_sent = false`
- ✅ Message : "Lien de téléchargement sur WhatsApp"

## 🚨 EN CAS DE PROBLÈME

### Popup ne s'affiche pas :
```javascript
// Dans la console du navigateur
localStorage.removeItem('leadMagnetSeen')
location.reload()
```

### Erreur 500 :
- Vérifier que MySQL est démarré
- Vérifier les logs du serveur backend
- Vérifier que les tables existent

### PDF ne se télécharge pas :
- Vérifier que le fichier existe dans `public/uploads/`
- Vérifier les permissions du fichier

## 📝 LOGS À SURVEILLER

### Backend (processId: 5) :
- Messages de connexion MySQL
- Logs d'envoi PDF
- Erreurs éventuelles

### Frontend :
- Erreurs dans la console navigateur
- Requêtes réseau dans l'onglet Network

## ✨ SUCCÈS ATTENDU

Si tout fonctionne :
1. 🎯 Popup s'affiche et fonctionne
2. 📧 Emails/WhatsApp traités correctement
3. 📊 Statistiques mises à jour
4. 🗃️ Données sauvegardées en base
5. 📱 Page de téléchargement fonctionnelle