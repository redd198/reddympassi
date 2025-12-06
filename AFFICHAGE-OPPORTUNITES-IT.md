# 💼 Affichage des Opportunités d'Emploi IT

## 📍 Où s'affichent les opportunités ?

Les opportunités d'emploi IT que vous publiez depuis le dashboard admin s'affichent sur :

**Page Blog** : https://reddympassi.site/blog

### Emplacement exact :
1. **Articles de blog** (en haut)
2. **Opportunités IT** (au milieu) ← NOUVELLE SECTION
3. **Newsletter** (en bas)

## ✨ Fonctionnalités de la Section Opportunités

### Affichage des Offres
Chaque opportunité affiche :
- 💼 **Titre du poste**
- 🏢 **Nom de l'entreprise**
- 📍 **Localisation**
- 🏷️ **Type de contrat** (CDI, CDD, Stage, Freelance, Alternance)
- 📝 **Description complète**
- 🎯 **Compétences requises**
- 💰 **Salaire** (si renseigné)
- 📅 **Date de publication**

### Boutons d'Action
Deux options selon ce que vous configurez dans l'admin :

**Option 1 : Lien de candidature**
- Si vous renseignez un lien dans le champ "Lien candidature"
- Bouton violet "Postuler maintenant" qui ouvre le lien

**Option 2 : WhatsApp**
- Si aucun lien n'est renseigné
- Bouton vert "Postuler via WhatsApp"
- Ouvre WhatsApp avec un message pré-rempli

### Design
- 🎨 Cartes blanches avec bordure violette à gauche
- 🎯 Effet hover avec élévation
- 📱 Responsive (2 colonnes sur desktop, 1 sur mobile)
- 🌈 Dégradé de fond violet-bleu

## 🎯 Comment Publier une Opportunité

### Depuis le Dashboard Admin

1. **Se connecter** : https://reddympassi.site/admin

2. **Aller dans "Opportunités IT"** (menu latéral)

3. **Cliquer sur "+ Nouvelle opportunité"**

4. **Remplir le formulaire** :
   - Titre du poste *
   - Entreprise *
   - Lieu
   - Type de contrat * (CDI, CDD, Stage, Freelance, Alternance)
   - Description *
   - Compétences requises
   - Salaire
   - Lien candidature (optionnel)

5. **Cocher "Publier immédiatement"**

6. **Cliquer sur "Créer"**

### Résultat
✅ L'opportunité apparaît immédiatement sur https://reddympassi.site/blog

## 📊 Statuts des Opportunités

### Publié (✓)
- Visible sur la page Blog
- Accessible au public
- Badge vert dans l'admin

### Brouillon (○)
- Non visible sur la page Blog
- Visible uniquement dans l'admin
- Badge gris dans l'admin

## 🔄 Gestion des Opportunités

### Modifier une Opportunité
1. Aller dans "Opportunités IT"
2. Cliquer sur l'icône crayon (✏️)
3. Modifier les informations
4. Cliquer sur "Modifier"

### Supprimer une Opportunité
1. Aller dans "Opportunités IT"
2. Cliquer sur l'icône poubelle (🗑️)
3. Confirmer la suppression

### Dépublier une Opportunité
1. Modifier l'opportunité
2. Décocher "Publier immédiatement"
3. Sauvegarder

## 🎨 Exemple de Rendu

```
┌─────────────────────────────────────────────┐
│ 💼 Développeur Full Stack                   │
│ 🏢 Tech Solutions Congo                     │
│ 📍 Brazzaville  │ CDI                       │
│                                              │
│ Nous recherchons un développeur Full Stack  │
│ passionné pour rejoindre notre équipe...    │
│                                              │
│ 🎯 Compétences : React, Node.js, PostgreSQL │
│ 💰 Salaire : 500 000 - 800 000 FCFA        │
│                                              │
│ [Postuler maintenant →]                     │
│                                              │
│ Publié le 06/12/2024                        │
└─────────────────────────────────────────────┘
```

## 📱 CTA Newsletter Emploi

En bas de la section opportunités, un encadré invite les visiteurs à :
- 🔔 S'inscrire à la newsletter
- 📧 Recevoir les nouvelles opportunités
- 📲 Via Email ou WhatsApp

## 🚀 Déploiement

```bash
git add src/components/BlogPage.jsx
git commit -m "feat: ajout section opportunités IT sur page blog"
git push origin main
```

## 🧪 Test

1. Publier une opportunité depuis l'admin
2. Aller sur https://reddympassi.site/blog
3. Scroller jusqu'à la section "💼 Opportunités d'Emploi IT"
4. Vérifier que l'opportunité s'affiche correctement
5. Tester le bouton "Postuler"

## 💡 Conseils

### Pour Attirer Plus de Candidats
- ✅ Rédiger des descriptions claires et détaillées
- ✅ Mentionner le salaire si possible
- ✅ Lister les compétences requises précisément
- ✅ Ajouter un lien de candidature direct
- ✅ Mettre à jour régulièrement les offres

### Pour une Meilleure Visibilité
- 📢 Partager le lien de la page Blog sur les réseaux sociaux
- 📧 Envoyer les nouvelles opportunités via la newsletter
- 💬 Partager dans les groupes WhatsApp professionnels
- 🔗 Ajouter le lien dans votre signature email

## 🎯 Prochaines Améliorations Possibles

- 🔍 Filtres par type de contrat
- 🔍 Recherche par compétences
- 📊 Statistiques de vues par opportunité
- 📧 Alerte email automatique aux abonnés
- 💾 Sauvegarde des opportunités favorites
