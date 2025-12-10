-- Migration pour PostgreSQL - Tables leads et pdf_downloads

-- Table des leads (inscriptions livre gratuit, newsletter, etc.)
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100),
    telephone VARCHAR(20),
    email VARCHAR(255),
    whatsapp VARCHAR(20),
    preference VARCHAR(20) DEFAULT 'email', -- 'email' ou 'whatsapp'
    source VARCHAR(100) DEFAULT 'site-web', -- 'livre-gratuit', 'newsletter', 'webinaire', etc.
    produit VARCHAR(255), -- Nom du produit/service qui a généré le lead
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des téléchargements de PDF
CREATE TABLE IF NOT EXISTS pdf_downloads (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
    nom VARCHAR(200),
    email VARCHAR(255),
    telephone VARCHAR(20),
    livre VARCHAR(255) DEFAULT 'Économie Numérique en Afrique – Focus Congo-Brazzaville',
    ip_address VARCHAR(45),
    user_agent TEXT,
    source VARCHAR(100) DEFAULT 'livre-gratuit', -- 'livre-gratuit', 'direct', etc.
    email_sent BOOLEAN DEFAULT FALSE,
    download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_whatsapp ON leads(whatsapp);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

CREATE INDEX IF NOT EXISTS idx_pdf_downloads_email ON pdf_downloads(email);
CREATE INDEX IF NOT EXISTS idx_pdf_downloads_livre ON pdf_downloads(livre);
CREATE INDEX IF NOT EXISTS idx_pdf_downloads_date ON pdf_downloads(download_date);
CREATE INDEX IF NOT EXISTS idx_pdf_downloads_lead_id ON pdf_downloads(lead_id);

-- Contrainte unique pour éviter les doublons d'email dans les leads
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email_unique ON leads(email) WHERE email IS NOT NULL AND email != '';

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();