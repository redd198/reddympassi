# ⚡ Guide Rapide : Configuration Email en 5 minutes

## 🎯 Ce dont vous avez besoin

- ✅ Un compte Gmail
- ✅ Accès à Render Dashboard
- ✅ 5 minutes

## 📝 Étapes rapides

### 1️⃣ Créer un mot de passe d'application Gmail (2 min)

**Lien direct :** https://myaccount.google.com/apppasswords

1. Connectez-vous à votre compte Gmail
2. Si demandé, activez la validation en 2 étapes
3. Nom de l'application : **"Nodemailer"**
4. Cliquez sur **"Créer"**
5. **COPIEZ** le mot de passe (16 caractères)
6. Enlevez les espaces : `abcd efgh ijkl mnop` → `abcdefghijklmnop`

### 2️⃣ Configurer sur Render (2 min)

**Lien direct :** https://dashboard.render.com

1. Cliquez sur votre service **backend**
2. Menu de gauche → **"Environment"**
3. Cliquez sur **"Add Environment Variable"**

**Ajoutez ces 3 variables :**

```
Key: EMAIL_USER
Value: votre-email@gmail.com
```

```
Key: EMAIL_PASSWORD
Value: abcdefghijklmnop (sans espaces)
```

```
Key: ADMIN_EMAIL
Value: reddympassi@gmail.com
```

4. Cliquez sur **"Save Changes"**

### 3️⃣ Attendre le redéploiement (1 min)

Render redéploie automatiquement. Attendez que le statut soit **"Live"**.

## ✅ Test rapide

1. Allez sur votre dashboard admin
2. Créez une commande avec **votre email**
3. Cliquez sur **"✓ Valider"**
4. Choisissez **"Email"**
5. Cliquez sur **"Valider et envoyer"**
6. Vous devriez voir : **"✅ Email envoyé avec succès"**
7. Vérifiez votre boîte email

## 🆘 Ça ne marche pas ?

### Erreur "Invalid login"
→ Régénérez un mot de passe d'application Gmail
→ Vérifiez qu'il n'y a pas d'espaces

### Email non reçu
→ Vérifiez votre dossier spam
→ Attendez 1-2 minutes

### Autre erreur
→ Consultez **CONFIGURATION-EMAIL-RENDER.md** pour le guide détaillé

## 🎉 C'est tout !

Votre système d'envoi automatique d'emails est maintenant configuré !

---

**Temps total : 5 minutes**
**Difficulté : Facile**
**Coût : Gratuit**
