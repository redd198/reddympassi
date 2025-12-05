# 🚀 Guide Migration Blog & Opportunités IT

## Étape 1 : Exécuter les migrations SQL

### Option A : Via Render Dashboard (PostgreSQL)
1. Connectez-vous à Render.com
2. Allez dans votre service PostgreSQL
3. Cliquez sur "Connect" → "External Connection"
4. Utilisez un client SQL (DBeaver, pgAdmin, ou psql)
5. Copiez-collez le contenu de `server/migrations-blog-postgres.sql`
6. Exécutez le script

### Option B : Via ligne de commande (PostgreSQL)
```bash
# Depuis votre machine locale
psql YOUR_DATABASE_URL < server/migrations-blog-postgres.sql
```

### Option C : Via MySQL Workbench (MySQL)
1. Ouvrez MySQL Workbench
2. Connectez-vous à votre base de données
3. Ouvrez le fichier `server/migrations-blog.sql`
4. Exécutez le script

---

## Étape 2 : Vérifier que les tables sont créées

```sql
-- Vérifier les tables
SHOW TABLES; -- MySQL
\dt -- PostgreSQL

-- Vérifier la structure de blog_articles
DESCRIBE blog_articles; -- MySQL
\d blog_articles -- PostgreSQL

-- Vérifier la structure de opportunites_emploi
DESCRIBE opportunites_emploi; -- MySQL
\d opportunites_emploi -- PostgreSQL

-- Vérifier que newsletter a les nouvelles colonnes
DESCRIBE newsletter; -- MySQL
\d newsletter -- PostgreSQL
```

---

## Étape 3 : Tester les routes API

### Test 1 : Créer un article de blog
```bash
# D'abord, connectez-vous en tant qu'admin pour obtenir le token
curl -X POST https://votre-backend.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "votre_mot_de_passe"}'

# Utilisez le token reçu pour créer un article
curl -X POST https://votre-backend.onrender.com/api/admin/blog/articles \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "excerpt": "Ceci est un test",
    "content": "Contenu complet de l article de test",
    "category": "Innovation",
    "image": "/blog/test.jpg",
    "readTime": "3 min",
    "published": true
  }'
```

### Test 2 : Récupérer les articles (public)
```bash
curl https://votre-backend.onrender.com/api/blog/articles
```

### Test 3 : S'abonner à la newsletter WhatsApp
```bash
curl -X POST https://votre-backend.onrender.com/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "whatsapp": "+242123456789",
    "type": "whatsapp"
  }'
```

### Test 4 : Créer une opportunité d'emploi
```bash
curl -X POST https://votre-backend.onrender.com/api/admin/emploi/opportunites \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Développeur Full Stack",
    "company": "Tech Congo",
    "location": "Brazzaville, Congo",
    "type": "CDI",
    "description": "Nous recherchons un développeur Full Stack expérimenté...",
    "requirements": "React, Node.js, PostgreSQL",
    "salary": "À négocier",
    "link": "https://example.com/apply",
    "published": true
  }'
```

---

## Étape 4 : Vérifier dans le Dashboard Admin

1. Connectez-vous au dashboard admin
2. Les nouveaux onglets "Blog" et "Opportunités IT" apparaîtront (à implémenter)
3. Vous pourrez gérer les articles et opportunités

---

## ⚠️ Problèmes courants

### Erreur : "Table already exists"
✅ Normal si vous réexécutez le script. Les `IF NOT EXISTS` empêchent les erreurs.

### Erreur : "Column already exists"
✅ Normal si la colonne existe déjà. Vous pouvez ignorer.

### Erreur : "Unknown column 'whatsapp' in newsletter"
❌ La migration n'a pas été exécutée. Relancez le script SQL.

### Les articles ne s'affichent pas
1. Vérifiez que `published = true`
2. Vérifiez l'URL de l'API dans le frontend
3. Regardez la console du navigateur pour les erreurs

---

## 📊 Données de test

Voici quelques données de test à insérer :

```sql
-- Article de test
INSERT INTO blog_articles (title, excerpt, content, category, image, read_time, published)
VALUES (
  'L''avenir de l''IA en Afrique',
  'Découvrez comment l''intelligence artificielle transforme le continent africain',
  '<p>L''intelligence artificielle est en train de révolutionner l''Afrique...</p>',
  'Innovation',
  '/blog/ia-afrique.jpg',
  '5 min',
  true
);

-- Opportunité de test
INSERT INTO opportunites_emploi (title, company, location, type, description, requirements, published)
VALUES (
  'Développeur React Senior',
  'StartupCongo',
  'Brazzaville, Congo',
  'CDI',
  'Nous recherchons un développeur React expérimenté pour rejoindre notre équipe dynamique.',
  'React, TypeScript, Node.js, 3+ ans d''expérience',
  true
);

-- Abonnement newsletter test
INSERT INTO newsletter (email, type)
VALUES ('test@example.com', 'email');

INSERT INTO newsletter (whatsapp, type)
VALUES ('+242123456789', 'whatsapp');

INSERT INTO newsletter (whatsapp, type)
VALUES ('+242987654321', 'emploi');
```

---

## ✅ Checklist de migration

- [ ] Migrations SQL exécutées
- [ ] Tables créées (blog_articles, opportunites_emploi)
- [ ] Table newsletter modifiée (colonnes whatsapp et type)
- [ ] Test création d'article réussi
- [ ] Test récupération articles réussi
- [ ] Test inscription newsletter WhatsApp réussi
- [ ] Backend redéployé sur Render
- [ ] Données de test insérées

---

Une fois ces étapes terminées, vous êtes prêt à implémenter l'interface admin et les pages frontend !
