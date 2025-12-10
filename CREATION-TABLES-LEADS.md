# 🚀 CRÉATION DES TABLES POUR LE SYSTÈME DE TÉLÉCHARGEMENT PDF

## ❌ PROBLÈME IDENTIFIÉ
Le bouton "Recevoir le Guide" ne fonctionne pas car les tables `leads` et `pdf_downloads` n'existent pas dans la base de données.

## ✅ SOLUTION RAPIDE

### 1. Exécuter les migrations automatiquement
```bash
cd server
node run-migrations-leads.js
```

### 2. OU exécuter manuellement dans votre base de données

#### Pour PostgreSQL (Render/Supabase) :
```sql
-- Copier et exécuter le contenu de server/migrations-leads-postgres.sql
```

#### Pour MySQL (local) :
```sql
-- Copier et exécuter le contenu de server/migrations-leads.sql
```

## 📊 TABLES CRÉÉES

### Table `leads`
- **id** : Identifiant unique
- **prenom** : Prénom (obligatoire)
- **nom** : Nom de famille
- **telephone** : Numéro de téléphone
- **email** : Adresse email
- **whatsapp** : Numéro WhatsApp
- **preference** : 'email' ou 'whatsapp'
- **source** : 'livre-gratuit', 'newsletter', etc.
- **produit** : Nom du produit/livre
- **created_at** : Date de création
- **updated_at** : Date de mise à jour

### Table `pdf_downloads`
- **id** : Identifiant unique
- **lead_id** : Référence vers la table leads
- **nom** : Nom complet
- **email** : Email de contact
- **telephone** : Téléphone
- **livre** : Nom du livre téléchargé
- **ip_address** : Adresse IP
- **user_agent** : Navigateur utilisé
- **source** : Source du téléchargement
- **email_sent** : Email envoyé (true/false)
- **download_date** : Date du téléchargement

## 🔧 VÉRIFICATION

Après avoir exécuté les migrations, testez :

1. **Ouvrir le site** et déclencher le popup lead magnet
2. **Choisir un mode** (Email ou WhatsApp)
3. **Remplir le formulaire** avec des données de test
4. **Cliquer "Recevoir le Guide"**
5. **Vérifier** que le message de succès s'affiche

## 📈 ADMIN DASHBOARD

Une fois les tables créées, l'admin dashboard affichera :
- ✅ Statistiques des téléchargements
- ✅ Liste des leads
- ✅ Onglet "Téléchargements" fonctionnel

## 🚨 EN CAS DE PROBLÈME

Si les migrations échouent :

1. **Vérifier la connexion** à la base de données
2. **Vérifier les variables d'environnement** (.env)
3. **Exécuter manuellement** les requêtes SQL
4. **Consulter les logs** du serveur pour plus de détails

## 📝 COMMANDES UTILES

```bash
# Démarrer le serveur en mode développement
npm run dev

# Vérifier les logs du serveur
# Regarder la console pour les messages d'erreur

# Tester l'API directement
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"prenom":"Test","nom":"User","email":"test@example.com","preference":"email","source":"livre-gratuit"}'
```

## ✨ RÉSULTAT ATTENDU

Après la création des tables :
- 🎯 Le bouton "Recevoir le Guide" fonctionne
- 📧 Les emails PDF sont envoyés automatiquement
- 📱 Les notifications WhatsApp sont loggées
- 📊 Les statistiques s'affichent dans l'admin
- 🗃️ Tous les téléchargements sont trackés