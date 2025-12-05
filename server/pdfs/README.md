# 📁 Dossier des PDFs des livres

## Instructions

Placez ici les fichiers PDF de vos livres avec le **nom exact** du livre.

### Exemple :
Si le livre s'appelle "Guide du Coaching", le fichier doit être :
```
Guide du Coaching.pdf
```

### Structure :
```
server/pdfs/
  Guide du Coaching.pdf
  Livre Marketing Digital.pdf
  Formation Leadership.pdf
  ...
```

## ⚠️ Important

- Le nom du fichier PDF doit correspondre EXACTEMENT au nom du livre dans la base de données
- Format accepté : PDF uniquement
- Taille recommandée : Moins de 25 MB (limite email)

## 🔒 Sécurité

Ce dossier ne doit PAS être accessible publiquement. Les PDFs sont envoyés uniquement par email après validation de la commande par l'admin.

## 📧 Envoi automatique

Lorsqu'un admin valide une commande :
1. Le système cherche le PDF dans ce dossier
2. Le PDF est envoyé par email en pièce jointe
3. Une notification WhatsApp est envoyée avec le lien du groupe

Si le PDF n'existe pas, l'email est quand même envoyé mais sans pièce jointe.
