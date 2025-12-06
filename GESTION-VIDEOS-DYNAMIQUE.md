# 🎥 Gestion Dynamique des Vidéos Mises en Avant

## ✅ Ce qui a été implémenté

### 1. Base de Données
- ✅ Table `featured_videos` créée (MySQL + PostgreSQL)
- ✅ Scripts de migration disponibles
- ✅ Vidéo par défaut insérée

### 2. Backend API
- ✅ `GET /api/featured-video` - Récupérer la vidéo publiée (public)
- ✅ `GET /api/admin/featured-videos` - Liste toutes les vidéos (admin)
- ✅ `POST /api/admin/featured-videos` - Créer une vidéo (admin)
- ✅ `PUT /api/admin/featured-videos/:id` - Modifier une vidéo (admin)
- ✅ `DELETE /api/admin/featured-videos/:id` - Supprimer une vidéo (admin)
- ✅ `GET /api/admin/migrate-featured-videos` - Migration automatique

### 3. Frontend Blog
- ✅ Chargement dynamique de la vidéo depuis l'API
- ✅ Affichage conditionnel (si vidéo publiée)
- ✅ Utilisation des données de la base de données

## 🔧 Ce qu'il reste à faire

### Interface Admin (À implémenter)

Ajouter dans `src/components/AdminDashboard.jsx` :

1. **Ajouter l'onglet "Vidéos" dans le menu**
2. **Créer les états pour les vidéos**
3. **Charger les vidéos dans fetchData()**
4. **Créer l'interface de gestion**

## 📊 Structure de la Table

```sql
CREATE TABLE featured_videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  thumbnail VARCHAR(500),
  video_url VARCHAR(500) NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Migration de la Base de Données

### Étape 1 : Créer la table
Aller sur : https://reddympassi.site/admin

Puis dans la console du navigateur (F12), exécuter :
```javascript
fetch('https://reddympassi.site/api/admin/migrate-featured-videos', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
  }
})
.then(r => r.json())
.then(console.log)
```

Ou utiliser l'URL directement dans le navigateur (une fois connecté à l'admin).

## 📝 Utilisation Actuelle

### Pour le moment (sans interface admin)

La vidéo par défaut est déjà insérée dans la base de données :
- Titre : "L'Afrique accélère son inclusion à l'intelligence artificielle"
- Description : "Découvrez comment l'Afrique s'approprie l'IA..."
- URL : https://www.youtube.com/watch?v=YSVi4X10OUY
- Statut : Publié

### Pour modifier la vidéo (temporairement via SQL)

Vous pouvez modifier directement dans la base de données :
```sql
UPDATE featured_videos 
SET 
  title = 'Nouveau titre',
  description = 'Nouvelle description',
  video_url = 'https://www.youtube.com/watch?v=XXXXX',
  thumbnail = '/blog/nouvelle-image.jpg'
WHERE id = 1;
```

## 🎯 Prochaine Étape : Interface Admin Complète

Pour avoir une interface admin complète, il faudrait ajouter dans `AdminDashboard.jsx` :

### 1. États
```javascript
const [videos, setVideos] = useState([])
const [showVideoModal, setShowVideoModal] = useState(false)
const [editingVideo, setEditingVideo] = useState(null)
const [videoForm, setVideoForm] = useState({
  title: '',
  description: '',
  thumbnail: '',
  video_url: '',
  published: false
})
```

### 2. Menu Item
```javascript
{ id: 'videos', label: 'Vidéos', icon: FaPlay }
```

### 3. Fetch Videos
```javascript
const videosRes = await fetch(`${API_URL}/api/admin/featured-videos`, { headers })
setVideos(await videosRes.json())
```

### 4. Interface de Gestion
- Liste des vidéos avec statut (Publié/Brouillon)
- Bouton "+ Nouvelle vidéo"
- Modal de création/édition
- Boutons Modifier/Supprimer

## 💡 Avantages de cette Implémentation

✅ **Dynamique** : Plus besoin de modifier le code pour changer la vidéo
✅ **Flexible** : Possibilité d'avoir plusieurs vidéos en brouillon
✅ **Contrôlé** : Une seule vidéo publiée à la fois
✅ **Professionnel** : Gestion centralisée depuis l'admin

## 🧪 Test

### Vérifier que la vidéo s'affiche
1. Aller sur https://reddympassi.site/blog
2. La section "Actualité en vidéo" devrait s'afficher
3. Cliquer sur "Regarder la vidéo" pour ouvrir YouTube

### Vérifier l'API
```bash
curl https://reddympassi.site/api/featured-video
```

Devrait retourner :
```json
{
  "id": 1,
  "title": "L'Afrique accélère son inclusion à l'intelligence artificielle",
  "description": "...",
  "thumbnail": "/blog/video-ia-afrique.jpg",
  "video_url": "https://www.youtube.com/watch?v=YSVi4X10OUY",
  "published": true,
  "created_at": "2024-12-06...",
  "updated_at": "2024-12-06..."
}
```

## 📦 Déploiement

```bash
git add server/server.js src/components/BlogPage.jsx server/migrations-featured-video*.sql
git commit -m "feat: gestion dynamique vidéos mises en avant (backend + frontend)"
git push origin main
```

## 🔜 Pour Activer l'Interface Admin

Si vous voulez que je crée l'interface admin complète pour gérer les vidéos depuis le backoffice, dites-le moi et je l'implémenterai. Cela ajoutera :
- Un onglet "Vidéos" dans le menu admin
- Une liste de toutes les vidéos
- Un formulaire de création/édition
- La possibilité de publier/dépublier
- La suppression de vidéos

Pour l'instant, la vidéo est dynamique et chargée depuis la base de données, mais la gestion se fait via SQL direct.
