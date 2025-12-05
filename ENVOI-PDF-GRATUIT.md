# 📧 Solution gratuite : Envoi automatique du PDF

## 🎯 Objectif
Envoyer automatiquement le PDF du livre lors de la validation d'une commande par l'admin.

## 📋 Solution gratuite

### Option 1 : Email avec PDF en pièce jointe ✅
- **Avantages :** Gratuit, fiable, PDF attaché
- **Inconvénient :** Nécessite configuration SMTP

### Option 2 : WhatsApp avec notification ✅
- **Avantages :** Gratuit, instantané
- **Inconvénient :** Pas de pièce jointe (seulement lien)

### Solution combinée (RECOMMANDÉE) :
1. **Email** : Envoie le PDF en pièce jointe + lien groupe WhatsApp
2. **WhatsApp** : Notification avec lien groupe WhatsApp

---

## 🔧 Implémentation

### 1. Modifier `server/email.js`
Ajouter une fonction pour envoyer le PDF en pièce jointe :

```javascript
export const sendBookPDF = async (commande, pdfPath) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: commande.email,
    subject: `📚 Votre livre "${commande.livre}" est prêt !`,
    html: `
      <h2>Félicitations ${commande.nom} !</h2>
      <p>Votre livre <strong>"${commande.livre}"</strong> est prêt !</p>
      <p>Vous le trouverez en pièce jointe de cet email.</p>
      
      <h3>🎁 BONUS : Rejoignez notre communauté !</h3>
      <p>Accédez à des conseils exclusifs, des opportunités en avant-première et posez vos questions directement !</p>
      <p><a href="${process.env.WHATSAPP_GROUP_LINK}" style="background: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Rejoindre le groupe WhatsApp</a></p>
      
      <p>Merci pour votre confiance !<br>L'équipe</p>
    `,
    attachments: [
      {
        filename: `${commande.livre}.pdf`,
        path: pdfPath
      }
    ]
  }

  await transporter.sendMail(mailOptions)
}
```

### 2. Modifier la route de validation
Dans `server/server.js`, route `/api/admin/commandes/:id/valider` :

```javascript
// Après validation, envoyer le PDF par email
if (commande.email) {
  try {
    const pdfPath = `./pdfs/${commande.livre}.pdf` // Chemin vers le PDF
    await sendBookPDF(commande, pdfPath)
  } catch (error) {
    console.error('Erreur envoi PDF:', error)
  }
}

// Générer le lien WhatsApp avec notification
const whatsappMessage = `Bonjour ${commande.nom},

Félicitations ! Votre livre "${commande.livre}" vient d'être envoyé par email à ${commande.email} 📧

🎁 BONUS : Rejoignez notre communauté !
Accédez à des conseils exclusifs et des opportunités en avant-première !

👉 ${process.env.WHATSAPP_GROUP_LINK}

Merci pour votre confiance !`

const whatsappNumber = commande.whatsapp.replace(/[^0-9]/g, '')
const lien = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
```

### 3. Variables d'environnement à ajouter
Dans `.env` et sur Render :

```env
WHATSAPP_GROUP_LINK=https://chat.whatsapp.com/VOTRE_LIEN_GROUPE
```

---

## 📁 Structure des fichiers PDF

Créer un dossier `server/pdfs/` avec les livres :
```
server/
  pdfs/
    Livre1.pdf
    Livre2.pdf
    ...
```

---

## ⚠️ Limitations

1. **Taille des fichiers** : Les emails ont une limite (généralement 25 MB)
2. **SMTP sur Render** : Bloqué par défaut, utiliser un service externe (Gmail, SendGrid, etc.)
3. **WhatsApp** : Pas de pièce jointe automatique, seulement notification

---

## 🚀 Alternative : Héberger les PDF

Si l'email ne fonctionne pas, héberger les PDF sur le serveur :

1. Créer un dossier `public/books/`
2. Générer un lien unique : `https://votre-site.com/books/download?token=XXXXX`
3. Envoyer ce lien par email ET WhatsApp

---

Prêt à implémenter ?
