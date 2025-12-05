# 📧 Guide : Envoi automatique du PDF

## ✅ Ce qui a été implémenté

Lorsqu'un admin valide une commande, le système :
1. ✅ Envoie automatiquement le PDF par **email** (pièce jointe)
2. ✅ Envoie une **notification WhatsApp** avec le lien du groupe
3. ✅ Met à jour le statut de la commande à "validée"

---

## 🔧 Configuration requise

### 1. Ajouter la variable d'environnement sur Render

Va sur **render.com** → Ton service backend → **Environment** → Ajoute :

```
WHATSAPP_GROUP_LINK=https://chat.whatsapp.com/VOTRE_LIEN_GROUPE
```

**Comment obtenir le lien du groupe WhatsApp :**
1. Ouvre ton groupe WhatsApp
2. Clique sur le nom du groupe
3. "Inviter via un lien"
4. Copie le lien

---

### 2. Ajouter les PDFs sur le serveur

**Option A - Via Git (RECOMMANDÉ) :**
1. Place tes PDFs dans le dossier `server/pdfs/`
2. Nomme-les EXACTEMENT comme le nom du livre dans la base
3. Commit et push

**Option B - Via Render Shell :**
1. Va sur render.com → Ton service → Shell
2. Crée le dossier : `mkdir -p server/pdfs`
3. Upload les PDFs (via SFTP ou autre méthode)

**Exemple de structure :**
```
server/pdfs/
  Guide du Coaching.pdf
  Livre Marketing Digital.pdf
```

---

## 🎯 Comment ça fonctionne

### Scénario complet :

1. **Client commande un livre** sur le site
2. **Admin reçoit la notification** et voit la commande dans le dashboard
3. **Admin clique sur "Valider"** dans l'onglet Commandes
4. **Le système automatiquement :**
   - Cherche le PDF dans `server/pdfs/`
   - Envoie un email avec le PDF en pièce jointe
   - Génère un message WhatsApp avec le lien du groupe
   - Ouvre WhatsApp pour envoyer la notification
   - Change le statut à "Validée"

### Email envoyé au client :
```
Sujet : 📚 Votre livre "Nom du livre" est prêt !

Bonjour [Nom],

Félicitations ! Votre livre "[Titre]" est prêt !

Vous le trouverez en pièce jointe de cet email.

🎁 BONUS : Rejoignez notre communauté !
[Bouton : Rejoindre le groupe WhatsApp]

Merci pour votre confiance !
L'équipe
```

### Message WhatsApp envoyé :
```
Bonjour [Nom],

🎉 Félicitations ! Votre livre "[Titre]" vient d'être envoyé par email à [email] 📧

✅ Le PDF est en pièce jointe de l'email.

🎁 BONUS : Rejoignez notre communauté !
Accédez à des conseils exclusifs, des opportunités en avant-première et posez vos questions directement !

👉 [Lien du groupe WhatsApp]

Merci pour votre confiance !
L'équipe
```

---

## ⚠️ Limitations et solutions

### Problème 1 : Le PDF est trop gros (> 25 MB)
**Solution :** Compresse le PDF avec un outil en ligne ou utilise un hébergement cloud (Google Drive, Dropbox)

### Problème 2 : SMTP bloqué sur Render
**Solution :** Utilise un service SMTP externe :
- Gmail (gratuit, 500 emails/jour)
- SendGrid (gratuit, 100 emails/jour)
- Zoho Mail (déjà configuré)

### Problème 3 : Le PDF n'existe pas
**Résultat :** L'email est quand même envoyé mais sans pièce jointe. Le message WhatsApp indique de vérifier les spams.

---

## 🧪 Test

### Pour tester l'envoi :

1. **Crée une commande test** depuis le site
2. **Va dans le dashboard admin** → Onglet "Commandes"
3. **Clique sur "Valider"** pour la commande test
4. **Vérifie :**
   - ✅ Email reçu avec PDF en pièce jointe
   - ✅ WhatsApp s'ouvre avec le message
   - ✅ Statut passe à "Validée"

---

## 📊 Statistiques

Tu peux voir dans les logs du serveur :
- ✅ PDF envoyé par email
- ⚠️ Erreur envoi PDF (si le fichier n'existe pas)

---

## 🎁 Bonus : Personnalisation

Tu peux modifier les messages dans :
- `server/email.js` → fonction `sendBookPDF` (email)
- `server/server.js` → route `/api/admin/commandes/:id/valider` (WhatsApp)

---

Tout est prêt ! 🚀
