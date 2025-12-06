# 🎥 Guide de Gestion des Vidéos - Admin

## ✅ Interface Admin Complète Disponible !

Vous pouvez maintenant gérer les vidéos mises en avant directement depuis le backoffice admin.

## 📍 Accès

1. Aller sur https://reddympassi.site/admin
2. Se connecter
3. Cliquer sur **"Vidéos"** dans le menu latéral

## 🎯 Fonctionnalités

### 1. Liste des Vidéos
- Voir toutes les vidéos (publiées et brouillons)
- Statut visible : ✓ Publié ou ○ Brouillon
- Lien direct vers la vidéo YouTube
- Date de création

### 2. Créer une Nouvelle Vidéo

**Étapes** :
1. Cliquer sur **"+ Nouvelle vidéo"**
2. Remplir le formulaire :
   - **Titre*** : Titre de la vidéo
   - **Description*** : Description complète
   - **URL de la vidéo*** : Lien YouTube complet
   - **URL miniature** : Chemin vers l'image (optionnel)
   - **Publier immédiatement** : Cocher pour publier

3. Cliquer sur **"Créer"**

**Exemple de formulaire** :
```
Titre: L'IA transforme l'Afrique
Description: Découvrez comment l'intelligence artificielle révolutionne...
URL vidéo: https://www.youtube.com/watch?v=ABC123
Miniature: /blog/ia-afrique.jpg
☑ Publier immédiatement
```

### 3. Modifier une Vidéo

**Étapes** :
1. Cliquer sur l'icône **crayon (✏️)** à côté de la vidéo
2. Modifier les informations
3. Cliquer sur **"Modifier"**

### 4. Supprimer une Vidéo

**Étapes** :
1. Cliquer sur l'icône **poubelle (🗑️)**
2. Confirmer la suppression

### 5. Publier/Dépublier

Pour publier une vidéo en brouillon :
1. Modifier la vidéo
2. Cocher "Publier immédiatement"
3. Sauvegarder

Pour dépublier :
1. Modifier la vidéo
2. Décocher "Publier immédiatement"
3. Sauvegarder

## ⚠️ Important

### Une Seule Vidéo Publiée
- **Seule la dernière vidéo publiée s'affiche** sur la page Blog
- Si vous publiez une nouvelle vidéo, elle remplace l'ancienne
- Les vidéos en brouillon ne sont pas visibles sur le site

### URL YouTube
- Utilisez l'URL complète : `https://www.youtube.com/watch?v=VIDEO_ID`
- Ne pas utiliser les liens raccourcis (youtu.be)

### Miniature
- Optionnel mais recommandé
- Chemin relatif : `/blog/nom-image.jpg`
- L'image doit être uploadée dans le dossier `public/blog/`

## 📊 Où S'Affiche la Vidéo ?

La vidéo publiée s'affiche sur :
- **Page Blog** : https://reddympassi.site/blog
- **Section** : "Actualité en vidéo" (en haut de la page)

## 🎨 Exemple Complet

### Créer une Vidéo sur l'IA en Afrique

1. **Aller dans Admin → Vidéos**
2. **Cliquer "+ Nouvelle vidéo"**
3. **Remplir** :
   ```
   Titre: L'Afrique accélère son inclusion à l'IA
   
   Description: Découvrez comment l'Afrique s'approprie 
   l'intelligence artificielle pour transformer son 
   économie et créer des solutions innovantes adaptées 
   aux réalités locales.
   
   URL vidéo: https://www.youtube.com/watch?v=YSVi4X10OUY
   
   Miniature: /blog/video-ia-afrique.jpg
   
   ☑ Publier immédiatement
   ```
4. **Cliquer "Créer"**
5. **Vérifier** : Aller sur https://reddympassi.site/blog

## 🔄 Workflow Recommandé

### Pour Changer la Vidéo Mise en Avant

**Option 1 : Créer une nouvelle vidéo**
1. Créer la nouvelle vidéo en brouillon
2. Vérifier le contenu
3. Publier la nouvelle vidéo
4. L'ancienne vidéo reste en base mais n'est plus affichée

**Option 2 : Modifier la vidéo existante**
1. Modifier la vidéo publiée
2. Changer le titre, description, URL
3. Sauvegarder

## 📝 Bonnes Pratiques

### Titres
- ✅ Clair et accrocheur
- ✅ Maximum 80 caractères
- ✅ Inclure le sujet principal

### Descriptions
- ✅ 2-3 phrases
- ✅ Expliquer le contenu de la vidéo
- ✅ Inclure les bénéfices pour le lecteur

### Vidéos YouTube
- ✅ Vidéos de qualité professionnelle
- ✅ Durée : 5-15 minutes idéalement
- ✅ Sous-titres disponibles si possible

### Miniatures
- ✅ Format : JPG ou PNG
- ✅ Taille : 1280x720px recommandé
- ✅ Poids : < 500KB
- ✅ Nom de fichier : descriptif (ex: `ia-afrique-2024.jpg`)

## 🧪 Test

### Vérifier que Tout Fonctionne

1. **Créer une vidéo de test**
   - Titre: "Test Vidéo"
   - URL: Une vidéo YouTube de votre choix
   - Publier

2. **Vérifier sur le site**
   - Aller sur https://reddympassi.site/blog
   - La section "Actualité en vidéo" doit s'afficher
   - Cliquer sur "Regarder la vidéo"
   - YouTube doit s'ouvrir

3. **Modifier la vidéo**
   - Changer le titre
   - Vérifier que le changement apparaît sur le site

4. **Supprimer la vidéo de test**
   - Supprimer depuis l'admin
   - La section vidéo ne doit plus s'afficher sur le blog

## 🎯 Cas d'Usage

### Promouvoir un Nouveau Contenu
```
Titre: Nouveau : Formation IA pour Entrepreneurs Africains
Description: Découvrez notre nouvelle formation...
URL: https://www.youtube.com/watch?v=...
☑ Publier
```

### Partager une Interview
```
Titre: Interview : Comment j'ai lancé ma startup tech au Congo
Description: Rencontre avec un entrepreneur qui partage...
URL: https://www.youtube.com/watch?v=...
☑ Publier
```

### Annoncer un Événement
```
Titre: Webinaire Gratuit : Les Opportunités IT en Afrique
Description: Inscrivez-vous à notre prochain webinaire...
URL: https://www.youtube.com/watch?v=...
☑ Publier
```

## 💡 Astuces

### Planifier du Contenu
- Créez plusieurs vidéos en brouillon
- Publiez-les progressivement
- Gardez un calendrier de publication

### Analyser les Performances
- Notez quelle vidéo génère le plus de clics
- Adaptez votre contenu en conséquence
- Testez différents types de titres

### Garder un Historique
- Ne supprimez pas immédiatement les anciennes vidéos
- Dépubliez-les simplement
- Vous pourrez les republier plus tard

## 🆘 Dépannage

### La vidéo ne s'affiche pas sur le blog
- ✅ Vérifier que la vidéo est bien publiée (✓ Publié)
- ✅ Rafraîchir la page blog (Ctrl+F5)
- ✅ Vérifier l'URL YouTube

### L'URL YouTube ne fonctionne pas
- ✅ Utiliser l'URL complète (pas youtu.be)
- ✅ Format : `https://www.youtube.com/watch?v=VIDEO_ID`
- ✅ Vérifier que la vidéo est publique

### La miniature ne s'affiche pas
- ✅ Vérifier que l'image existe dans `/public/blog/`
- ✅ Vérifier le chemin (commence par `/`)
- ✅ Vérifier le nom du fichier (sensible à la casse)

## 📞 Support

Si vous rencontrez un problème, vérifiez :
1. La console du navigateur (F12) pour les erreurs
2. Que vous êtes bien connecté à l'admin
3. Que la table `featured_videos` existe dans la base de données

---

**Félicitations ! Vous pouvez maintenant gérer vos vidéos mises en avant de manière totalement autonome ! 🎉**
