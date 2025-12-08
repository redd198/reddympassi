-- Migration pour système d'affiliation
-- MySQL Version

-- Table des affiliés
CREATE TABLE IF NOT EXISTS affiliates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(20) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100),
  email VARCHAR(100) NOT NULL UNIQUE,
  whatsapp VARCHAR(20),
  mobile_money_operateur ENUM('airtel', 'mtn', 'orange', 'moov') DEFAULT 'airtel',
  mobile_money_numero VARCHAR(20),
  statut ENUM('actif', 'suspendu', 'inactif') DEFAULT 'actif',
  total_clics INT DEFAULT 0,
  total_ventes INT DEFAULT 0,
  total_commissions DECIMAL(10,2) DEFAULT 0.00,
  commissions_payees DECIMAL(10,2) DEFAULT 0.00,
  commissions_en_attente DECIMAL(10,2) DEFAULT 0.00,
  palier INT DEFAULT 0,
  bonus_palier DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_email (email),
  INDEX idx_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des ventes affiliées
CREATE TABLE IF NOT EXISTS affiliate_sales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  affiliate_id INT NOT NULL,
  commande_id INT,
  reservation_id INT,
  client_nom VARCHAR(100),
  client_email VARCHAR(100),
  type_produit ENUM('formation', 'coaching', 'livre', 'autre') NOT NULL,
  nom_produit VARCHAR(255),
  montant_vente DECIMAL(10,2) NOT NULL,
  taux_commission DECIMAL(5,2) NOT NULL,
  montant_commission DECIMAL(10,2) NOT NULL,
  statut ENUM('en_attente', 'validee', 'payee', 'annulee') DEFAULT 'en_attente',
  date_validation TIMESTAMP NULL,
  date_paiement TIMESTAMP NULL,
  note_admin TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE,
  INDEX idx_affiliate (affiliate_id),
  INDEX idx_statut (statut),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des clics affiliés
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  affiliate_id INT NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  page_url VARCHAR(255),
  referer VARCHAR(255),
  pays VARCHAR(50),
  ville VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE,
  INDEX idx_affiliate (affiliate_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des paiements affiliés
CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  affiliate_id INT NOT NULL,
  montant DECIMAL(10,2) NOT NULL,
  methode_paiement ENUM('mobile_money', 'airtel_money', 'virement', 'autre') DEFAULT 'mobile_money',
  operateur VARCHAR(50),
  numero_destinataire VARCHAR(20),
  numero_transaction VARCHAR(100),
  statut ENUM('en_attente', 'en_cours', 'complete', 'echoue') DEFAULT 'en_attente',
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE,
  INDEX idx_affiliate (affiliate_id),
  INDEX idx_statut (statut),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des sessions de tracking (cookies)
CREATE TABLE IF NOT EXISTS affiliate_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  affiliate_id INT NOT NULL,
  session_token VARCHAR(100) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  first_page VARCHAR(255),
  converted BOOLEAN DEFAULT FALSE,
  conversion_id INT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE,
  INDEX idx_token (session_token),
  INDEX idx_affiliate (affiliate_id),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des matériaux marketing
CREATE TABLE IF NOT EXISTS affiliate_materials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titre VARCHAR(255) NOT NULL,
  type ENUM('banniere', 'texte', 'email', 'social') NOT NULL,
  format VARCHAR(50),
  contenu TEXT NOT NULL,
  url_image VARCHAR(500),
  dimensions VARCHAR(20),
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_actif (actif)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insérer des matériaux marketing par défaut
INSERT INTO affiliate_materials (titre, type, format, contenu, dimensions) VALUES
('Bannière Formation', 'banniere', 'image', 'Devenez expert en économie numérique avec Reddy Mpassi - Commission 30%', '728x90'),
('Post Facebook', 'social', 'texte', '🚀 Transformez votre avenir avec les formations de Reddy Mpassi en économie numérique ! 💰 Formations pratiques adaptées à l''Afrique. Rejoignez des centaines d''entrepreneurs qui ont déjà réussi. [VOTRE_LIEN]', NULL),
('Message WhatsApp', 'social', 'texte', 'Salut ! 👋 Je viens de découvrir les formations de Reddy Mpassi sur l''économie numérique en Afrique. C''est exactement ce qu''il nous faut pour réussir dans le digital ! Regarde ici : [VOTRE_LIEN]', NULL),
('Email Promotion', 'email', 'html', '<h2>Découvrez l''économie numérique africaine</h2><p>Formations premium par Reddy Mpassi, expert reconnu. Coaching personnalisé et ressources exclusives.</p><a href="[VOTRE_LIEN]">En savoir plus</a>', NULL);

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
LEFT JOIN affiliate_clicks ac ON a.id = ac.affiliate_id AND ac.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
LEFT JOIN affiliate_sales asales ON a.id = asales.affiliate_id
GROUP BY a.id;

-- Trigger pour mettre à jour les totaux affilié après vente
DELIMITER //
CREATE TRIGGER after_affiliate_sale_insert
AFTER INSERT ON affiliate_sales
FOR EACH ROW
BEGIN
  UPDATE affiliates 
  SET 
    total_ventes = total_ventes + 1,
    total_commissions = total_commissions + NEW.montant_commission,
    commissions_en_attente = commissions_en_attente + NEW.montant_commission
  WHERE id = NEW.affiliate_id;
END//

CREATE TRIGGER after_affiliate_sale_update
AFTER UPDATE ON affiliate_sales
FOR EACH ROW
BEGIN
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
END//

CREATE TRIGGER after_affiliate_click_insert
AFTER INSERT ON affiliate_clicks
FOR EACH ROW
BEGIN
  UPDATE affiliates 
  SET total_clics = total_clics + 1
  WHERE id = NEW.affiliate_id;
END//

DELIMITER ;

-- Fonction pour générer un code affilié unique
DELIMITER //
CREATE FUNCTION generate_affiliate_code(nom VARCHAR(100))
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
  DECLARE code VARCHAR(20);
  DECLARE counter INT DEFAULT 0;
  DECLARE code_exists INT;
  
  SET code = CONCAT(UPPER(LEFT(nom, 3)), LPAD(FLOOR(RAND() * 10000), 4, '0'));
  
  SELECT COUNT(*) INTO code_exists FROM affiliates WHERE affiliates.code = code;
  
  WHILE code_exists > 0 AND counter < 10 DO
    SET code = CONCAT(UPPER(LEFT(nom, 3)), LPAD(FLOOR(RAND() * 10000), 4, '0'));
    SELECT COUNT(*) INTO code_exists FROM affiliates WHERE affiliates.code = code;
    SET counter = counter + 1;
  END WHILE;
  
  RETURN code;
END//
DELIMITER ;

-- Index pour optimisation
CREATE INDEX idx_affiliate_sales_date ON affiliate_sales(created_at, statut);
CREATE INDEX idx_affiliate_clicks_date ON affiliate_clicks(created_at);
CREATE INDEX idx_sessions_expires ON affiliate_sessions(expires_at, converted);