# 📚 Configuration du PDF Livre Gratuit

## 🎯 Livre configuré

**Titre** : "Économie Numérique en Afrique – Focus Congo-Brazzaville"
**Fichier** : `EconomieNumériqueenAfriqueFocusCongo-Brazzaville.pdf`
**Emplacement** : `public/uploads/`

## 📁 Structure des fichiers

```
public/
└── uploads/
    └── EconomieNumériqueenAfriqueFocusCongo-Brazzaville.pdf
```

## ⚡ ÉTAPE IMPORTANTE : Placer le fichier PDF

**Tu dois maintenant :**

1. **Créer ou récupérer** ton fichier PDF du livre
2. **Le nommer exactement** : `EconomieNumériqueenAfriqueFocusCongo-Brazzaville.pdf`
3. **Le placer dans** : `public/uploads/EconomieNumériqueenAfriqueFocusCongo-Brazzaville.pdf`

## 🔧 Fonctionnement automatique

### Quand un utilisateur s'inscrit via le pop-up lead magnet :

1. ✅ **Données sauvegardées** dans la base (table `leads`)
2. ✅ **Email automatique envoyé** avec le PDF en pièce jointe
3. ✅ **Notification admin** reçue
4. ✅ **Invitation groupe WhatsApp** incluse dans l'email

### Email envoyé contient :

- **Sujet** : 📚 Votre livre "Économie Numérique en Afrique – Focus Congo-Brazzaville" est prêt !
- **Contenu** : Message de félicitations personnalisé
- **Pièce jointe** : Le PDF du livre
- **Bonus** : Lien vers le groupe WhatsApp

## 📊 Suivi dans l'admin

Tu peux voir tous les leads qui ont téléchargé le livre dans :
- **Admin Dashboard** > **Onglet "Leads"**
- Colonne "Produit" = "Livre gratuit"
- Colonne "Source" = "livre-gratuit"

## 🎨 Personnalisation du pop-up

Le pop-up lead magnet affiche maintenant :
- ✅ Économie Numérique en Afrique
- ✅ Focus Congo-Brazzaville  
- ✅ Analyse complète

## 🔄 Pour changer le livre plus tard

### 1. Remplacer le fichier PDF
Remplace le fichier dans `public/uploads/` par le nouveau PDF

### 2. Mettre à jour le nom (optionnel)
Dans `server/email.js`, ligne ~170 :
```javascript
const defaultBook = "Nouveau Titre du Livre"
```

### 3. Mettre à jour la description du pop-up (optionnel)
Dans `src/components/LeadMagnetPopup.jsx`, ligne ~175 :
```javascript
✅ Nouvelle description • ✅ Nouveau focus • ✅ Nouvelles ressources
```

## 🚀 Déploiement

Une fois le PDF placé dans `public/uploads/` :

```bash
git add .
git commit -m "feat: Ajout du PDF livre gratuit"
git push origin main
```

Le système fonctionnera automatiquement !

## ⚠️ Notes importantes

1. **Taille du fichier** : Garde le PDF sous 10 MB pour l'email
2. **Format du nom** : Pas d'espaces, utilise des tirets ou underscores
3. **Chemin exact** : `public/uploads/EconomieNumériqueenAfriqueFocusCongo-Brazzaville.pdf`
4. **Permissions** : Le fichier doit être accessible en lecture

## 🧪 Test

Pour tester :
1. Va sur ton site
2. Attends que le pop-up apparaisse (10 secondes ou scroll)
3. Remplis le formulaire avec ton email
4. Vérifie que tu reçois l'email avec le PDF

## 📞 Support

Si le PDF ne s'envoie pas :
1. Vérifie que le fichier existe dans `public/uploads/`
2. Vérifie les logs Render pour les erreurs
3. Teste avec un PDF plus petit d'abord