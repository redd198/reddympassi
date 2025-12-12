# 🚀 CRÉATION TABLE RESERVATIONS DANS SUPABASE

## 🎯 ÉTAPES RAPIDES DANS SUPABASE

### 1. Accéder à l'éditeur SQL
1. Dans ton dashboard Supabase
2. Cliquer sur "SQL Editor" dans le menu de gauche
3. Cliquer sur "New query"

### 2. Copier-coller ce script SQL
```sql
-- Créer la table reservations
CREATE TABLE IF NOT EXISTS public.reservations (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    email VARCHAR(255),
    theme VARCHAR(255),
    objectif TEXT,
    date_souhaitee DATE,
    heure_souhaitee TIME,
    paiement VARCHAR(50),
    statut VARCHAR(50) DEFAULT 'en_attente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_reservations_email ON public.reservations(email);
CREATE INDEX IF NOT EXISTS idx_reservations_statut ON public.reservations(statut);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON public.reservations(created_at);

-- Activer RLS (Row Level Security) - optionnel mais recommandé
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre l'insertion (pour le formulaire public)
CREATE POLICY "Allow public insert" ON public.reservations
    FOR INSERT WITH CHECK (true);

-- Créer une politique pour permettre la lecture (pour l'admin)
CREATE POLICY "Allow authenticated read" ON public.reservations
    FOR SELECT USING (auth.role() = 'authenticated');

-- Vérifier que la table est créée
SELECT COUNT(*) as total_reservations FROM public.reservations;

-- Afficher la structure de la table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'reservations' 
    AND table_schema = 'public'
ORDER BY ordinal_position;
```

### 3. Exécuter le script
1. Cliquer sur "Run" (ou Ctrl+Enter)
2. Vérifier qu'il n'y a pas d'erreurs
3. Tu devrais voir "Success. No rows returned" ou un message similaire

## 🔍 VÉRIFICATION DANS SUPABASE

### Option 1: Via l'interface Table Editor
1. Aller dans "Table Editor" dans le menu
2. Tu devrais voir la table "reservations" dans la liste
3. Cliquer dessus pour voir la structure

### Option 2: Via SQL Editor
```sql
-- Vérifier que la table existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name = 'reservations';

-- Voir la structure complète
\d public.reservations
```

## 📋 CORRESPONDANCE AVEC TON FORMULAIRE

### Champs du formulaire → Colonnes de la table :
- `nom` → `nom` (VARCHAR 255)
- `whatsapp` → `whatsapp` (VARCHAR 50) 
- `email` → `email` (VARCHAR 255)
- `theme` → `theme` (VARCHAR 255)
- `objectif` → `objectif` (TEXT)
- `date` → `date_souhaitee` (DATE)
- `heure` → `heure_souhaitee` (TIME)
- `paiement` → `paiement` (VARCHAR 50)

### Champs automatiques :
- `id` → Clé primaire auto-incrémentée
- `statut` → 'en_attente' par défaut
- `created_at` → Timestamp automatique
- `updated_at` → Timestamp automatique

## ✅ TEST IMMÉDIAT

### 1. Tester l'insertion manuelle
```sql
-- Test d'insertion dans Supabase
INSERT INTO public.reservations 
(nom, whatsapp, email, theme, objectif, date_souhaitee, heure_souhaitee, paiement)
VALUES 
('Test User', '+242123456789', 'test@example.com', 'E-commerce et vente en ligne', 
 'Test de fonctionnement', '2025-01-15', '14:30', 'Airtel Money');

-- Vérifier l'insertion
SELECT * FROM public.reservations ORDER BY created_at DESC LIMIT 1;

-- Supprimer le test
DELETE FROM public.reservations WHERE email = 'test@example.com';
```

### 2. Tester le formulaire sur ton site
1. Aller sur ton site de production
2. Naviguer vers la page de réservation
3. Remplir et soumettre le formulaire
4. Vérifier qu'il n'y a plus d'erreur

### 3. Vérifier les données dans Supabase
```sql
SELECT * FROM public.reservations ORDER BY created_at DESC;
```

## 🚨 NOTES IMPORTANTES SUPABASE

### RLS (Row Level Security)
- J'ai activé RLS pour la sécurité
- Politique d'insertion publique (pour le formulaire)
- Politique de lecture pour les utilisateurs authentifiés (admin)

### Si tu veux désactiver RLS temporairement :
```sql
ALTER TABLE public.reservations DISABLE ROW LEVEL SECURITY;
```

### Permissions API
- Supabase génère automatiquement une API REST
- L'endpoint sera : `https://ton-projet.supabase.co/rest/v1/reservations`
- Mais ton code utilise déjà le bon endpoint `/api/reservations`

## 🎉 RÉSULTAT ATTENDU

Après avoir exécuté ce script :
- ✅ Table `reservations` créée dans Supabase
- ✅ Formulaire de réservation fonctionnel
- ✅ Plus d'erreur "Erreur lors de l'envoi de la réservation"
- ✅ Données visibles dans l'interface Supabase