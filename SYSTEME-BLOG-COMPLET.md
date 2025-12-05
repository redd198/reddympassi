# 📝 Système Blog Complet + Opportunités IT

## ✅ Ce qui a été fait

### Backend
- ✅ Fix newsletter BlogPage (URL API avec variable d'environnement)
- ✅ Routes CRUD complètes pour articles de blog
- ✅ Routes CRUD complètes pour opportunités d'emploi IT
- ✅ Newsletter avec support Email ET WhatsApp
- ✅ Fichiers de migration SQL (MySQL et PostgreSQL)

### Tables créées
1. **blog_articles** : Gestion des articles de blog
2. **opportunites_emploi** : Offres d'emploi IT
3. **newsletter** (modifiée) : Ajout colonnes `whatsapp` et `type`

---

## 🚀 Prochaines étapes à implémenter

### 1. Exécuter les migrations SQL
```bash
# Sur Render ou votre serveur, exécutez le fichier SQL approprié :
# - server/migrations-blog.sql (pour MySQL)
# - server/migrations-blog-postgres.sql (pour PostgreSQL)
```

### 2. Ajouter les onglets dans le Dashboard Admin
- Onglet "Blog" pour gérer les articles
- Onglet "Opportunités IT" pour gérer les offres d'emploi
- Formulaires de création/modification
- Liste avec boutons Publier/Dépublier/Supprimer

### 3. Modifier la page Blog (Frontend)
- Charger les articles depuis l'API au lieu du tableau statique
- Ajouter choix Email OU WhatsApp dans le formulaire newsletter
- Créer une page dédiée pour chaque article

### 4. Créer la page Opportunités IT
- Nouvelle page `/opportunites-emploi`
- Liste des offres avec filtres (type, localisation)
- Formulaire d'abonnement WhatsApp pour les alertes emploi
- Lien vers le groupe WhatsApp

### 5. Système de notifications (optionnel mais recommandé)
- Quand un article est publié → Notifier les abonnés newsletter
- Quand une opportunité est publiée → Notifier les abonnés emploi
- Via WhatsApp API ou Email

---

## 📋 Structure des données

### Table `blog_articles`
```sql
- id
- title (titre de l'article)
- excerpt (résumé court)
- content (contenu complet HTML/Markdown)
- category (Tendances, Innovation, Conseils, etc.)
- image (URL de l'image)
- read_time (temps de lecture)
- published (true/false)
- created_at
- updated_at
```

### Table `opportunites_emploi`
```sql
- id
- title (titre du poste)
- company (entreprise)
- location (lieu : Congo, International, Remote)
- type (CDI, CDD, Stage, Freelance)
- description (description complète)
- requirements (compétences requises)
- salary (salaire optionnel)
- link (lien candidature)
- published (true/false)
- created_at
- updated_at
```

### Table `newsletter` (modifiée)
```sql
- id
- email (optionnel si WhatsApp)
- whatsapp (optionnel si Email)
- type ('email', 'whatsapp', 'emploi')
- created_at
```

---

## 🎯 Routes API disponibles

### Public
- `GET /api/blog/articles` - Liste des articles publiés
- `GET /api/emploi/opportunites` - Liste des opportunités publiées
- `POST /api/newsletter` - Inscription newsletter (email, whatsapp, type)

### Admin (nécessite authentification)
**Blog:**
- `GET /api/admin/blog/articles` - Tous les articles
- `POST /api/admin/blog/articles` - Créer un article
- `PUT /api/admin/blog/articles/:id` - Modifier un article
- `DELETE /api/admin/blog/articles/:id` - Supprimer un article

**Opportunités:**
- `GET /api/admin/emploi/opportunites` - Toutes les opportunités
- `POST /api/admin/emploi/opportunites` - Créer une opportunité
- `PUT /api/admin/emploi/opportunites/:id` - Modifier une opportunité
- `DELETE /api/admin/emploi/opportunites/:id` - Supprimer une opportunité

---

## 💡 Fonctionnalités à venir

1. **Dashboard Admin Blog**
   - Interface de gestion des articles
   - Éditeur de texte riche (TinyMCE ou similaire)
   - Upload d'images
   - Prévisualisation avant publication

2. **Dashboard Admin Opportunités**
   - Formulaire de création d'offres
   - Gestion des catégories (Dev, Data, Cybersécurité, etc.)
   - Statistiques des vues

3. **Page Blog améliorée**
   - Articles dynamiques depuis la base de données
   - Pagination
   - Recherche et filtres par catégorie
   - Page détail pour chaque article

4. **Page Opportunités IT**
   - Liste des offres avec filtres
   - Bouton "Postuler" vers lien externe
   - Abonnement WhatsApp pour alertes
   - Lien vers groupe WhatsApp communautaire

5. **Système de notifications**
   - Email automatique aux abonnés lors de nouveau contenu
   - Message WhatsApp aux abonnés (via API WhatsApp Business)
   - Template de messages personnalisables

---

## 🔧 Commandes utiles

### Tester les routes
```bash
# Créer un article (nécessite token admin)
curl -X POST http://localhost:5000/api/admin/blog/articles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon premier article",
    "excerpt": "Résumé de l'article",
    "content": "Contenu complet...",
    "category": "Innovation",
    "published": true
  }'

# S'abonner à la newsletter WhatsApp
curl -X POST http://localhost:5000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "whatsapp": "+242123456789",
    "type": "whatsapp"
  }'
```

---

## 📝 Notes importantes

1. **Migration SQL** : À exécuter AVANT d'utiliser les nouvelles fonctionnalités
2. **Images** : Prévoir un système d'upload ou utiliser des URLs externes
3. **WhatsApp** : Pour les notifications automatiques, il faudra intégrer l'API WhatsApp Business
4. **Sécurité** : Toutes les routes admin sont protégées par authentification JWT

---

Prêt à continuer avec l'implémentation du Dashboard Admin ?
