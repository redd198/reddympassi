# 🎯 Améliorations Dashboard Admin - À implémenter

## ✅ Déjà fait

1. **Empêcher les doublons**
   - ✅ Réservations : Un email ne peut avoir qu'une réservation en attente
   - ✅ Commandes : Un email ne peut commander le même livre qu'une fois
   - ✅ Messages d'erreur professionnels

## 🔄 À faire maintenant

### 1. Retirer le bouton "Email" du modal de validation

**Fichier :** `src/components/AdminDashboard.jsx`

**Changement :** Garder uniquement WhatsApp, retirer le choix Email

### 2. Ajouter boutons de suppression

**Pour chaque table (Leads, Réservations, Commandes, Visiteurs) :**
- Bouton "Supprimer" sur chaque ligne
- Modal de confirmation : "Confirmer la suppression ?"
- Message : "Cette action est irréversible. Voulez-vous vraiment supprimer cet enregistrement ?"

### 3. Routes backend de suppression

**À ajouter dans `server/server.js` :**

```javascript
// Supprimer un lead
app.delete('/api/admin/leads/:id', authenticateToken, async (req, res) => {
  // Code de suppression
})

// Supprimer une réservation
app.delete('/api/admin/reservations/:id', authenticateToken, async (req, res) => {
  // Code de suppression
})

// Supprimer une commande
app.delete('/api/admin/commandes/:id', authenticateToken, async (req, res) => {
  // Code de suppression
})

// Supprimer un visiteur
app.delete('/api/admin/visitors/:id', authenticateToken, async (req, res) => {
  // Code de suppression
})
```

## 📋 Prochaines étapes

1. Modifier le modal de validation (retirer Email)
2. Ajouter les routes de suppression au backend
3. Ajouter les boutons de suppression dans le dashboard
4. Ajouter les modals de confirmation
5. Tester toutes les fonctionnalités

## 🎨 Design des boutons

**Bouton Supprimer :**
- Couleur : Rouge
- Icône : Poubelle (FaTrash)
- Texte : "Supprimer"

**Modal de confirmation :**
- Titre : "Confirmer la suppression"
- Message : "Cette action est irréversible. Voulez-vous vraiment supprimer cet enregistrement ?"
- Boutons : "Annuler" (gris) | "Supprimer" (rouge)

Voulez-vous que je continue avec ces implémentations ?
