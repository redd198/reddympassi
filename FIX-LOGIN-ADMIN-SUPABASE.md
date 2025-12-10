# 🔧 FIX - Login Admin avec Supabase

## ❌ Problème

Le login admin ne fonctionne pas car le hash bcrypt du mot de passe ne correspond pas.

## ✅ SOLUTION

### Dans Supabase SQL Editor, exécute ce SQL :

```sql
-- Mettre à jour l'admin avec le bon hash bcrypt de "admin123"
UPDATE admins 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE username = 'admin';
```

Ce hash correspond au mot de passe **`admin123`**

### Puis connecte-toi avec :
- **Username** : `admin`
- **Password** : `admin123`

---

## 🔐 Pour créer un nouveau mot de passe hashé

Si tu veux utiliser un autre mot de passe, tu peux générer un hash bcrypt en ligne :
- https://bcrypt-generator.com/
- Rounds : 10
- Entre ton mot de passe
- Copie le hash généré
- Mets-le dans la base avec UPDATE

---

## ✅ Vérifier que ça fonctionne

1. Exécute le SQL ci-dessus dans Supabase
2. Va sur https://reddympassi.com/admin
3. Connecte-toi avec `admin` / `admin123`
4. Le dashboard devrait s'afficher

---

## 📊 Si ça ne fonctionne toujours pas

Vérifie dans Supabase que le mot de passe a bien été mis à jour :

```sql
SELECT username, password FROM admins;
```

Le password doit commencer par `$2a$10$N9qo8uLO...`
