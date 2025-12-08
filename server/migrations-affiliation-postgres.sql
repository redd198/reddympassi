-- Migration pour système d'affiliation
-- PostgreSQL Version

-- Table des affiliés
CREATE TABLE IF NOT EXISTS affiliates (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100),
  email VARCHAR(100) NOT NULL UNIQUE,
  whatsapp VARCHAR(20),
  mobile_money_operateur VARCHAR(20) CHECK (mobile_money_operateur IN ('airtel', 'mtn', 'orange', 'moov')) DEFAULT 'airtel',
  mobile_money_numero VARCHAR(20),
  statut VARCHAR(20) CHECK (statut IN ('actif', 'suspendu', 'inactif')) DEFAULT 'actif',
  total_clics INT DEFAULT 0,
  total_ventes INT DEFAULT 0,
  total_commissions DECIMAL(10,2) DEFAULT 0.00,
  commissions_payees DECIMAL(10,2) DEFAULT 0.00,
  commissions_en_attente DECIMAL(10,2) DEFAULT 0.00,
  palier INT DEFAULT 0,
  bonus_palier DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_affiliates_code ON affiliates(code);
CREATE INDEX idx_affiliates_email ON affiliates(email);
CREATE INDEX idx_affiliates_statut ON affiliates(statut);

-- Table des ventes affiliées
CREATE TABLE IF NOT EXISTS affiliate_sales (
  id SERIAL PRIMARY KEY,
  affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  commande_id INT,
  reservation_id INT,
  client_nom VARCHAR(100),
  client_email VARCHAR(100),
  type_produit VARCHAR(20) CHECK (type_produit IN ('formation', 'coaching', 'livre', 'autre')) NOT NULL,
  nom_produit VARCHAR(255),
  montant_vente DECIMAL(10,2) NOT NULL,
  taux_commission DECIMAL(5,2) NOT NULL,
  montant_commission DECIMAL(10,2) NOT NULL,
  statut VARCHAR(20) CHECK (statut IN ('en_attente', 'validee', 'payee', 'annulee')) DEFAULT 'en_attente',
  date_validation TIMESTAMP NULL,
  date_paiement TIMESTAMP NULL,
  note_admin TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_affiliate_sales_affiliate ON affiliate_sales(affiliate_id);
CREATE INDEX idx_affiliate_sales_statut ON affiliate_sales(statut);
CREATE INDEX idx_affiliate_sales_created ON affiliate_sales(created_at);

-- Table des clics affiliés
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id SERIAL PRIMARY KEY,
  affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  page_url VARCHAR(255),
  referer VARCHAR(255),
  pays VARCHAR(50),
  ville VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_affiliate_clicks_affiliate ON affiliate_clicks(affiliate_id);
CREATE INDEX idx_affiliate_clicks_created ON affiliate_clicks(created_at);

-- Table des paiements affiliés
CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id SERIAL PRIMARY KEY,
  affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  montant DECIMAL(10,2) NOT NULL,
  methode_paiement VARCHAR(20) CHECK (methode_paiement IN ('mobile_money', 'airtel_money', 'virement', 'autre')) DEFAULT 'mobile_money',
  operateur VARCHAR(50),
  numero_destinataire VARCHAR(20),
  numero_transaction VARCHAR(100),
  statut VARCHAR(20) CHECK (statut IN ('en_attente', 'en_cours', 'complete', 'echoue')) DEFAULT 'en_attente',
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL
);

CREATE INDEX idx_affiliate_payouts_affiliate ON affiliate_payouts(affiliate_id);
CREATE INDEX idx_affiliate_payouts_statut ON affiliate_payouts(statut);
CREATE INDEX idx_affiliate_payouts_created ON affiliate_payouts(created_at);

-- Table des sessions de tracking
CREATE TABLE IF NOT EXISTS affiliate_sessions (
  id SERIAL PRIMARY KEY,
  affiliate_id INT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  session_token VARCHAR(100) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  first_page VARCHAR(255),
  converted BOOLEAN DEFAULT FALSE,
  conversion_id INT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_affiliate_sessions_token ON affiliate_sessions(session_token);
CREATE INDEX idx_affiliate_sessions_affiliate ON affiliate_sessions(affiliate_id);
CREATE INDEX idx_affiliate_sessions_expires ON affiliate_sessions(expires_at);

-- Table des matériaux marketing
CREATE TABLE IF NOT EXISTS affiliate_materials (
  id SERIAL PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('banniere', 'texte', 'email', 'social')) NOT NULL,
  format VARCHAR(50),
  contenu TEXT NOT NULL,
  url_image VARCHAR(500),
  dimensions VARCHAR(20),
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_affiliate_materials_type ON affiliate_materials(type);
CREATE INDEX idx_affiliate_materials_actif ON affiliate_materials(actif);

-- Insérer des matériaux marketing par défaut
INSERT INTO affiliate_materials (titre, type, format, contenu, dimensions) VALUES
('Bannière Formation', 'banniere', 'image', 'Devenez expert en économie numérique avec Reddy Mpassi - Commission 30%', '728x90'),
('Post Facebook', 'social', 'texte', '🚀 Transformez votre avenir avec les formations de Reddy Mpassi en économie numérique ! 💰 Formations pratiques adaptées à l''Afrique. Rejoignez des centaines d''entrepreneurs qui ont déjà réussi. [VOTRE_LIEN]', NULL),
('Message WhatsApp', 'social', 'texte', 'Salut ! 👋 Je viens de découvrir les formations de Reddy Mpassi sur l''économie numérique en Afrique. C''est exactement ce qu''il nous faut pour réussir dans le digital ! Regarde ici : [VOTRE_LIEN]', NULL),
('Email Promotion', 'email', 'html', '<h2>Découvrez l''économie numérique africaine</h2><p>Formations premium par Reddy Mpassi, expert reconnu. Coaching personnalisé et ressources exclusives.</p><a href="[VOTRE_LIEN]">En savoir plus</a>', NULL)
ON CONFLICT DO NOTHING;

-- Vue pour statistiques affiliés
CREATE OR REPLACE VIEW affiliate_stats AS
SELECT 
  a.id,
  a.code,
  a.nom,
  a.email,
  a.statut,
  a.total_clics,
  a.total_ventes,
  a.total_commissions,
  a.commissions_payees,
  a.commissions_en_attente,
  COUNT(DISTINCT ac.id) as clics_30j,
  COUNT(DISTINCT CASE WHEN asales.statut = 'validee' THEN asales.id END) as ventes_validees,
  COUNT(DISTINCT CASE WHEN asales.statut = 'payee' THEN asales.id END) as ventes_payees,
  COALESCE(SUM(CASE WHEN asales.statut IN ('validee', 'payee') THEN asales.montant_commission END), 0) as commissions_dues
FROM affiliates a
LEFT JOIN affiliate_clicks ac ON a.id = ac.affiliate_id AND ac.created_at >= NOW() - INTERVAL '30 days'
LEFT JOIN affiliate_sales asales ON a.id = asales.affiliate_id
GROUP BY a.id, a.code, a.nom, a.email, a.statut, a.total_clics, a.total_ventes, 
         a.total_commissions, a.commissions_payees, a.commissions_en_attente;

-- Fonction pour générer un code affilié unique
CREATE OR REPLACE FUNCTION generate_affiliate_code(nom_param VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
  code VARCHAR(20);
  counter INT := 0;
  code_exists INT;
BEGIN
  code := UPPER(LEFT(nom_param, 3)) || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  
  SELECT COUNT(*) INTO code_exists FROM affiliates WHERE affiliates.code = code;
  
  WHILE code_exists > 0 AND counter < 10 LOOP
    code := UPPER(LEFT(nom_param, 3)) || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    SELECT COUNT(*) INTO code_exists FROM affiliates WHERE affiliates.code = code;
    counter := counter + 1;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_affiliates_updated_at
BEFORE UPDATE ON affiliates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour mettre à jour les totaux affilié après vente
CREATE OR REPLACE FUNCTION update_affiliate_totals_after_sale()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE affiliates 
    SET 
      total_ventes = total_ventes + 1,
      total_commissions = total_commissions + NEW.montant_commission,
      commissions_en_attente = commissions_en_attente + NEW.montant_commission
    WHERE id = NEW.affiliate_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.statut = 'payee' AND OLD.statut != 'payee' THEN
      UPDATE affiliates 
      SET 
        commissions_payees = commissions_payees + NEW.montant_commission,
        commissions_en_attente = commissions_en_attente - NEW.montant_commission
      WHERE id = NEW.affiliate_id;
    END IF;
    
    IF NEW.statut = 'annulee' AND OLD.statut != 'annulee' THEN
      UPDATE affiliates 
      SET 
        total_ventes = total_ventes - 1,
        total_commissions = total_commissions - NEW.montant_commission,
        commissions_en_attente = commissions_en_attente - NEW.montant_commission
      WHERE id = NEW.affiliate_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_affiliate_sale_change
AFTER INSERT OR UPDATE ON affiliate_sales
FOR EACH ROW
EXECUTE FUNCTION update_affiliate_totals_after_sale();

-- Trigger pour mettre à jour les clics
CREATE OR REPLACE FUNCTION update_affiliate_clicks_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE affiliates 
  SET total_clics = total_clics + 1
  WHERE id = NEW.affiliate_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_affiliate_click_insert
AFTER INSERT ON affiliate_clicks
FOR EACH ROW
EXECUTE FUNCTION update_affiliate_clicks_count();