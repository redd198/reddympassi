-- Migration pour ajouter les fonctionnalités Blog et Opportunités d'emploi

-- 1. Modifier la table newsletter pour supporter WhatsApp et différents types
ALTER TABLE newsletter ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);
ALTER TABLE newsletter ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'email';
-- type peut être: 'email', 'whatsapp', 'emploi'

-- 2. Créer la table des articles de blog
CREATE TABLE IF NOT EXISTS blog_articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(50),
  image VARCHAR(255),
  read_time VARCHAR(20) DEFAULT '5 min',
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Créer la table des opportunités d'emploi
CREATE TABLE IF NOT EXISTS opportunites_emploi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  type VARCHAR(50), -- 'CDI', 'CDD', 'Stage', 'Freelance', etc.
  description TEXT NOT NULL,
  requirements TEXT,
  salary VARCHAR(100),
  link VARCHAR(500),
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_newsletter_type ON newsletter(type);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_articles(published);
CREATE INDEX IF NOT EXISTS idx_emploi_published ON opportunites_emploi(published);
