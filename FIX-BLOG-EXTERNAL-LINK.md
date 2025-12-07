# 🔧 Fix Blog - Liens Externes

## ✅ Problème résolu

Le backend gère maintenant automatiquement l'absence de la colonne `external_link`.

## 📋 Étapes de test

### 1️⃣ Déployer le backend

```bash
git add server/server.js
git commit -m "fix: gestion automatique colonne external_link"
git push
```

### 2️⃣ Tester la création d'article (sans migration)

1. Aller sur https://reddympassi.site/admin
2. Cliquer sur "Blog" → "+ Nouvel article"
3. Remplir :
   - Titre : Test Article
   - Catégorie : Innovation
   - Résumé : Test
   - Contenu : Test
   - ☑ Publier
4. Cliquer "Créer"

**Résultat attendu** : ✅ Article créé sans erreur (le champ external_link est ignoré)

### 3️⃣ Exécuter la migration

Dans la console (F12) :

```javascript
fetch('https://reddympassi.site/api/admin/migrate-blog-external-link', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
}).then(r => r.json()).then(console.log)
```

**Résultat attendu** : `{ success: true, message: "Colonne external_link ajoutée" }`

### 4️⃣ Créer un article de curation

1. Cliquer sur "Blog" → "+ Nouvel article"
2. Remplir :
   - Titre : L'IA Transforme l'Afrique
   - Catégorie : Innovation
   - Résumé : Découvrez comment l'intelligence artificielle révolutionne le continent africain
   - Contenu : (Laisser vide ou mettre un court résumé)
   - URL Image : https://images.unsplash.com/photo-1677442136019-21780ecad995
   - Temps : 5 min
   - **Lien externe** : https://www.bbc.com/afrique/articles/ia-afrique
   - ☑ Publier
3. Cliquer "Créer"

### 5️⃣ Vérifier sur le blog

1. Aller sur https://reddympassi.site/blog
2. Trouver l'article "L'IA Transforme l'Afrique"
3. Cliquer sur "Lire l'article"

**Résultat attendu** : 🎉 Redirection vers BBC

## 🎯 Avantages

- ✅ Pas d'erreur si la migration n'est pas faite
- ✅ Fonctionne avec ou sans la colonne external_link
- ✅ Logs clairs pour le debug
- ✅ Gestion automatique des erreurs

## 📝 Notes

Le système détecte automatiquement si la colonne existe :
- **Sans colonne** : Crée l'article normalement (ignore external_link)
- **Avec colonne** : Crée l'article avec le lien externe

Pas besoin de redéployer après la migration !
