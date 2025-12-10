# 🐛 DEBUG POPUP LEAD MAGNET EN LOCAL

## ✅ CORRECTION EFFECTUÉE
- ✅ Configuration `.env` corrigée : `VITE_API_URL=http://localhost:5000`
- ✅ Frontend redémarré avec la nouvelle config

## 🧪 ÉTAPES DE TEST

### 1. Réinitialiser le popup
1. **Ouvrir** http://localhost:5173
2. **Ouvrir la console** (F12)
3. **Exécuter** :
   ```javascript
   localStorage.removeItem('leadMagnetSeen')
   location.reload()
   ```

### 2. Déclencher le popup
- **Attendre 10 secondes** OU
- **Scroller vers le bas** (après 300px)

### 3. Tester le formulaire
1. **Choisir "Via Email"**
2. **Remplir** :
   - Prénom: Test
   - Nom: Local
   - Email: test-local@example.com
3. **Cliquer "Recevoir le Guide"**
4. **Observer** :
   - Bouton devient "Envoi..."
   - Message de succès doit s'afficher

## 🔍 VÉRIFICATIONS

### Console navigateur :
- Pas d'erreurs CORS
- Requête POST vers `http://localhost:5000/api/leads`
- Réponse 200 avec `{success: true, pdfSent: true}`

### Logs serveur backend :
```bash
# Vérifier les logs du processId 5
```

### Base de données :
```sql
SELECT * FROM leads ORDER BY created_at DESC LIMIT 3;
SELECT * FROM pdf_downloads ORDER BY download_date DESC LIMIT 3;
```

## 🚨 SI LE POPUP NE S'AFFICHE PAS

### Forcer l'affichage :
```javascript
// Dans la console navigateur
window.dispatchEvent(new Event('scroll'))
// OU
setTimeout(() => {
  // Déclencher manuellement après 1 seconde
}, 1000)
```

### Vérifier le composant :
- Le popup est-il présent dans le DOM ?
- Y a-t-il des erreurs JavaScript ?

## 🎯 RÉSULTAT ATTENDU

Si tout fonctionne :
1. ✅ Popup s'affiche après 10s ou au scroll
2. ✅ Formulaire se remplit et s'envoie
3. ✅ Message de succès : "🎉 Parfait ! Votre guide PDF a été envoyé par email..."
4. ✅ Popup se ferme automatiquement après 5s
5. ✅ Données enregistrées en base

## 🔧 COMMANDES UTILES

```bash
# Vérifier les processus
# Backend: ProcessId 5 sur port 5000
# Frontend: ProcessId 6 sur port 5173

# Tester l'API directement
Invoke-RestMethod -Uri "http://localhost:5000/api/leads" -Method POST -ContentType "application/json" -Body '{"prenom":"Debug","nom":"Test","email":"debug@test.com","preference":"email","source":"livre-gratuit"}'

# Redémarrer si nécessaire
# Frontend: Ctrl+C puis npm run dev
# Backend: Ctrl+C puis npm run dev (dans server/)
```