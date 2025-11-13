# Configuration du domaine reddympassi.site

## ✅ Informations principales

**Domaine** : reddympassi.site  
**Email professionnel** : contact@reddympassi.site  
**WhatsApp** : +242 05 041 66 61  
**Site web** : https://reddympassi.site/

---

## 📧 Configuration Email (Zoho Mail)

### Paramètres IMAP (réception) :
- **Serveur** : imappro.zoho.com
- **Port** : 993
- **Sécurité** : SSL/TLS
- **Email** : contact@reddympassi.site
- **Mot de passe** : (votre mot de passe Zoho)

### Paramètres SMTP (envoi) :
- **Serveur** : smtppro.zoho.com
- **Port** : 465 (ou 587 avec TLS)
- **Sécurité** : SSL/TLS
- **Email** : contact@reddympassi.site
- **Mot de passe** : (votre mot de passe Zoho)

---

## 🌐 Configuration DNS (Hostinger)

### Enregistrements ajoutés :

1. **TXT - Vérification Zoho** :
   - Nom : @
   - Valeur : zoho-verification=zb56818431.zmverify.zoho.com

2. **TXT - SPF** :
   - Nom : @
   - Valeur : v=spf1 include:zohomail.com ~all

3. **MX - Serveur mail principal** :
   - Nom : @
   - Valeur : mx.zoho.com
   - Priorité : 10

4. **MX - Serveur mail secondaire** :
   - Nom : @
   - Valeur : mx2.zoho.com
   - Priorité : 20

5. **MX - Serveur mail tertiaire** :
   - Nom : @
   - Valeur : mx3.zoho.com
   - Priorité : 50

### À ajouter pour le site web (après configuration Render) :

6. **A - Domaine principal** :
   - Nom : @
   - Valeur : (IP fournie par Render)

7. **CNAME - Sous-domaine www** :
   - Nom : www
   - Valeur : reddympassi.onrender.com

---

## 🚀 Déploiement

**Backend API** : https://reddy-portfolio-api.onrender.com  
**Frontend** : https://reddympassi.onrender.com (à pointer vers reddympassi.site)  
**Base de données** : MySQL sur Railway

---

## 📝 Prochaines étapes

1. ✅ Email configuré
2. ⏳ Attendre propagation DNS (10-30 minutes)
3. ⏳ Configurer domaine personnalisé sur Render
4. ⏳ Tester l'email
5. ⏳ Connecter Outlook
6. ⏳ Pousser les changements du site (footer avec email)

---

## 💡 Accès rapides

- **Zoho Mail** : https://mail.zoho.com
- **Hostinger** : https://hpanel.hostinger.com
- **Render** : https://dashboard.render.com
- **Railway** : https://railway.app
- **GitHub** : https://github.com/redd198/reddympassi
