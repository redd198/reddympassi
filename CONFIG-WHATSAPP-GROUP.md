# 🎯 Configuration du groupe WhatsApp "Reddy Insider"

## Lien du groupe
```
https://chat.whatsapp.com/CeKVqgkTveWIOfBDmVPu08
```

## Configuration

### Sur Render (Production)
Variable d'environnement à ajouter :
- **Key :** `WHATSAPP_GROUP_LINK`
- **Value :** `https://chat.whatsapp.com/CeKVqgkTveWIOfBDmVPu08`

### En local (Développement)
Ajoute dans ton fichier `server/.env` :
```env
WHATSAPP_GROUP_LINK=https://chat.whatsapp.com/CeKVqgkTveWIOfBDmVPu08
```

---

## 📧 Où ce lien est utilisé

Le lien du groupe "Reddy Insider" est automatiquement inclus dans :

1. **Email de validation de commande** (avec le PDF)
   - Bouton cliquable "Rejoindre le groupe WhatsApp"
   
2. **Message WhatsApp de notification**
   - Lien direct dans le message

---

## 💬 Message type envoyé

### Email :
```
🎁 BONUS : Rejoignez notre communauté Reddy Insider !
Accédez à des conseils exclusifs, des opportunités en avant-première
et posez vos questions directement !

[Bouton : Rejoindre le groupe WhatsApp]
```

### WhatsApp :
```
🎁 BONUS : Rejoignez notre communauté !
Accédez à des conseils exclusifs, des opportunités en avant-première
et posez vos questions directement !

👉 https://chat.whatsapp.com/CeKVqgkTveWIOfBDmVPu08
```

---

## ✅ Vérification

Pour tester que ça fonctionne :
1. Crée une commande test sur le site
2. Valide-la depuis le dashboard admin
3. Vérifie que le lien du groupe apparaît dans l'email et le message WhatsApp

---

**Nom du groupe :** Reddy Insider 🎯
**Objectif :** Communauté exclusive pour les clients et abonnés
