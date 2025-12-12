-- 🚀 SCRIPT FINAL SUPABASE - CRÉER TOUTES LES TABLES MANQUANTES

-- 1. Créer la table evaluations (pour ProjectEvaluator)
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

-- 2. Créer la table affiliations (pour AffiliatePage)
CREATE TABLE IF NOT EXISTS public.affiliations (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    whatsapp VARCHAR(50) NOT NULL,
    mobile_money_operateur VARCHAR(50),
    mobile_money_numero VARCHAR(50),
    code_affiliation VARCHAR(20) NOT NULL UNIQUE,
    lien_affiliation VARCHAR(500),
    statut VARCHAR(20) DEFAULT 'actif',
    commissions_gagnees DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_evaluations_email ON public.evaluations(email);
CREATE INDEX IF NOT EXISTS idx_evaluations_created_at ON public.evaluations(created_at);
CREATE INDEX IF NOT EXISTS idx_affiliations_email ON public.affiliations(email);
CREATE INDEX IF NOT EXISTS idx_affiliations_code ON public.affiliations(code_affiliation);
CREATE INDEX IF NOT EXISTS idx_affiliations_statut ON public.affiliations(statut);

-- 4. Activer RLS (Row Level Security)
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliations ENABLE ROW LEVEL SECURITY;

-- 5. Créer les politiques de sécurité
CREATE POLICY "Allow public insert evaluations" ON public.evaluations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert affiliations" ON public.affiliations
    FOR INSERT WITH CHECK (true);

-- 6. Vérification finale
SELECT 'Tables evaluations et affiliations créées avec succès !' as message;
SELECT COUNT(*) as evaluations_count FROM public.evaluations;
SELECT COUNT(*) as affiliations_count FROM public.affiliations;