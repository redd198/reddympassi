-- Migration pour système d'évaluation de projets
-- MySQL Version

CREATE TABLE IF NOT EXISTS project_evaluations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  whatsapp VARCHAR(20),
  preference ENUM('email', 'whatsapp') DEFAULT 'email',
  
  -- Réponses JSON
  reponses JSON NOT NULL,
  
  -- Statut de traitement
  statut ENUM('en_attente', 'en_cours', 'complete', 'envoyee') DEFAULT 'en_attente',
  
  -- Évaluation manuelle par l'équipe
  score_manuel INT,
  forces TEXT,
  faiblesses TEXT,
  recommandations TEXT,
  plan_action TEXT,
  
  -- Fichier PDF généré
  pdf_url VARCHAR(500),
  
  -- Dates
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  analysed_at TIMESTAMP NULL,
  sent_at TIMESTAMP NULL,
  
  INDEX idx_statut (statut),
  INDEX idx_created (created_at),
  INDEX idx_email (email),
  INDEX idx_whatsapp (whatsapp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table pour les notes de l'équipe
CREATE TABLE IF NOT EXISTS evaluation_notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  evaluation_id INT NOT NULL,
  admin_user VARCHAR(100),
  note TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (evaluation_id) REFERENCES project_evaluations(id) ON DELETE CASCADE,
  INDEX idx_evaluation (evaluation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;