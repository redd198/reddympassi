-- Migration pour MySQL - Tables leads et pdf_downloads

-- Table des leads (inscriptions livre gratuit, newsletter, etc.)
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100),
    telephone VARCHAR(20),
    email VARCHAR(255),
    whatsapp VARCHAR(20),
    preference VARCHAR(20) DEFAULT 'email', -- 'email' ou 'whatsapp'
    source VARCHAR(100) DEFAULT 'site-web', -- 'livre-gratuit', 'newsletter', 'webinaire', etc.
    produit VARCHAR(255), -- Nom du produit/service qui a généré le lead
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email (email)
);

-- Table des téléchargements de PDF
CREATE TABLE IF NOT EXISTS pdf_downloads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id INT,
    nom VARCHAR(200),
    email VARCHAR(255),
    telephone VARCHAR(20),
    livre VARCHAR(255) DEFAULT 'Économie Numérique en Afrique – Focus Congo-Brazzaville',
    ip_address VARCHAR(45),
    user_agent TEXT,
    source VARCHAR(100) DEFAULT 'livre-gratuit', -- 'livre-gratuit', 'direct', etc.
    email_sent BOOLEAN DEFAULT FALSE,
    download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_whatsapp ON leads(whatsapp);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created_at ON leads(created_at);

CREATE INDEX idx_pdf_downloads_email ON pdf_downloads(email);
CREATE INDEX idx_pdf_downloads_livre ON pdf_downloads(livre);
CREATE INDEX idx_pdf_downloads_date ON pdf_downloads(download_date);
CREATE INDEX idx_pdf_downloads_lead_id ON pdf_downloads(lead_id);