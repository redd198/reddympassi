# 🎨 Modifications UI Dashboard - Plan complet

## ✅ Déjà fait

1. Routes backend de suppression (DELETE)
2. Fonction handleDelete dans le dashboard
3. Import FaTrash
4. Auto-refresh toutes les 30 secondes

## 🔄 À faire maintenant

### 1. Modifier l'affichage des Visiteurs

**Remplacer les colonnes :**
```
Avant: Pays | Ville | Page | Date
Après: Jour | Mois | Année | Heure | Page
```

**Exemple :**
```
Jour  | Mois     | Année | Heure    | Page      | Actions
04    | Décembre | 2025  | 20:03:22 | /         | [Supprimer]
04    | Décembre | 2025  | 20:05:15 | /livres   | [Supprimer]
```

### 2. Retirer le bouton Email du modal

Dans le modal de validation, garder uniquement WhatsApp.

### 3. Ajouter boutons de suppression

**Pour chaque table :**
- Leads
- Réservations  
- Commandes
- Visiteurs

**Bouton :**
- Icône: FaTrash
- Couleur: Rouge
- Texte: "Supprimer"

### 4. Activer la newsletter

Ajouter un onglet "Newsletter" dans le dashboard.

## 📋 Modifications détaillées

Je vais créer un fichier AdminDashboard complet optimisé avec toutes ces modifications.

Voulez-vous que je continue ?
