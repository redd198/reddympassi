-- Migration pour système d'évaluation de projets
-- PostgreSQL Version

CREATE TABLE IF NOT EXISTS project_evaluations (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  whatsapp VARCHAR(20),
  preference VARCHAR(20) CHECK (preference IN ('email', 'whatsapp')) DEFAULT 'email',
  
  -- Réponses JSONB
  reponses JSONB NOT NULL,
  
  -- Statut de traitement
  statut VARCHAR(20) CHECK (statut IN ('en_attente', 'en_cours', 'complete', 'envoyee')) DEFAULT 'en_attente',
  
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
  sent_at TIMESTAMP NULL
);

CREATE INDEX idx_evaluations_statut ON project_evaluations(statut);
CREATE INDEX idx_evaluations_created ON project_evaluations(created_at);
CREATE INDEX idx_evaluations_email ON project_evaluations(email);
CREATE INDEX idx_evaluations_whatsapp ON project_evaluations(whatsapp);

-- Table pour les notes de l'équipe
CREATE TABLE IF NOT EXISTS evaluation_notes (
  id SERIAL PRIMARY KEY,
  evaluation_id INT NOT NULL REFERENCES project_evaluations(id) ON DELETE CASCADE,
  admin_user VARCHAR(100),
  note TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_evaluation_notes_evaluation ON evaluation_notes(evaluation_id);