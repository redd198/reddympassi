-- Migration pour créer la table reservations (PostgreSQL)

-- Créer la table reservations si elle n'existe pas
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    email VARCHAR(255),
    theme VARCHAR(255),
    objectif TEXT,
    date_souhaitee DATE,
    heure_souhaitee TIME,
    paiement VARCHAR(50),
    statut VARCHAR(50) DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer un index sur l'email pour les recherches
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(email);

-- Créer un index sur le statut pour les filtres
CREATE INDEX IF NOT EXISTS idx_reservations_statut ON reservations(statut);

-- Afficher le résultat
SELECT 'Table reservations créée avec succès' as message;