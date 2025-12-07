# 🔄 Système de Flux Automatique d'Opportunités

## 🎯 Objectif
Créer un système qui récupère automatiquement les offres d'emploi IT depuis Google et les affiche sur le blog avec rotation automatique (3 plus récentes).

## 📋 Fonctionnalités

### 1️⃣ Affichage Frontend
- ✅ Afficher toutes les opportunités disponibles
- ✅ Design inchangé, juste plus d'opportunités visibles
- ✅ Tri par date de création (plus récentes en premier)

### 2️⃣ Système de Flux Automatique
- 🔄 Récupération automatique depuis Google Jobs API
- 🔄 Stockage en base de données
- 🔄 Rotation automatique (garde les 3 plus récentes)
- 🔄 Nettoyage automatique des anciennes

### 3️⃣ Contrôle Admin
- ✅ Bouton "Actualiser les opportunités"
- ✅ Configuration de la fréquence de mise à jour
- ✅ Prévisualisation avant publication
- ✅ Possibilité de désactiver/activer des opportunités

## 🛠️ Implémentation

### Étape 1 : Modifier l'affichage (IMMÉDIAT)
```javascript
// Supprimer toute limitation d'affichage
// Afficher toutes les opportunités de la base
```

### Étape 2 : API de récupération d'opportunités
```javascript
// Route backend pour récupérer depuis Google
app.post('/api/admin/sync-opportunities', ...)

// Fonction de nettoyage automatique
// Garde seulement les 3 plus récentes
```

### Étape 3 : Interface admin
```javascript
// Bouton "Synchroniser les opportunités"
// Configuration des paramètres de recherche
// Prévisualisation des nouvelles opportunités
```

## 🚀 Déploiement par étapes

1. **Immédiat** : Afficher toutes les opportunités existantes
2. **Phase 2** : Système de synchronisation automatique
3. **Phase 3** : Interface admin complète

## 📝 Notes techniques

- Utilisation de l'API Google Jobs ou scraping éthique
- Stockage avec timestamp pour rotation
- Système de cache pour éviter les doublons
- Logs détaillés pour le debug