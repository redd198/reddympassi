-- Migration pour créer les tables manquantes dans Supabase

-- 1. Créer la table evaluations
CREATE TABLE IF NOT EXISTS public.evaluations (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    whatsapp VARCHAR(50),
    preference VARCHAR(20) NOT NULL,
    reponses JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour evaluations
CREATE INDEX IF NOT EXISTS idx_evaluations_email ON public.evaluations(email);
CREATE INDEX IF NOT EXISTS idx_evaluations_created_at ON public.evaluations(created_at);

-- 2. Créer la table affiliations
CREATE TABLE IF NOT EXISTS public.affiliations (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    whatsapp VARCHAR(50) NOT NULL,
    mobile_money_operateur VARCHAR(50),
    mobile_money_numero VARCHAR(50),
    code_affiliation VARCHAR(20) NOT NULL UNIQUE,
    statut VARCHAR(20) DEFAULT 'actif',
    commissions_gagnees DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour affiliations
CREATE INDEX IF NOT EXISTS idx_affiliations_email ON public.affiliations(email);
CREATE INDEX IF NOT EXISTS idx_affiliations_code ON public.affiliations(code_affiliation);
CREATE INDEX IF NOT EXISTS idx_affiliations_statut ON public.affiliations(statut);

-- Activer RLS pour les nouvelles tables
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliations ENABLE ROW LEVEL SECURITY;

-- Politiques pour evaluations
CREATE POLICY "Allow public insert evaluations" ON public.evaluations
    FOR INSERT WITH CHECK (true);

-- Politiques pour affiliations  
CREATE POLICY "Allow public insert affiliations" ON public.affiliations
    FOR INSERT WITH CHECK (true);

-- Vérification
SELECT 'Tables evaluations et affiliations créées avec succès' as message;