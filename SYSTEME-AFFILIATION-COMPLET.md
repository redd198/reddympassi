# 🤝 SYSTÈME D'AFFILIATION COMPLET

## 🎯 STRATÉGIE D'AFFILIATION

### Structure de Commission
- **Formations** : 30% de commission
- **Coaching** : 20% de commission  
- **Livres** : 15% de commission

### Processus de Vente avec Affiliation
1. **Affilié partage son lien** → `reddympassi.com?ref=CODE_AFFILIE`
2. **Visiteur commande** → Système enregistre l'affilié
3. **Vous contactez client** → Paiement Mobile Money/Airtel Money
4. **Vous validez commande** → Commission calculée automatiquement
5. **Paiement affilié** → Mobile Money mensuel

---

## 📊 FONCTIONNALITÉS

### Pour les Affiliés
- ✅ Inscription simple avec code unique
- ✅ Dashboard personnel avec statistiques
- ✅ Liens trackés automatiquement
- ✅ Suivi des commissions en temps réel
- ✅ Matériel marketing (bannières, textes)
- ✅ Historique des ventes
- ✅ Demande de paiement

### Pour l'Admin
- ✅ Gestion des affiliés
- ✅ Validation des commissions
- ✅ Paiements groupés mensuels
- ✅ Statistiques détaillées
- ✅ Blocage/Déblocage affiliés

---

## 🗄️ STRUCTURE BASE DE DONNÉES

### Table: affiliates
```sql
CREATE TABLE affiliates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(20) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  whatsapp VARCHAR(20),
  mobile_money VARCHAR(20),
  statut ENUM('actif', 'suspendu', 'inactif') DEFAULT 'actif',
  total_ventes INT DEFAULT 0,
  total_commissions DECIMAL(10,2) DEFAULT 0,
  commissions_payees DECIMAL(10,2) DEFAULT 0,
  commissions_en_attente DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: affiliate_sales
```sql
CREATE TABLE affiliate_sales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  affiliate_id INT NOT NULL,
  commande_id INT,
  reservation_id INT,
  type_produit ENUM('formation', 'coaching', 'livre'),
  montant_vente DECIMAL(10,2) NOT NULL,
  taux_commission DECIMAL(5,2) NOT NULL,
  montant_commission DECIMAL(10,2) NOT NULL,
  statut ENUM('en_attente', 'validee', 'payee', 'annulee') DEFAULT 'en_attente',
  date_validation TIMESTAMP NULL,
  date_paiement TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (affiliate_id) REFERENCES affiliates(id)
);
```

### Table: affiliate_clicks
```sql
CREATE TABLE affiliate_clicks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  affiliate_id INT NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  page_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (affiliate_id) REFERENCES affiliates(id)
);
```

### Table: affiliate_payouts
```sql
CREATE TABLE affiliate_payouts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  affiliate_id INT NOT NULL,
  montant DECIMAL(10,2) NOT NULL,
  methode_paiement ENUM('mobile_money', 'airtel_money', 'virement'),
  numero_transaction VARCHAR(100),
  statut ENUM('en_attente', 'traite', 'complete') DEFAULT 'en_attente',
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP NULL,
  FOREIGN KEY (affiliate_id) REFERENCES affiliates(id)
);
```

---

## 🔧 IMPLÉMENTATION

### 1. Page d'inscription affilié
- Formulaire simple
- Génération code unique
- Validation email/WhatsApp

### 2. Dashboard affilié
- Statistiques personnelles
- Liens de partage
- Historique ventes
- Commissions

### 3. Tracking automatique
- Cookie 30 jours
- Attribution première visite
- Suivi conversions

### 4. Admin - Gestion affiliés
- Liste tous affiliés
- Validation commissions
- Paiements groupés
- Statistiques globales

---

## 💰 CALCUL COMMISSIONS

### Exemple Formation 50,000 FCFA
- Prix : 50,000 FCFA
- Commission 30% : 15,000 FCFA
- Affilié reçoit : 15,000 FCFA

### Exemple Coaching 100,000 FCFA
- Prix : 100,000 FCFA
- Commission 20% : 20,000 FCFA
- Affilié reçoit : 20,000 FCFA

### Seuil de paiement
- Minimum : 25,000 FCFA
- Paiement : Mensuel (fin de mois)
- Méthode : Mobile Money / Airtel Money

---

## 📱 MATÉRIEL MARKETING POUR AFFILIÉS

### Bannières
- 728x90 (Leaderboard)
- 300x250 (Rectangle)
- 160x600 (Skyscraper)

### Textes pré-écrits
- Posts Facebook
- Tweets
- Messages WhatsApp
- Stories Instagram

### Landing pages dédiées
- `/affiliation` - Inscription
- `/affiliation/dashboard` - Dashboard affilié
- `/affiliation/materiel` - Ressources marketing

---

## 🎯 STRATÉGIE DE RECRUTEMENT

### Cibles prioritaires
1. **Influenceurs tech africains**
2. **Blogueurs économie/business**
3. **Community managers**
4. **Étudiants entrepreneurs**
5. **Anciens clients satisfaits**

### Incentives
- **Bonus démarrage** : 10,000 FCFA pour 1ère vente
- **Paliers** : 
  - 5 ventes = +5% commission
  - 10 ventes = +10% commission
  - 20 ventes = +15% commission

### Concours mensuels
- Top 3 affiliés = Bonus cash
- Meilleur nouveau = Formation gratuite

---

## 📊 MÉTRIQUES À SUIVRE

### Pour chaque affilié
- Clics générés
- Taux de conversion
- Ventes totales
- Commissions gagnées
- Produits les plus vendus

### Globales
- Nombre d'affiliés actifs
- CA généré par affiliation
- Commissions totales payées
- ROI programme affiliation

---

## 🚀 PHASES DE DÉPLOIEMENT

### Phase 1 (Immédiat)
- ✅ Créer tables base de données
- ✅ Page inscription affilié
- ✅ Système tracking basique
- ✅ Dashboard affilié simple

### Phase 2 (Semaine 2)
- ✅ Admin - Gestion affiliés
- ✅ Calcul automatique commissions
- ✅ Matériel marketing
- ✅ Emails automatiques

### Phase 3 (Mois 1)
- ✅ Système paiement automatisé
- ✅ Statistiques avancées
- ✅ Programme de paliers
- ✅ API Mobile Money intégration

---

## 💡 AVANTAGES COMPÉTITIFS

### Pour vous
- 🚀 Croissance exponentielle
- 💰 Coût acquisition réduit
- 🎯 Marketing ciblé
- 📈 Scalabilité

### Pour les affiliés
- 💵 Revenus passifs
- 🎓 Produits de qualité
- 🤝 Support dédié
- 📊 Outils professionnels

---

## 📞 SUPPORT AFFILIÉS

### Ressources
- Guide complet PDF
- Vidéos tutoriels
- FAQ détaillée
- Groupe WhatsApp privé

### Contact
- Email : affilies@reddympassi.com
- WhatsApp : +242 05 04 16 661
- Réponse : < 24h

---

**Objectif 6 mois : 50 affiliés actifs générant 30% du CA total** 🎯