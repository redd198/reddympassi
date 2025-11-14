# Optimisation Mobile - Corrections des problèmes PageSpeed

## 🔴 Problèmes identifiés :

1. **Requêtes de blocage de l'affichage** : 1 460 ms
2. **Répartition du LCP** (Largest Contentful Paint)
3. **Détection de la requête LCP**
4. **Arborescence du réseau**
5. **Améliorer l'affichage des images** : 644 Kio à économiser

---

## ✅ Solutions à appliquer :

### 1. Optimiser les images

**Images à compresser** :
- `/reddy-mpassi.png` - Photo principale
- `/gallery/*.jpg` - Photos de la galerie
- `/projects/*.png` - Logos des projets
- `/books/*.png` - Couvertures de livres
- `/team/*.png` - Photos de l'équipe

**Actions** :
- Convertir en WebP (format plus léger)
- Compresser les images (qualité 80%)
- Ajouter des attributs `loading="lazy"` pour le chargement différé
- Utiliser des dimensions appropriées

### 2. Précharger les ressources critiques

Ajouter dans `<head>` :
```html
<link rel="preload" href="/reddy-mpassi.png" as="image" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

### 3. Optimiser le chargement des polices

Déjà fait avec `preconnect` ✅

### 4. Minifier le CSS et JS

Vite le fait automatiquement en production ✅

### 5. Ajouter des attributs width/height aux images

Évite le décalage de mise en page (CLS)

---

## 🛠️ Outils pour optimiser les images :

### En ligne (gratuit) :
- **TinyPNG** : https://tinypng.com/
- **Squoosh** : https://squoosh.app/
- **Compressor.io** : https://compressor.io/

### Commande (si vous avez ImageMagick) :
```bash
# Convertir en WebP
magick convert image.png -quality 80 image.webp

# Compresser PNG
magick convert image.png -quality 80 -strip image-optimized.png
```

---

## 📋 Checklist d'optimisation :

- [ ] Compresser toutes les images (TinyPNG)
- [ ] Convertir les grandes images en WebP
- [ ] Ajouter `loading="lazy"` aux images non critiques
- [ ] Ajouter `width` et `height` à toutes les images
- [ ] Précharger l'image principale
- [ ] Tester à nouveau sur PageSpeed Insights

---

## 🎯 Objectif :

- **Score mobile** : > 90
- **LCP** : < 2.5s
- **FID** : < 100ms
- **CLS** : < 0.1

---

## 📞 Note :

Les optimisations d'images nécessitent de compresser manuellement les fichiers avant de les ajouter au projet. Utilisez TinyPNG ou Squoosh pour chaque image.
