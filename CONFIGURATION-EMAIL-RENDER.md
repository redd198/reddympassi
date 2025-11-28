# 📧 Configuration des variables d'environnement Email sur Render

## 🎯 Variables requises

Votre backend a besoin de ces 3 variables pour envoyer des emails :

```env
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-app-16-caracteres
ADMIN_EMAIL=reddympassi@gmail.com
```

## 📋 Étape 1 : Vérifier les variables existantes

### 1.1 Aller sur Render
1. Ouvrez https://dashboard.render.com
2. Connectez-vous à votre compte
3. Cliquez sur votre service **backend** (pas le frontend)

### 1.2 Accéder aux variables d'environnement
1. Dans le menu de gauche, cliquez sur **"Environment"**
2. Vous verrez la liste de toutes vos variables

### 1.3 Vérifier si elles existent
Cherchez ces 3 variables :
- ✅ `EMAIL_USER` → Doit contenir votre email Gmail
- ✅ `EMAIL_PASSWORD` → Doit contenir un mot de passe de 16 caractères
- ✅ `ADMIN_EMAIL` → Doit contenir reddympassi@gmail.com

## 🔧 Étape 2 : Créer un mot de passe d'application Gmail

**IMPORTANT :** N'utilisez PAS votre mot de passe Gmail normal !

### 2.1 Activer la validation en 2 étapes
1. Allez sur https://myaccount.google.com/security
2. Cherchez **"Validation en 2 étapes"**
3. Si ce n'est pas activé, cliquez sur **"Activer"**
4. Suivez les instructions (vous aurez besoin de votre téléphone)

### 2.2 Créer un mot de passe d'application
1. Une fois la validation en 2 étapes activée
2. Retournez sur https://myaccount.google.com/security
3. Cherchez **"Mots de passe des applications"** (App passwords)
4. Cliquez dessus
5. Vous devrez peut-être vous reconnecter

### 2.3 Générer le mot de passe
1. Dans "Sélectionner l'application", choisissez **"Autre (nom personnalisé)"**
2. Tapez : **"Nodemailer Portfolio"**
3. Cliquez sur **"Générer"**
4. Un mot de passe de 16 caractères apparaît (ex: `abcd efgh ijkl mnop`)
5. **COPIEZ-LE IMMÉDIATEMENT** (vous ne pourrez plus le voir après)

### 2.4 Format du mot de passe
```
Avec espaces : abcd efgh ijkl mnop
Sans espaces  : abcdefghijklmnop

⚠️ Sur Render, utilisez SANS espaces : abcdefghijklmnop
```

## ➕ Étape 3 : Ajouter/Modifier les variables sur Render

### 3.1 Si les variables n'existent PAS

1. Dans la page "Environment" de votre service backend
2. Cliquez sur **"Add Environment Variable"**
3. Ajoutez une par une :

**Variable 1 :**
```
Key: EMAIL_USER
Value: votre-email@gmail.com
```
Cliquez sur "Save"

**Variable 2 :**
```
Key: EMAIL_PASSWORD
Value: abcdefghijklmnop (votre mot de passe d'app sans espaces)
```
Cliquez sur "Save"

**Variable 3 :**
```
Key: ADMIN_EMAIL
Value: reddympassi@gmail.com
```
Cliquez sur "Save"

### 3.2 Si les variables existent DÉJÀ

1. Cliquez sur l'icône **"Edit"** (crayon) à côté de chaque variable
2. Modifiez la valeur
3. Cliquez sur "Save"

## 🔄 Étape 4 : Redéployer le service

**IMPORTANT :** Après avoir ajouté/modifié les variables, vous DEVEZ redéployer !

### Option A : Redéploiement automatique
1. Render redéploie automatiquement quand vous modifiez les variables
2. Attendez 5-10 minutes

### Option B : Redéploiement manuel
1. En haut à droite, cliquez sur **"Manual Deploy"**
2. Choisissez **"Deploy latest commit"**
3. Attendez que le statut passe à **"Live"**

## ✅ Étape 5 : Vérifier la configuration

### 5.1 Vérifier les logs
1. Dans votre service backend sur Render
2. Cliquez sur **"Logs"** dans le menu de gauche
3. Cherchez ces messages au démarrage :
```
🗄️  Base de données: PostgreSQL
🚀 Serveur démarré sur le port 10000
```

### 5.2 Tester l'envoi d'email
1. Allez sur votre dashboard admin
2. Créez une commande de test avec VOTRE email
3. Validez-la en choisissant "Email"
4. Vous devriez voir : "✅ Email envoyé avec succès"
5. Vérifiez votre boîte email

## 📧 Exemple de configuration complète

```env
# Variables d'environnement sur Render

# Base de données (déjà configurée)
DATABASE_URL=postgresql://...

# JWT (déjà configuré)
JWT_SECRET=votre-secret-jwt

# Email (À CONFIGURER)
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
ADMIN_EMAIL=reddympassi@gmail.com

# Port (automatique sur Render)
PORT=10000
```

## 🆘 Problèmes courants

### Problème 1 : "Invalid login: 535-5.7.8 Username and Password not accepted"

**Cause :** Mot de passe incorrect ou validation en 2 étapes non activée

**Solution :**
1. Vérifiez que la validation en 2 étapes est activée
2. Régénérez un nouveau mot de passe d'application
3. Copiez-le SANS espaces
4. Mettez à jour `EMAIL_PASSWORD` sur Render
5. Redéployez

### Problème 2 : "Error: Missing credentials for PLAIN"

**Cause :** Variables `EMAIL_USER` ou `EMAIL_PASSWORD` manquantes

**Solution :**
1. Vérifiez que les 2 variables existent sur Render
2. Vérifiez qu'elles ne sont pas vides
3. Redéployez

### Problème 3 : Email non reçu mais pas d'erreur

**Cause :** Email dans les spams ou délai de livraison

**Solution :**
1. Vérifiez votre dossier spam
2. Attendez 1-2 minutes
3. Vérifiez les logs du serveur pour "✅ Email de validation envoyé"

### Problème 4 : "EAUTH" error

**Cause :** Gmail bloque l'accès

**Solution :**
1. Allez sur https://myaccount.google.com/lesssecureapps
2. Ou utilisez un mot de passe d'application (recommandé)
3. Vérifiez que vous utilisez le bon email

## 🔍 Comment vérifier que tout fonctionne

### Test 1 : Vérifier les variables
```bash
# Dans les logs de Render, vous devriez voir au démarrage :
🚀 Serveur démarré sur le port 10000
```

### Test 2 : Tester l'envoi
1. Créez une commande avec votre email
2. Validez-la avec le canal "Email"
3. Vérifiez les logs :
```
✅ Email de validation envoyé au client
```

### Test 3 : Vérifier la réception
1. Ouvrez votre boîte email
2. Cherchez : "✅ Confirmation de votre commande"
3. L'email doit être bien formaté avec le design

## 📸 Captures d'écran des étapes

### Sur Render - Environment
```
┌─────────────────────────────────────────────────┐
│ Environment Variables                           │
├─────────────────────────────────────────────────┤
│ Key              │ Value                        │
├─────────────────────────────────────────────────┤
│ DATABASE_URL     │ postgresql://...             │
│ JWT_SECRET       │ ••••••••••••                 │
│ EMAIL_USER       │ votre-email@gmail.com        │
│ EMAIL_PASSWORD   │ ••••••••••••                 │
│ ADMIN_EMAIL      │ reddympassi@gmail.com        │
└─────────────────────────────────────────────────┘
```

### Sur Gmail - Mot de passe d'application
```
┌─────────────────────────────────────────────────┐
│ Votre mot de passe d'application                │
├─────────────────────────────────────────────────┤
│                                                 │
│   abcd efgh ijkl mnop                           │
│                                                 │
│ Utilisez ce mot de passe dans votre application│
│ au lieu de votre mot de passe Gmail habituel.  │
│                                                 │
│ [Copier]                                        │
└─────────────────────────────────────────────────┘
```

## ✅ Checklist finale

- [ ] Validation en 2 étapes activée sur Gmail
- [ ] Mot de passe d'application généré
- [ ] Mot de passe copié SANS espaces
- [ ] Variable `EMAIL_USER` ajoutée sur Render
- [ ] Variable `EMAIL_PASSWORD` ajoutée sur Render
- [ ] Variable `ADMIN_EMAIL` ajoutée sur Render
- [ ] Service redéployé
- [ ] Logs vérifiés (pas d'erreur)
- [ ] Test d'envoi effectué
- [ ] Email reçu et vérifié

## 🎉 Une fois configuré

Votre système d'envoi automatique d'emails sera pleinement opérationnel !

Chaque fois que vous validerez une commande par email, le client recevra automatiquement un email professionnel.

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs sur Render
2. Consultez la section "Problèmes courants" ci-dessus
3. Vérifiez que toutes les variables sont correctement configurées
