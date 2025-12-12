-- Migration complète pour le système d'affiliation avancé

-- 1. Améliorer la table affiliations existante
ALTER TABLE public.affiliations ADD COLUMN IF NOT EXISTS niveau VARCHAR(20) DEFAULT 'bronze';
ALTER TABLE public.affiliations ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0;
ALTER TABLE public.affiliations ADD COLUMN IF NOT EXISTS total_conversions INTEGER DEFAULT 0;
ALTER TABLE public.affiliations ADD COLUMN IF NOT EXISTS coaching_heures_restantes INTEGER DEFAULT 1;
ALTER TABLE public.affiliations ADD COLUMN IF NOT EXISTS lien_affiliation TEXT;

-- 2. Créer la table referrals pour tracker les clics et conversions
CREATE TABLE IF NOT EXISTS public.referrals (
    id BIGSERIAL PRIMARY KEY,
    code_affiliation VARCHAR(20) NOT NULL,
    ip_visiteur INET,
    user_agent TEXT,
    page_visitee VARCHAR(500),
    type_conversion VARCHAR(50), -- 'lead', 'commande', 'reservation', 'newsletter'
    conversion_id BIGINT, -- ID de la commande/réservation/lead
    commission_gagnee DECIMAL(10,2) DEFAULT 0.00,
    statut VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'paid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer la table commissions pour l'historique des gains
CREATE TABLE IF NOT EXISTS public.commissions (
    id BIGSERIAL PRIMARY KEY,
    code_affiliation VARCHAR(20) NOT NULL,
    type_recompense VARCHAR(50) NOT NULL, -- 'commission', 'coaching', 'reduction', 'acces_vip'
    montant DECIMAL(10,2),
    description TEXT,
    statut VARCHAR(20) DEFAULT 'pending', -- 'pending', 'delivered', 'used'
    referral_id BIGINT,
    date_attribution TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_utilisation TIMESTAMP WITH TIME ZONE
);

-- 4. Créer la table niveaux_affiliation pour la configuration
CREATE TABLE IF NOT EXISTS public.niveaux_affiliation (
    id BIGSERIAL PRIMARY KEY,
    niveau VARCHAR(20) UNIQUE NOT NULL,
    referrals_requis INTEGER NOT NULL,
    taux_commission DECIMAL(5,2) NOT NULL,
    coaching_heures INTEGER DEFAULT 0,
    avantages JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Insérer les niveaux par défaut
INSERT INTO public.niveaux_affiliation (niveau, referrals_requis, taux_commission, coaching_heures, avantages) 
VALUES 
    ('bronze', 0, 10.00, 1, '{"description": "Niveau débutant", "acces_communaute": true}'),
    ('argent', 6, 15.00, 2, '{"description": "Niveau intermédiaire", "acces_webinaires": true, "support_prioritaire": true}'),
    ('or', 16, 20.00, 5, '{"description": "Niveau expert", "acces_vip": true, "coaching_groupe": true, "materiel_exclusif": true}')
ON CONFLICT (niveau) DO NOTHING;

-- 6. Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(code_affiliation);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON public.referrals(created_at);
CREATE INDEX IF NOT EXISTS idx_referrals_type ON public.referrals(type_conversion);
CREATE INDEX IF NOT EXISTS idx_commissions_code ON public.commissions(code_affiliation);
CREATE INDEX IF NOT EXISTS idx_commissions_statut ON public.commissions(statut);

-- 7. Activer RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.niveaux_affiliation ENABLE ROW LEVEL SECURITY;

-- 8. Politiques RLS
CREATE POLICY "Allow insert referrals" ON public.referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read niveaux" ON public.niveaux_affiliation FOR SELECT USING (true);

-- 9. Fonction pour mettre à jour le niveau d'un affilié
CREATE OR REPLACE FUNCTION update_affiliate_level()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour les statistiques de l'affilié
    UPDATE public.affiliations 
    SET 
        total_referrals = (
            SELECT COUNT(*) FROM public.referrals 
            WHERE code_affiliation = NEW.code_affiliation
        ),
        total_conversions = (
            SELECT COUNT(*) FROM public.referrals 
            WHERE code_affiliation = NEW.code_affiliation 
            AND type_conversion IS NOT NULL
        ),
        commissions_gagnees = (
            SELECT COALESCE(SUM(commission_gagnee), 0) FROM public.referrals 
            WHERE code_affiliation = NEW.code_affiliation
        )
    WHERE code_affiliation = NEW.code_affiliation;
    
    -- Mettre à jour le niveau selon le nombre de référrals
    UPDATE public.affiliations 
    SET niveau = CASE 
        WHEN total_referrals >= 16 THEN 'or'
        WHEN total_referrals >= 6 THEN 'argent'
        ELSE 'bronze'
    END
    WHERE code_affiliation = NEW.code_affiliation;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Trigger pour mise à jour automatique
CREATE TRIGGER trigger_update_affiliate_level
    AFTER INSERT OR UPDATE ON public.referrals
    FOR EACH ROW
    EXECUTE FUNCTION update_affiliate_level();

SELECT 'Système d''affiliation avancé créé avec succès!' as message;